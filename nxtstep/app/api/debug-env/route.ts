import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(req) {
  let firebaseValid = false;
  let firebaseErr = '';
  try {
     const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
     if (jsonStr) {
        JSON.parse(jsonStr);
        firebaseValid = true;
     }
  } catch (e: any) {
     firebaseErr = e.message;
  }
  return NextResponse.json({
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasFirebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseJsonValid: firebaseValid,
    firebaseJsonErr: firebaseErr,
    timestamp: Date.now(),
  });
}
