import { createHash } from 'node:crypto';
import { getDb } from '../config/db.js';

export const SESSION_COOKIE = 'chromalens_session';
export const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

function cookieValue(request, name) {
  const header = request.headers.cookie || '';
  for (const item of header.split(';')) {
    const separator = item.indexOf('=');
    if (separator < 0) continue;
    if (item.slice(0, separator).trim() === name) {
      try { return decodeURIComponent(item.slice(separator + 1).trim()); } catch { return null; }
    }
  }
  return null;
}

export function getSessionToken(request) {
  return cookieValue(request, SESSION_COOKIE);
}

export function hashSessionToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function cookieAttributes(request) {
  // trust proxy is configured to one application gateway hop in server.js.
  const forwardedProto = String(request.get('x-forwarded-proto') || '')
    .split(',').at(-1).trim().toLowerCase();
  const publicHttps = forwardedProto === 'https';
  return `Path=/; HttpOnly; Max-Age=${SESSION_LIFETIME_MS / 1000}; SameSite=${publicHttps ? 'None' : 'Lax'}${publicHttps ? '; Secure' : ''}`;
}

export function clearCookieAttributes(request) {
  const attributes = cookieAttributes(request).replace(/Max-Age=\d+/, 'Max-Age=0');
  return attributes;
}

async function loadSession(request) {
  const token = getSessionToken(request);
  if (!token || token.length > 200) return null;
  const db = getDb();
  if (!db) throw new Error('Session storage unavailable.');
  const session = await db.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    select: {
      expiresAt: true,
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function optionalAuth(request, _response, next) {
  try {
    request.user = await loadSession(request);
    request.authUnavailable = false;
    return next();
  } catch {
    request.user = null;
    request.authUnavailable = Boolean(getSessionToken(request));
    return next();
  }
}

export async function requireAuth(request, response, next) {
  try {
    request.user = await loadSession(request);
    if (!request.user) {
      return response.status(401).json({ success: false, error: { code: 'AUTH_REQUIRED', message: 'Sign in to access this resource.' } });
    }
    return next();
  } catch {
    return response.status(503).json({ success: false, error: { code: 'AUTH_UNAVAILABLE', message: 'Authentication is temporarily unavailable.' } });
  }
}
