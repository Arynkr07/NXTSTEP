// app/api/roadmap/save/route.ts
// Direct endpoint to persist AI-generated career roadmaps to Supabase

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/firebase-admin";
import { createSupabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const decoded = await verifyAuthHeader(authHeader);

    if (!decoded || !decoded.uid) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to save roadmaps." },
        { status: 401 }
      );
    }

    const uid = decoded.uid;
    const body = (await req.json()) as {
      careerTitle: string;
      roadmapContent: string;
      skillsInput?: string[];
    };

    const { careerTitle, roadmapContent, skillsInput = [] } = body;

    if (!careerTitle || !roadmapContent) {
      return NextResponse.json(
        { error: "careerTitle and roadmapContent are required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServer();

    // 1. Ensure user row exists (satisfying foreign key constraint)
    const { error: userUpsertError } = await supabase
      .from("users")
      .upsert(
        { firebase_uid: uid },
        { onConflict: "firebase_uid", ignoreDuplicates: true }
      );

    if (userUpsertError) {
      console.warn("[roadmap/save] User upsert warning:", userUpsertError.message);
    }

    // 2. Check if a roadmap for this user + career already exists
    const { data: existing } = await supabase
      .from("saved_roadmaps")
      .select("id")
      .eq("firebase_uid", uid)
      .eq("career_title", careerTitle)
      .maybeSingle();

    let savedData;

    if (existing?.id) {
      // Update existing roadmap
      const { data, error } = await supabase
        .from("saved_roadmaps")
        .update({
          roadmap_content: roadmapContent,
          skills_input: skillsInput,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("[roadmap/save] Update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      savedData = data;
    } else {
      // Insert new roadmap
      const { data, error } = await supabase
        .from("saved_roadmaps")
        .insert({
          firebase_uid: uid,
          career_title: careerTitle,
          skills_input: skillsInput,
          roadmap_content: roadmapContent,
        })
        .select()
        .single();

      if (error) {
        console.error("[roadmap/save] Insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      savedData = data;
    }

    return NextResponse.json({ success: true, roadmap: savedData });
  } catch (error: any) {
    console.error("[roadmap/save] Unhandled error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
