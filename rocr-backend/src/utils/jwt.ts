import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-in-production"
);

const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

// Parse duration string to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // default 15 minutes

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    default:
      return 900;
  }
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  type: "access" | "refresh";
}

// Sign access token
export async function signAccessToken(payload: Omit<JWTPayload, "type">): Promise<string> {
  const expiresIn = parseDuration(ACCESS_TOKEN_EXPIRES);
  
  return new jose.SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(JWT_SECRET);
}

// Sign refresh token
export async function signRefreshToken(payload: Omit<JWTPayload, "type">): Promise<string> {
  const expiresIn = parseDuration(REFRESH_TOKEN_EXPIRES);
  
  return new jose.SignJWT({ ...payload, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(JWT_SECRET);
}

// Verify token
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

// Get refresh token expiry date
export function getRefreshTokenExpiry(): Date {
  const expiresIn = parseDuration(REFRESH_TOKEN_EXPIRES);
  return new Date(Date.now() + expiresIn * 1000);
}
