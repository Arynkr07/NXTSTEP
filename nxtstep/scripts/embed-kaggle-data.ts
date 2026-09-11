#!/usr/bin/env tsx
/**
 * scripts/embed-kaggle-data.ts
 *
 * Seeds Supabase career_embeddings table from the LinkedIn 1.3M Jobs dataset.
 *
 * Usage:
 *   npx tsx scripts/embed-kaggle-data.ts
 *   npx tsx scripts/embed-kaggle-data.ts --limit 1000
 *   npx tsx scripts/embed-kaggle-data.ts --limit 5000 --reset
 *
 * Requirements:
 *   - KAGGLE_USERNAME and KAGGLE_KEY in .env.local
 *   - GEMINI_API_KEY in .env.local
 *   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * The script is idempotent — rows with the same (career_title, source) are skipped.
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Load .env.local manually (tsx doesn't load dotenv automatically) ──────────
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key?.trim() && !key.startsWith("#")) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
}

// ── Config ────────────────────────────────────────────────────────────────────
const LIMIT = (() => {
  const idx = process.argv.indexOf("--limit");
  return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : 2000;
})();

const RESET = process.argv.includes("--reset");
const BATCH_SIZE = 5;           // Embeddings per batch (rate limit safety)
const DELAY_MS = 1200;          // Delay between embedding batches
const SOURCE = "linkedin-kaggle-2024";
const PROGRESS_FILE = ".seed-progress.json";
const CSV_PATH = path.join(process.cwd(), "scripts", "job_postings.csv");
const DATASET_SLUG = "asaniczka/1-3m-linkedin-jobs-and-skills-2024";

// ── Career category normalization ─────────────────────────────────────────────
const CAREER_CATEGORIES: Array<{ keywords: string[]; category: string }> = [
  { keywords: ["software", "developer", "engineer", "programmer", "coding", "backend", "frontend", "fullstack", "swe"], category: "Software Engineering" },
  { keywords: ["data scientist", "machine learning", "ml engineer", "ai engineer", "deep learning"], category: "Data Science & AI" },
  { keywords: ["data analyst", "business analyst", "analytics", "bi analyst", "data engineer"], category: "Data Analytics" },
  { keywords: ["product manager", "product owner", "pm", "product lead"], category: "Product Management" },
  { keywords: ["designer", "ux", "ui", "design", "figma", "user experience"], category: "UX/UI Design" },
  { keywords: ["marketing", "seo", "content", "growth", "digital marketing", "social media"], category: "Digital Marketing" },
  { keywords: ["finance", "financial analyst", "investment", "banking", "accounting", "cpa", "cfa"], category: "Finance" },
  { keywords: ["cybersecurity", "security analyst", "infosec", "penetration", "soc analyst"], category: "Cybersecurity" },
  { keywords: ["devops", "sre", "cloud engineer", "infrastructure", "platform engineer", "kubernetes"], category: "DevOps & Cloud" },
  { keywords: ["sales", "account executive", "business development", "account manager"], category: "Sales" },
  { keywords: ["hr", "human resources", "recruiter", "talent acquisition", "people ops"], category: "Human Resources" },
  { keywords: ["operations", "supply chain", "logistics", "warehouse", "procurement"], category: "Operations" },
  { keywords: ["legal", "lawyer", "attorney", "compliance", "paralegal", "counsel"], category: "Legal" },
  { keywords: ["healthcare", "nurse", "doctor", "pharmacist", "clinical", "medical"], category: "Healthcare" },
  { keywords: ["teacher", "instructor", "educator", "professor", "tutor", "curriculum"], category: "Education" },
];

function normalizeToCategory(title: string): string {
  const lower = title.toLowerCase();
  for (const { keywords, category } of CAREER_CATEGORIES) {
    if (keywords.some((k) => lower.includes(k))) return category;
  }
  return "Other";
}

// ── Progress persistence ───────────────────────────────────────────────────────
function loadProgress(): { processedRows: number; insertedRows: number } {
  if (RESET || !fs.existsSync(PROGRESS_FILE)) {
    return { processedRows: 0, insertedRows: 0 };
  }
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
  } catch {
    return { processedRows: 0, insertedRows: 0 };
  }
}

function saveProgress(processedRows: number, insertedRows: number) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ processedRows, insertedRows }, null, 2));
}

// ── Kaggle CSV download & extraction ──────────────────────────────────────────
async function downloadKaggleCSV() {
  // Check if any CSV already exists in scripts directory
  const scriptDir = path.join(process.cwd(), "scripts");
  if (!fs.existsSync(scriptDir)) fs.mkdirSync(scriptDir, { recursive: true });

  const existingCsv = fs.readdirSync(scriptDir).find(f => f.endsWith(".csv"));
  if (existingCsv) {
    console.log(`\n♻️  Found local dataset CSV: scripts/${existingCsv}`);
    return path.join(scriptDir, existingCsv);
  }

  const username = process.env.KAGGLE_USERNAME;
  const key = process.env.KAGGLE_KEY;

  if (!username || !key) {
    throw new Error(
      "KAGGLE_USERNAME and KAGGLE_KEY must be set in .env.local.\n" +
      "Or manually download the CSV from https://www.kaggle.com/datasets/asaniczka/1-3m-linkedin-jobs-and-skills-2024\n" +
      "and place it inside the 'scripts/' directory."
    );
  }

  console.log("📥 Downloading LinkedIn jobs dataset from Kaggle API...");
  console.log("   Dataset:", DATASET_SLUG);

  // Kaggle dataset download URL
  const apiUrl = `https://www.kaggle.com/api/v1/datasets/download/${DATASET_SLUG}`;
  const auth = Buffer.from(`${username}:${key}`).toString("base64");

  const res = await fetch(apiUrl, {
    headers: { Authorization: `Basic ${auth}` },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(
      `Kaggle API returned ${res.status}: ${await res.text()}\n` +
      `Tip: Make sure you accepted the dataset terms on Kaggle, or download the dataset manually from:\n` +
      `https://www.kaggle.com/datasets/asaniczka/1-3m-linkedin-jobs-and-skills-2024\n` +
      `and extract the CSV into scripts/`
    );
  }

  const zipPath = path.join(scriptDir, "dataset.zip");
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(zipPath, buffer);
  console.log(`📦 Dataset archive downloaded (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);

  // Extract using PowerShell expand-archive or tar
  console.log("📂 Extracting dataset...");
  const { execSync } = await import("child_process");
  try {
    execSync(`tar -xf "${zipPath}" -C "${scriptDir}"`, { stdio: "ignore" });
  } catch {
    try {
      execSync(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${scriptDir}' -Force"`, { stdio: "ignore" });
    } catch (e: any) {
      console.warn("Could not auto-extract zip. Please extract scripts/dataset.zip manually.");
    }
  }

  // Cleanup zip
  if (fs.existsSync(zipPath)) {
    try { fs.unlinkSync(zipPath); } catch {}
  }

  const foundCsv = fs.readdirSync(scriptDir).find(f => f.endsWith(".csv"));
  if (foundCsv) {
    const resolvedPath = path.join(scriptDir, foundCsv);
    console.log(`✅ Extracted CSV ready: scripts/${foundCsv}`);
    return resolvedPath;
  }

  return CSV_PATH;
}

// ── Parse CSV row by row ───────────────────────────────────────────────────────
async function* parseCSV(filePath: string): AsyncGenerator<Record<string, string>> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headers: string[] = [];
  let isFirst = true;

  for await (const line of rl) {
    if (isFirst) {
      headers = parseCSVLine(line);
      isFirst = false;
      continue;
    }
    if (!line.trim()) continue;

    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    yield row;
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀 NxtStep — Kaggle LinkedIn Jobs Embedding Seed Script");
  console.log("=".repeat(55));
  console.log(`   Limit: ${LIMIT} rows | Batch: ${BATCH_SIZE} | Delay: ${DELAY_MS}ms`);
  console.log(`   Reset: ${RESET}`);

  // Check required env vars
  const required = ["GEMINI_API_KEY", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
  }

  // Download CSV or locate existing
  const activeCsvPath = await downloadKaggleCSV();

  // Init clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const progress = loadProgress();
  let { processedRows, insertedRows } = progress;

  console.log(`\n▶  Resuming from row ${processedRows} (${insertedRows} already inserted)`);

  // Buffer for batch embedding
  let batch: Array<{
    title: string;
    category: string;
    content: string;
    metadata: Record<string, string | string[]>;
  }> = [];

  let rowIndex = 0;

  async function flushBatch() {
    if (batch.length === 0) return;

    // Generate embeddings for the batch
    const embeddings = await Promise.all(
      batch.map(async (item) => {
        try {
          const result = await embedModel.embedContent(item.content);
          return result.embedding.values;
        } catch {
          return null;
        }
      })
    );

    // Insert into Supabase
    const toInsert = batch
      .map((item, i) => ({
        career_title: item.category,
        content: item.content,
        embedding: embeddings[i],
        metadata: item.metadata,
        source: SOURCE,
      }))
      .filter((row) => row.embedding !== null);

    if (toInsert.length > 0) {
      const { error } = await supabase
        .from("career_embeddings")
        .upsert(toInsert, { onConflict: "career_title,source", ignoreDuplicates: true });

      if (error && !error.message.includes("duplicate")) {
        console.error("  ⚠️  Insert error:", error.message);
      } else {
        insertedRows += toInsert.length;
        process.stdout.write(`\r  ✅ Processed: ${processedRows} | Inserted: ${insertedRows}`);
      }
    }

    saveProgress(processedRows, insertedRows);
    batch = [];

    // Rate limit delay
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  for await (const row of parseCSV(activeCsvPath)) {
    rowIndex++;

    // Skip already-processed rows
    if (rowIndex <= processedRows) continue;

    // Stop at limit
    if (insertedRows >= LIMIT) break;

    const title = (row["title"] || row["job_title"] || "").trim();
    if (!title) continue;

    const description = (row["description"] || "").slice(0, 500).trim();
    const skills = (row["skills_desc"] || row["skills"] || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 15);
    const salary = row["normalized_salary"] || row["med_salary"] || "";
    const seniority = row["formatted_experience_level"] || row["seniority_level"] || "";
    const location = row["location"] || "";

    const category = normalizeToCategory(title);

    // Build embedding content
    const content = [
      `Job Title: ${title}`,
      `Career Category: ${category}`,
      description ? `Description: ${description}` : "",
      skills.length > 0 ? `Required Skills: ${skills.join(", ")}` : "",
      seniority ? `Experience Level: ${seniority}` : "",
      salary ? `Salary: ${salary}` : "",
      location ? `Location: ${location}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    batch.push({
      title,
      category,
      content,
      metadata: {
        job_title: title,
        skills,
        salary_range: salary,
        seniority_level: seniority,
        location,
      },
    });

    processedRows = rowIndex;

    if (batch.length >= BATCH_SIZE) {
      await flushBatch();
    }
  }

  // Flush remaining
  await flushBatch();

  console.log("\n\n🎉 Seeding complete!");
  console.log(`   Processed: ${processedRows} rows`);
  console.log(`   Inserted:  ${insertedRows} embeddings`);

  // Clean up progress file
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
  }
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
