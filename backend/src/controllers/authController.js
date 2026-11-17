import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getDb } from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { clearCookieAttributes, cookieAttributes, getSessionToken, hashSessionToken, SESSION_COOKIE, SESSION_LIFETIME_MS } from '../middleware/authMiddleware.js';
import { normalizeEmail } from '../utils/validation.js';

function unavailable(response) {
  return response.status(503).json({ success: false, error: { code: 'DATABASE_UNAVAILABLE', message: 'Account services are unavailable until the database is configured and reachable.' } });
}

function issueCookie(response, request, token) {
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${cookieAttributes(request)}`);
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export const register = asyncHandler(async (request, response) => {
  const db = getDb();
  if (!db) return unavailable(response);
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
  const email = normalizeEmail(request.body?.email);
  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  if (name.length < 1 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Provide a name, a valid email address, and a password of at least 12 characters.' } });
  }
  if (password.length < 12 || password.length > 128) {
    return response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Password must be between 12 and 128 characters.' } });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
  try {
    const user = await db.$transaction(async (tx) => {
      const created = await tx.user.create({ data: { name, email, password: passwordHash } });
      await tx.session.create({ data: { userId: created.id, tokenHash, expiresAt } });
      return created;
    });
    issueCookie(response, request, token);
    return response.status(201).json({ success: true, data: { user: publicUser(user) } });
  } catch (error) {
    if (error?.code === 'P2002') {
      return response.status(409).json({ success: false, error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists.' } });
    }
    return unavailable(response);
  }
});

export const login = asyncHandler(async (request, response) => {
  const db = getDb();
  if (!db) return unavailable(response);
  const email = normalizeEmail(request.body?.email);
  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  if (!email || !password || password.length > 128) {
    return response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'A valid email and password are required.' } });
  }
  let user;
  try {
    user = await db.user.findUnique({ where: { email } });
  } catch {
    return unavailable(response);
  }
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return response.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' } });
  }
  const token = randomBytes(32).toString('base64url');
  try {
    await db.session.create({ data: {
      userId: user.id,
      tokenHash: hashSessionToken(token),
      expiresAt: new Date(Date.now() + SESSION_LIFETIME_MS),
    } });
    issueCookie(response, request, token);
    return response.json({ success: true, data: { user: publicUser(user) } });
  } catch {
    return unavailable(response);
  }
});

export const logout = asyncHandler(async (request, response) => {
  const token = getSessionToken(request);
  const db = getDb();
  if (token && db) {
    try { await db.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } }); } catch { /* Always clear the browser cookie. */ }
  }
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=; ${clearCookieAttributes(request)}`);
  return response.json({ success: true, data: { loggedOut: true } });
});

export const me = asyncHandler(async (request, response) => {
  const db = getDb();
  if (request.authUnavailable) return unavailable(response);
  if (getSessionToken(request) && !db) return unavailable(response);
  return response.json({ success: true, data: { authenticated: Boolean(request.user), user: request.user || null } });
});
