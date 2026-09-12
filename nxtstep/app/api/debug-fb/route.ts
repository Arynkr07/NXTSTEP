import { NextResponse } from 'next/server';
import { getApps } from 'firebase-admin/app';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ apps: getApps().length });
}
