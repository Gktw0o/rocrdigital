import type { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import type { User } from "../db/schema/users";

// Extend Hono context to include user
declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}

// Auth middleware - verifies JWT and attaches user to context
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json(
      { error: "Unauthorized", code: "MISSING_TOKEN" },
      401
    );
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token);

    // Check if it's an access token
    if (payload.type !== "access") {
      return c.json(
        { error: "Invalid token type", code: "INVALID_TOKEN_TYPE" },
        401
      );
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user) {
      return c.json(
        { error: "User not found", code: "USER_NOT_FOUND" },
        401
      );
    }

    if (!user.isActive) {
      return c.json(
        { error: "User account is inactive", code: "USER_INACTIVE" },
        401
      );
    }

    // Attach user to context
    c.set("user", user);

    await next();
  } catch (error) {
    return c.json(
      { error: "Invalid or expired token", code: "INVALID_TOKEN" },
      401
    );
  }
}

// Optional auth middleware - attaches user if token is valid, but doesn't require it
export async function optionalAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    try {
      const payload = await verifyToken(token);

      if (payload.type === "access") {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, payload.sub))
          .limit(1);

        if (user && user.isActive) {
          c.set("user", user);
        }
      }
    } catch {
      // Ignore errors - user just won't be attached
    }
  }

  await next();
}
