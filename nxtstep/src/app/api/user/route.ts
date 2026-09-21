// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/firebase-admin";
import { createSupabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyAuthHeader(req.headers.get("authorization"));
    if (!decoded || !decoded.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseServer();
    const uid = decoded.uid;

    const { data: savedCareers, error: careersError } = await supabase
      .from("saved_careers")
      .select("career_id, career_title")
      .eq("firebase_uid", uid);

    if (careersError) {
      console.error("[/api/user] Failed to fetch saved careers:", careersError);
    }

    const { data: savedRoadmaps, error: roadmapsError } = await supabase
      .from("saved_roadmaps")
      .select("id, career_title, skills_input, roadmap_content, completed_steps, created_at")
      .eq("firebase_uid", uid)
      .order("created_at", { ascending: false });

    if (roadmapsError) {
      console.error("[/api/user] Failed to fetch saved roadmaps:", roadmapsError);
    }

    return NextResponse.json({
      savedCareers: savedCareers ?? [],
      savedRoadmaps: savedRoadmaps ?? [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyAuthHeader(req.headers.get("authorization"));
    if (!decoded || !decoded.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseServer();
    const uid = decoded.uid;

    let email: string | null = decoded.email || null;
    try {
      const body = await req.json();
      if (body.email) email = body.email;
    } catch {}

    const { error } = await supabase
      .from("users")
      .upsert(
        { firebase_uid: uid, email },
        { onConflict: "firebase_uid", ignoreDuplicates: true }
      );

    if (error) {
      console.warn("[/api/user] User upsert warning:", error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const decoded = await verifyAuthHeader(req.headers.get("authorization"));
    if (!decoded || !decoded.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get("roadmapId");

    if (!roadmapId) {
      return NextResponse.json({ error: "roadmapId is required" }, { status: 400 });
    }

    const supabase = createSupabaseServer();
    const uid = decoded.uid;

    const { error } = await supabase
      .from("saved_roadmaps")
      .delete()
      .eq("id", roadmapId)
      .eq("firebase_uid", uid);

    if (error) {
      console.error("[/api/user] Failed to delete roadmap:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const decoded = await verifyAuthHeader(req.headers.get("authorization"));
    if (!decoded || !decoded.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId, completedSteps } = (await req.json()) as {
      roadmapId: string;
      completedSteps: number[];
    };

    if (!roadmapId) {
      return NextResponse.json({ error: "roadmapId is required" }, { status: 400 });
    }

    const supabase = createSupabaseServer();
    const uid = decoded.uid;

    const { error } = await supabase
      .from("saved_roadmaps")
      .update({ completed_steps: completedSteps })
      .eq("id", roadmapId)
      .eq("firebase_uid", uid);

    if (error) {
      console.warn("[/api/user] PATCH error updating completed_steps:", error.message);
    }

    return NextResponse.json({ success: true, completedSteps });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
