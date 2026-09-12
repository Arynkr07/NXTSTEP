// app/api/user/career/route.ts // Toggle saved career (save/unsave) — replaces Firestore arrayUnion/arrayRemove 
import { NextRequest, NextResponse } from "next/server"; 
import { verifyAuthHeader } from "@/lib/firebase-admin"; 
import { createSupabaseServer } from "@/lib/supabase"; 
export const dynamic = "force-dynamic"; 
export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyAuthHeader(req.headers.get("authorization")); 
    if (!decoded) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); } 
    const supabase = createSupabaseServer(); 
    const uid = decoded.uid; 
    const body = await req.json() as { careerId: number; careerTitle: string; action: "save" | "unsave"; }; 
    const { careerId, careerTitle, action } = body; 
    if (!careerId || !action) { return NextResponse.json({ error: "careerId and action are required" }, { status: 400 }); } 
    
    // Ensure user row exists 
    const { error: userError } = await supabase .from("users") .upsert( { firebase_uid: uid }, { onConflict: "firebase_uid", ignoreDuplicates: true } ); 
    if (userError) console.warn("User upsert warning:", userError);
    
    if (action === "save") { 
      const { error } = await supabase.from("saved_careers").upsert( { firebase_uid: uid, career_id: careerId, career_title: careerTitle }, { onConflict: "firebase_uid,career_id", ignoreDuplicates: true } ); 
      if (error) return NextResponse.json({ error: error.message }, { status: 500 }); 
    } else { 
      const { error } = await supabase .from("saved_careers") .delete() .eq("firebase_uid", uid) .eq("career_id", careerId); 
      if (error) return NextResponse.json({ error: error.message }, { status: 500 }); 
    } 
    return NextResponse.json({ success: true, action }); 
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
} 
export async function GET(req: NextRequest) { 
  try {
    const decoded = await verifyAuthHeader(req.headers.get("authorization")); 
    if (!decoded) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); } 
    const supabase = createSupabaseServer(); 
    const { data, error } = await supabase .from("saved_careers") .select("career_id, career_title") .eq("firebase_uid", decoded.uid); 
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ savedCareers: data ?? [] }); 
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
} 