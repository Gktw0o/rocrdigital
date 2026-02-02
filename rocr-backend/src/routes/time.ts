import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, and, gte, lte, between, sum, sql } from "drizzle-orm";
import { db } from "../db";
import { timeEntries, projects, tasks, users } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { managerOnly } from "../middleware/roles";

const timeRouter = new Hono();

// All routes require authentication
timeRouter.use("/*", authMiddleware);

// Clock in
timeRouter.post("/clock-in", async (c) => {
  const user = c.get("user");

  // Check if already clocked in
  const [activeEntry] = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.userId, user.id), sql`${timeEntries.endTime} IS NULL`))
    .limit(1);

  if (activeEntry) {
    return c.json(
      { error: "Already clocked in", code: "ALREADY_CLOCKED_IN", activeEntry },
      400
    );
  }

  const [entry] = await db
    .insert(timeEntries)
    .values({
      userId: user.id,
      startTime: new Date(),
      isBillable: true,
      isManual: false,
      hourlyRate: user.hourlyRate || null,
    })
    .returning();

  return c.json({ data: entry }, 201);
});

// Clock out
timeRouter.post("/clock-out", async (c) => {
  const user = c.get("user");

  // Find active entry
  const [activeEntry] = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.userId, user.id), sql`${timeEntries.endTime} IS NULL`))
    .limit(1);

  if (!activeEntry) {
    return c.json({ error: "Not clocked in", code: "NOT_CLOCKED_IN" }, 400);
  }

  const endTime = new Date();
  const startTime = new Date(activeEntry.startTime);
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  const [updated] = await db
    .update(timeEntries)
    .set({
      endTime,
      duration: durationMinutes.toString(),
      updatedAt: new Date(),
    })
    .where(eq(timeEntries.id, activeEntry.id))
    .returning();

  return c.json({ data: updated });
});

// Get current clock status
timeRouter.get("/status", async (c) => {
  const user = c.get("user");

  const [activeEntry] = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.userId, user.id), sql`${timeEntries.endTime} IS NULL`))
    .limit(1);

  if (!activeEntry) {
    return c.json({ data: { isClockedIn: false } });
  }

  const currentDuration = Math.round(
    (new Date().getTime() - new Date(activeEntry.startTime).getTime()) / 60000
  );

  return c.json({
    data: {
      isClockedIn: true,
      entry: activeEntry,
      currentDurationMinutes: currentDuration,
    },
  });
});

// Create manual time entry schema
const createEntrySchema = z.object({
  projectId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional(),
  description: z.string().max(500).optional(),
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time"),
  isBillable: z.boolean().default(true),
});

// Create manual time entry
timeRouter.post("/entries", zValidator("json", createEntrySchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");

  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (endTime <= startTime) {
    return c.json({ error: "End time must be after start time", code: "INVALID_TIME_RANGE" }, 400);
  }

  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  const [entry] = await db
    .insert(timeEntries)
    .values({
      userId: user.id,
      projectId: data.projectId || null,
      taskId: data.taskId || null,
      description: data.description || null,
      startTime,
      endTime,
      duration: durationMinutes.toString(),
      isBillable: data.isBillable,
      isManual: true,
      hourlyRate: user.hourlyRate || null,
    })
    .returning();

  return c.json({ data: entry }, 201);
});

// List entries schema
const listEntriesSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  projectId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

// List time entries
timeRouter.get("/entries", zValidator("query", listEntriesSchema), async (c) => {
  const user = c.get("user");
  const { startDate, endDate, projectId, userId } = c.req.valid("query");

  const conditions = [];

  // Non-admin/manager can only see their own entries
  if (user.role !== "admin" && user.role !== "manager") {
    conditions.push(eq(timeEntries.userId, user.id));
  } else if (userId) {
    conditions.push(eq(timeEntries.userId, userId));
  }

  if (startDate) {
    conditions.push(gte(timeEntries.startTime, new Date(startDate)));
  }

  if (endDate) {
    conditions.push(lte(timeEntries.startTime, new Date(endDate)));
  }

  if (projectId) {
    conditions.push(eq(timeEntries.projectId, projectId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const entries = await db.query.timeEntries.findMany({
    where: whereClause,
    with: {
      project: {
        columns: { id: true, name: true },
      },
      task: {
        columns: { id: true, title: true },
      },
    },
    orderBy: [sql`${timeEntries.startTime} DESC`],
  });

  return c.json({ data: entries });
});

// Update entry schema
const updateEntrySchema = z.object({
  projectId: z.string().uuid().nullable().optional(),
  taskId: z.string().uuid().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  isBillable: z.boolean().optional(),
});

// Update time entry
timeRouter.patch("/entries/:id", zValidator("json", updateEntrySchema), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  const data = c.req.valid("json");

  const [existing] = await db.select().from(timeEntries).where(eq(timeEntries.id, id)).limit(1);

  if (!existing) {
    return c.json({ error: "Entry not found", code: "NOT_FOUND" }, 404);
  }

  // Only owner or admin can update
  if (existing.userId !== user.id && user.role !== "admin") {
    return c.json({ error: "Access denied", code: "FORBIDDEN" }, 403);
  }

  const updateData: any = { ...data, updatedAt: new Date() };

  if (data.startTime) {
    updateData.startTime = new Date(data.startTime);
  }
  if (data.endTime) {
    updateData.endTime = new Date(data.endTime);
  }

  // Recalculate duration if times changed
  if (data.startTime || data.endTime) {
    const start = data.startTime ? new Date(data.startTime) : existing.startTime;
    const end = data.endTime ? new Date(data.endTime) : existing.endTime;
    if (end) {
      updateData.duration = Math.round((end.getTime() - start.getTime()) / 60000).toString();
    }
  }

  const [updated] = await db.update(timeEntries).set(updateData).where(eq(timeEntries.id, id)).returning();

  return c.json({ data: updated });
});

// Delete time entry
timeRouter.delete("/entries/:id", async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");

  const [existing] = await db.select().from(timeEntries).where(eq(timeEntries.id, id)).limit(1);

  if (!existing) {
    return c.json({ error: "Entry not found", code: "NOT_FOUND" }, 404);
  }

  // Only owner or admin can delete
  if (existing.userId !== user.id && user.role !== "admin") {
    return c.json({ error: "Access denied", code: "FORBIDDEN" }, 403);
  }

  await db.delete(timeEntries).where(eq(timeEntries.id, id));

  return c.json({ data: { message: "Entry deleted successfully" } });
});

// Get time reports
const reportsSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  userId: z.string().uuid().optional(),
  groupBy: z.enum(["day", "week", "project", "user"]).default("day"),
});

timeRouter.get("/reports", zValidator("query", reportsSchema), async (c) => {
  const user = c.get("user");
  const { startDate, endDate, userId, groupBy } = c.req.valid("query");

  const conditions = [
    gte(timeEntries.startTime, new Date(startDate)),
    lte(timeEntries.startTime, new Date(endDate)),
  ];

  // Non-admin/manager can only see their own reports
  if (user.role !== "admin" && user.role !== "manager") {
    conditions.push(eq(timeEntries.userId, user.id));
  } else if (userId) {
    conditions.push(eq(timeEntries.userId, userId));
  }

  const entries = await db.query.timeEntries.findMany({
    where: and(...conditions),
    with: {
      user: { columns: { id: true, name: true, hourlyRate: true } },
      project: { columns: { id: true, name: true } },
    },
  });

  // Calculate totals
  let totalMinutes = 0;
  let billableMinutes = 0;
  let totalEarnings = 0;

  for (const entry of entries) {
    const duration = parseFloat(entry.duration || "0");
    totalMinutes += duration;
    if (entry.isBillable) {
      billableMinutes += duration;
      const rate = parseFloat(entry.hourlyRate || entry.user?.hourlyRate || "0");
      totalEarnings += (duration / 60) * rate;
    }
  }

  return c.json({
    data: {
      entries,
      summary: {
        totalHours: Math.round((totalMinutes / 60) * 100) / 100,
        billableHours: Math.round((billableMinutes / 60) * 100) / 100,
        nonBillableHours: Math.round(((totalMinutes - billableMinutes) / 60) * 100) / 100,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        entryCount: entries.length,
      },
    },
  });
});

// Get today's summary
timeRouter.get("/today", async (c) => {
  const user = c.get("user");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const entries = await db.query.timeEntries.findMany({
    where: and(
      eq(timeEntries.userId, user.id),
      gte(timeEntries.startTime, today),
      lte(timeEntries.startTime, tomorrow)
    ),
    with: {
      project: { columns: { id: true, name: true } },
      task: { columns: { id: true, title: true } },
    },
  });

  let totalMinutes = 0;
  for (const entry of entries) {
    if (entry.duration) {
      totalMinutes += parseFloat(entry.duration);
    } else if (entry.endTime === null) {
      // Active entry
      totalMinutes += Math.round((new Date().getTime() - new Date(entry.startTime).getTime()) / 60000);
    }
  }

  return c.json({
    data: {
      entries,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      totalMinutes,
    },
  });
});

export default timeRouter;
