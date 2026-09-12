import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase.from('users').select('firebase_uid').limit(1);
    return NextResponse.json({ success: true, data, error });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, stack: e.stack });
  }
}
