import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../db/schema";
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  getRefreshTokenExpiry,
} from "../utils/jwt";
import { hashPassword, comparePassword } from "../utils/password";
import { authMiddleware } from "../middleware/auth";

const authRouter = new Hono();

// Login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Login endpoint
authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  // Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    return c.json(
      { error: "Invalid email or password", code: "INVALID_CREDENTIALS" },
      401
    );
  }

  // Check if user is active
  if (!user.isActive) {
    return c.json(
      { error: "Account is inactive", code: "ACCOUNT_INACTIVE" },
      401
    );
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    return c.json(
      { error: "Invalid email or password", code: "INVALID_CREDENTIALS" },
      401
    );
  }

  // Generate tokens
  const tokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = await signAccessToken(tokenPayload);
  const refreshToken = await signRefreshToken(tokenPayload);

  // Store refresh token in database
  await db.insert(sessions).values({
    userId: user.id,
    refreshToken,
    userAgent: c.req.header("User-Agent") || null,
    ipAddress: c.req.header("X-Forwarded-For") || c.req.header("X-Real-IP") || null,
    expiresAt: getRefreshTokenExpiry(),
  });

  // Return tokens and user info (without password)
  const { passwordHash: _, ...userWithoutPassword } = user;

  return c.json({
    data: {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    },
  });
});

// Refresh token schema
const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Refresh access token
authRouter.post("/refresh", zValidator("json", refreshSchema), async (c) => {
  const { refreshToken } = c.req.valid("json");

  try {
    // Verify refresh token
    const payload = await verifyToken(refreshToken);

    if (payload.type !== "refresh") {
      return c.json(
        { error: "Invalid token type", code: "INVALID_TOKEN_TYPE" },
        401
      );
    }

    // Check if session exists
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.refreshToken, refreshToken))
      .limit(1);

    if (!session) {
      return c.json(
        { error: "Session not found", code: "SESSION_NOT_FOUND" },
        401
      );
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      // Delete expired session
      await db.delete(sessions).where(eq(sessions.id, session.id));
      return c.json(
        { error: "Session expired", code: "SESSION_EXPIRED" },
        401
      );
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user || !user.isActive) {
      return c.json(
        { error: "User not found or inactive", code: "USER_INVALID" },
        401
      );
    }

    // Generate new access token
    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return c.json({
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return c.json(
      { error: "Invalid refresh token", code: "INVALID_TOKEN" },
      401
    );
  }
});

// Logout endpoint
authRouter.post("/logout", authMiddleware, async (c) => {
  const user = c.get("user");

  // Get refresh token from body (optional)
  const body = await c.req.json().catch(() => ({}));
  const refreshToken = body.refreshToken;

  if (refreshToken) {
    // Delete specific session
    await db
      .delete(sessions)
      .where(eq(sessions.refreshToken, refreshToken));
  } else {
    // Delete all sessions for user (logout from all devices)
    await db.delete(sessions).where(eq(sessions.userId, user.id));
  }

  return c.json({
    data: { message: "Logged out successfully" },
  });
});

// Get current user
authRouter.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const { passwordHash: _, ...userWithoutPassword } = user;

  return c.json({
    data: userWithoutPassword,
  });
});

// Update password schema
const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// Update password
authRouter.post(
  "/update-password",
  authMiddleware,
  zValidator("json", updatePasswordSchema),
  async (c) => {
    const user = c.get("user");
    const { currentPassword, newPassword } = c.req.valid("json");

    // Verify current password
    const isValidPassword = await comparePassword(
      currentPassword,
      user.passwordHash
    );

    if (!isValidPassword) {
      return c.json(
        { error: "Current password is incorrect", code: "INVALID_PASSWORD" },
        400
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Invalidate all sessions (force re-login)
    await db.delete(sessions).where(eq(sessions.userId, user.id));

    return c.json({
      data: { message: "Password updated successfully. Please login again." },
    });
  }
);

export default authRouter;
