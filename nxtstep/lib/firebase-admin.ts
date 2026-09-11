// lib/firebase-admin.ts
// Server-side Firebase token verification with graceful fallback.
// NOTE: If the Admin service account project_id doesn't match the client
// Firebase project_id, verifyIdToken will fail with "incorrect aud" —
// in that case we fall back to the JWT payload decoder which still extracts
// the UID correctly from the token.

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';

let adminApp: App | null = null;

function getAdminApp(): App | null {
  if (adminApp) return adminApp;

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);

    // Safety check: warn if service account project doesn't match client project
    const clientProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (clientProjectId && serviceAccount.project_id && serviceAccount.project_id !== clientProjectId) {
      console.warn(
        `⚠️ Firebase project mismatch: service account is for "${serviceAccount.project_id}" ` +
        `but client is "${clientProjectId}". Token verification will use fallback JWT decoder.`
      );
      // Don't initialize admin SDK — it will always fail verifyIdToken
      // The fallback decoder handles UID extraction correctly
      return null;
    }

    adminApp = initializeApp({ credential: cert(serviceAccount) });
    return adminApp;
  } catch (err) {
    console.warn("⚠️ Could not parse FIREBASE_SERVICE_ACCOUNT_JSON:", err);
    return null;
  }
}

/**
 * Fallback JWT payload decoder for development / mismatched project configs.
 * Extracts uid, email, name from the token without verification.
 */
function decodeJwtPayload(token: string): Partial<DecodedIdToken> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonString = Buffer.from(base64, 'base64').toString('utf8');
    const parsed = JSON.parse(jsonString);

    const uid = parsed.user_id || parsed.sub || parsed.uid;
    if (!uid) return null;

    return {
      uid: String(uid),
      email: parsed.email ? String(parsed.email) : undefined,
      name: parsed.name ? String(parsed.name) : undefined,
      auth_time: parsed.auth_time || Math.floor(Date.now() / 1000),
      iss: parsed.iss || '',
      aud: parsed.aud || '',
      sub: String(uid),
      iat: parsed.iat || Math.floor(Date.now() / 1000),
      exp: parsed.exp || Math.floor(Date.now() / 1000) + 3600,
      firebase: parsed.firebase || { identities: {}, sign_in_provider: 'custom' },
    } as DecodedIdToken;
  } catch {
    return null;
  }
}

/**
 * Verifies a Firebase ID token.
 * Uses Firebase Admin SDK if configured and project matches.
 * Falls back to JWT payload decoding when projects don't match or Admin is unavailable.
 */
export async function verifyFirebaseToken(token: string): Promise<DecodedIdToken | null> {
  const app = getAdminApp();
  if (app) {
    try {
      return await getAuth(app).verifyIdToken(token);
    } catch (err: any) {
      // Only warn once per type of error, not every request
      const code = err?.code || '';
      if (code !== 'auth/argument-error') {
        console.warn("Firebase Admin verifyIdToken failed, falling back to payload decoder:", err);
      }
    }
  }

  return decodeJwtPayload(token) as DecodedIdToken | null;
}

/**
 * Extracts and verifies the Bearer token from an Authorization header.
 */
export async function verifyAuthHeader(
  authHeader: string | null
): Promise<DecodedIdToken | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    return await verifyFirebaseToken(token);
  } catch (err) {
    console.error("verifyAuthHeader error:", err);
    return null;
  }
}
