import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'bozor_session';

export interface SessionUser {
  pid: string; // id профиля в нашей базе
  tid: number; // telegram id
  name: string;
  username?: string | null;
  photo?: string | null;
}

interface SignedPayload extends SessionUser {
  exp: number;
}

// Простой подписанный токен (JWT HS256) — без внешних зависимостей.
export function signSession(
  user: SessionUser,
  secret: string,
  ttlSec = 60 * 60 * 24 * 30
): string {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  ).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + ttlSec })
  ).toString('base64url');
  const data = `${header}.${payload}`;
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifySession(token: string, secret: string): SignedPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const data = `${parts[0]}.${parts[1]}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');
  const a = Buffer.from(parts[2]);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString()
    ) as SignedPayload;
    if (!payload.exp || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

// Текущий пользователь из cookie (для серверных компонентов).
export async function getSessionUser(): Promise<SessionUser | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySession(token, secret);
  if (!payload) return null;
  const { exp, ...user } = payload;
  return user;
}
