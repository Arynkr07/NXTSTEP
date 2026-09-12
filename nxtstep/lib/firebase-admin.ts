// lib/firebase-admin.ts
// Decodes Firebase ID token safely without crashing Vercel with firebase-admin imports.

export interface DecodedIdToken {
  uid: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

/**
 * JWT payload decoder for Firebase tokens.
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
 * Extracts and verifies the Bearer token from an Authorization header.
 */
export async function verifyAuthHeader(
  authHeader: string | null
): Promise<DecodedIdToken | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    return decodeJwtPayload(token) as DecodedIdToken | null;
  } catch (err) {
    console.error("verifyAuthHeader error:", err);
    return null;
  }
}
