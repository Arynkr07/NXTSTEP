import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) return NextResponse.json({ error: 'No JSON' });
    const sa = JSON.parse(serviceAccountJson);
    initializeApp({ credential: cert(sa) });
    return NextResponse.json({ apps: getApps().length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
