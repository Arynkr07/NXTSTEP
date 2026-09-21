// lib/supabase.ts
// Supabase client factory
// - Server-side: use createSupabaseServer() with SERVICE_ROLE_KEY (bypasses RLS)
// - Client-side: use createSupabaseBrowser() with ANON_KEY

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── Types ────────────────────────────────────────────────────────────────────

export interface SupabaseUser {
  firebase_uid: string;
  email: string | null;
  username: string | null;
  interests: string[];
  skills: string[];
  work_style: string | null;
  education_level: string | null;
  salary_expectation: string | null;
  liked_career_ids: number[];
  created_at: string;
  updated_at: string;
}

export interface SavedRoadmap {
  id: string;
  firebase_uid: string;
  career_title: string;
  skills_input: string[];
  roadmap_content: string;
  completed_steps?: number[];
  created_at: string;
}

export interface SavedCareer {
  id: string;
  firebase_uid: string;
  career_id: number;
  career_title: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  firebase_uid: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface CareerEmbedding {
  id: string;
  career_title: string;
  content: string;
  metadata: Record<string, string | string[] | number | null>;
  similarity?: number;
}

// ── Clients ──────────────────────────────────────────────────────────────────

let serverClient: SupabaseClient | null = null;
let browserClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the service role key.
 * Use ONLY in API routes — falls back to anon key if service role key is not yet configured.
 */
export function createSupabaseServer(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE keys must be set in .env.local');
  }

  if (!serverClient) {
    serverClient = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return serverClient;
}

/**
 * Browser-safe Supabase client using the anon key.
 * RLS policies protect data — this is safe for client components.
 */
export function createSupabaseBrowser(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('createSupabaseBrowser() must only be called in the browser.');
  }
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}
