import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, ne } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../db/schema";
import { hashPassword } from "../utils/password";
import { authMiddleware } from "../middleware/auth";
import { adminOnly } from "../middleware/roles";
import type { UserRole } from "../db/schema/users";

const usersRouter = new Hono();

// All routes require authentication and admin role
usersRouter.use("/*", authMiddleware);
usersRouter.use("/*", adminOnly);

// Create user schema
const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100),
  role: z.enum(["admin", "manager", "employee", "freelancer"]).default("employee"),
  phone: z.string().optional(),
  hourlyRate: z.coerce.number().positive().optional(),
});

// Create user
usersRouter.post("/", zValidator("json", createUserSchema), async (c) => {
  const data = c.req.valid("json");

  // Check if email already exists
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email.toLowerCase()))
    .limit(1);

  if (existing) {
    return c.json(
      { error: "Email already exists", code: "DUPLICATE_EMAIL" },
      409
    );
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const [user] = await db
    .insert(users)
    .values({
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role as UserRole,
      phone: data.phone || null,
      hourlyRate: data.hourlyRate?.toString() || null,
    })
    .returning();

  // Remove password hash from response
  const { passwordHash: _, ...userWithoutPassword } = user;

  return c.json({ data: userWithoutPassword }, 201);
});

// List users
usersRouter.get("/", async (c) => {
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      phone: users.phone,
      hourlyRate: users.hourlyRate,
      avatarUrl: users.avatarUrl,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .orderBy(users.createdAt);

  return c.json({ data: allUsers });
});

// Get single user
usersRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      phone: users.phone,
      hourlyRate: users.hourlyRate,
      avatarUrl: users.avatarUrl,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) {
    return c.json({ error: "User not found", code: "NOT_FOUND" }, 404);
  }

  return c.json({ data: user });
});

// Update user schema
const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(["admin", "manager", "employee", "freelancer"]).optional(),
  phone: z.string().nullable().optional(),
  hourlyRate: z.coerce.number().positive().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
});

// Update user
usersRouter.patch(
  "/:id",
  zValidator("json", updateUserSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const currentUser = c.get("user");

    // Check if user exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existing) {
      return c.json({ error: "User not found", code: "NOT_FOUND" }, 404);
    }

    // Prevent admin from demoting themselves
    if (id === currentUser.id && data.role && data.role !== "admin") {
      return c.json(
        { error: "Cannot demote yourself", code: "SELF_DEMOTION" },
        400
      );
    }

    // Check email uniqueness if being updated
    if (data.email) {
      const [emailExists] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email.toLowerCase()))
        .limit(1);

      if (emailExists && emailExists.id !== id) {
        return c.json(
          { error: "Email already exists", code: "DUPLICATE_EMAIL" },
          409
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.email) {
      updateData.email = data.email.toLowerCase();
    }

    if (data.hourlyRate !== undefined) {
      updateData.hourlyRate = data.hourlyRate?.toString() || null;
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    const { passwordHash: _, ...userWithoutPassword } = updated;

    return c.json({ data: userWithoutPassword });
  }
);

// Reset user password (admin only)
const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

usersRouter.post(
  "/:id/reset-password",
  zValidator("json", resetPasswordSchema),
  async (c) => {
    const id = c.req.param("id");
    const { newPassword } = c.req.valid("json");

    // Check if user exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existing) {
      return c.json({ error: "User not found", code: "NOT_FOUND" }, 404);
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    // Invalidate all sessions for this user
    await db.delete(sessions).where(eq(sessions.userId, id));

    return c.json({
      data: { message: "Password reset successfully" },
    });
  }
);

// Delete user (soft delete - set inactive)
usersRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const currentUser = c.get("user");

  // Prevent self-deletion
  if (id === currentUser.id) {
    return c.json(
      { error: "Cannot delete yourself", code: "SELF_DELETION" },
      400
    );
  }

  // Check if user exists
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!existing) {
    return c.json({ error: "User not found", code: "NOT_FOUND" }, 404);
  }

  // Soft delete (set inactive)
  await db
    .update(users)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id));

  // Invalidate all sessions
  await db.delete(sessions).where(eq(sessions.userId, id));

  return c.json({
    data: { message: "User deactivated successfully" },
  });
});

export default usersRouter;
