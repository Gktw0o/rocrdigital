import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { schedules, offDays, users } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { managerOnly } from "../middleware/roles";

const scheduleRouter = new Hono();

// All routes require authentication
scheduleRouter.use("/*", authMiddleware);

// Get my schedule
scheduleRouter.get("/", async (c) => {
  const user = c.get("user");

  const mySchedule = await db.query.schedules.findMany({
    where: eq(schedules.userId, user.id),
    orderBy: [schedules.dayOfWeek],
  });

  return c.json({ data: mySchedule });
});

// Set schedule schema
const setScheduleSchema = z.object({
  schedules: z.array(
    z.object({
      dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
      startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
      endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
      isActive: z.boolean().default(true),
    })
  ),
});

// Set my schedule (replace all)
scheduleRouter.put("/", zValidator("json", setScheduleSchema), async (c) => {
  const user = c.get("user");
  const { schedules: newSchedules } = c.req.valid("json");

  // Delete existing schedules
  await db.delete(schedules).where(eq(schedules.userId, user.id));

  // Insert new schedules
  if (newSchedules.length > 0) {
    const values = newSchedules.map((s) => ({
      userId: user.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      isActive: s.isActive,
    }));

    await db.insert(schedules).values(values);
  }

  // Fetch and return updated schedules
  const updated = await db.query.schedules.findMany({
    where: eq(schedules.userId, user.id),
    orderBy: [schedules.dayOfWeek],
  });

  return c.json({ data: updated });
});

// Get user schedule (for managers)
scheduleRouter.get("/user/:userId", managerOnly, async (c) => {
  const userId = c.req.param("userId");

  const userSchedule = await db.query.schedules.findMany({
    where: eq(schedules.userId, userId),
    orderBy: [schedules.dayOfWeek],
  });

  return c.json({ data: userSchedule });
});

// Get team availability for a date
const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

scheduleRouter.get("/availability", managerOnly, zValidator("query", availabilitySchema), async (c) => {
  const { date } = c.req.valid("query");

  // Get day of week from date
  const dateObj = new Date(date);
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayOfWeek = days[dateObj.getDay()];

  // Get all users
  const allUsers = await db
    .select({ id: users.id, name: users.name, role: users.role })
    .from(users)
    .where(eq(users.isActive, true));

  // Get schedules for this day
  const daySchedules = await db.query.schedules.findMany({
    where: and(eq(schedules.dayOfWeek, dayOfWeek), eq(schedules.isActive, true)),
  });

  // Get off days for this date
  const offs = await db.query.offDays.findMany({
    where: and(eq(offDays.date, date), eq(offDays.isApproved, true)),
  });

  const offUserIds = new Set(offs.map((o) => o.userId));

  // Build availability list
  const availability = allUsers.map((user) => {
    const isOff = offUserIds.has(user.id);
    const schedule = daySchedules.find((s) => s.userId === user.id);

    return {
      user,
      isOff,
      offReason: isOff ? offs.find((o) => o.userId === user.id)?.reason : null,
      isWorking: !isOff && !!schedule,
      schedule: schedule
        ? { startTime: schedule.startTime, endTime: schedule.endTime }
        : null,
    };
  });

  return c.json({ data: availability });
});

// Get my off days
scheduleRouter.get("/off-days", async (c) => {
  const user = c.get("user");

  const myOffDays = await db.query.offDays.findMany({
    where: eq(offDays.userId, user.id),
    with: {
      approvedBy: {
        columns: { id: true, name: true },
      },
    },
    orderBy: [offDays.date],
  });

  return c.json({ data: myOffDays });
});

// Request off day schema
const requestOffDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  reason: z.string().max(500).optional(),
  type: z.enum(["pto", "sick", "holiday", "other"]).default("pto"),
});

// Request off day
scheduleRouter.post("/off-days", zValidator("json", requestOffDaySchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");

  // Check if already requested
  const [existing] = await db
    .select()
    .from(offDays)
    .where(and(eq(offDays.userId, user.id), eq(offDays.date, data.date)))
    .limit(1);

  if (existing) {
    return c.json({ error: "Off day already requested for this date", code: "DUPLICATE" }, 409);
  }

  const [offDay] = await db
    .insert(offDays)
    .values({
      userId: user.id,
      date: data.date,
      reason: data.reason || null,
      type: data.type,
      isApproved: false,
    })
    .returning();

  return c.json({ data: offDay }, 201);
});

// Approve/reject off day (manager only)
const approveOffDaySchema = z.object({
  isApproved: z.boolean(),
});

scheduleRouter.patch("/off-days/:id", managerOnly, zValidator("json", approveOffDaySchema), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  const { isApproved } = c.req.valid("json");

  const [existing] = await db.select().from(offDays).where(eq(offDays.id, id)).limit(1);

  if (!existing) {
    return c.json({ error: "Off day request not found", code: "NOT_FOUND" }, 404);
  }

  const [updated] = await db
    .update(offDays)
    .set({
      isApproved,
      approvedById: user.id,
      updatedAt: new Date(),
    })
    .where(eq(offDays.id, id))
    .returning();

  return c.json({ data: updated });
});

// Delete off day request
scheduleRouter.delete("/off-days/:id", async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");

  const [existing] = await db.select().from(offDays).where(eq(offDays.id, id)).limit(1);

  if (!existing) {
    return c.json({ error: "Off day request not found", code: "NOT_FOUND" }, 404);
  }

  // Only owner or admin can delete
  if (existing.userId !== user.id && user.role !== "admin") {
    return c.json({ error: "Access denied", code: "FORBIDDEN" }, 403);
  }

  await db.delete(offDays).where(eq(offDays.id, id));

  return c.json({ data: { message: "Off day request deleted" } });
});

// Get pending off day requests (manager only)
scheduleRouter.get("/off-days/pending", managerOnly, async (c) => {
  const pending = await db.query.offDays.findMany({
    where: eq(offDays.isApproved, false),
    with: {
      user: {
        columns: { id: true, name: true, email: true },
      },
    },
    orderBy: [offDays.date],
  });

  return c.json({ data: pending });
});

export default scheduleRouter;
