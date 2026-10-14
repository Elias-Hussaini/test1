import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { env } from "../config/env.js";

/**
 * ساختار Payload توکن‌ها.
 * - `jti`: شناسه‌ی یکتای هر توکن — جلوی برخورد (collision) را می‌گیرد.
 */
export type JwtPayload = {
  sub: string;
  role: string;
  type: "access" | "refresh";
  jti: string;
  iat?: number;
  exp?: number;
};

/**
 * ساخت Access Token.
 */
export function signAccessToken(payload: Pick<JwtPayload, "sub" | "role">): string {
  return jwt.sign(
    { ...payload, type: "access", jti: nanoid() } satisfies JwtPayload,
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_TTL },
  );
}

/**
 * ساخت Refresh Token.
 */
export function signRefreshToken(payload: Pick<JwtPayload, "sub" | "role">): string {
  return jwt.sign(
    { ...payload, type: "refresh", jti: nanoid() } satisfies JwtPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_TTL },
  );
}

/**
 * بررسی Access Token.
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

/**
 * بررسی Refresh Token.
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}
