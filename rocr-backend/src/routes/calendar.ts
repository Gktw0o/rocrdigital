import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db } from "../db";
import { events, eventAttendees, users } from "../db/schema";
import { authMiddleware } from "../middleware/auth";

const calendarRouter = new Hono();

// All routes require authentication
calendarRouter.use("/*", authMiddleware);

// Create event schema
const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  eventType: z.enum(["meeting", "deadline", "reminder", "holiday", "other"]).default("meeting"),
  visibility: z.enum(["private", "team", "all"]).default("private"),
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time"),
  isAllDay: z.boolean().default(false),
  location: z.string().max(200).optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(),
  attendeeIds: z.array(z.string().uuid()).optional(),
});

// List events schema
const listEventsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  eventType: z.enum(["meeting", "deadline", "reminder", "holiday", "other"]).optional(),
});

// List events
calendarRouter.get("/events", zValidator("query", listEventsSchema), async (c) => {
  const user = c.get("user");
  const { startDate, endDate, eventType } = c.req.valid("query");

  // Build conditions
  const conditions = [];

  // User can see: their own events, team events, or public events
  // For simplicity, we'll fetch all and filter (in production, optimize with proper join)
  
  if (startDate) {
    conditions.push(gte(events.startTime, new Date(startDate)));
  }

  if (endDate) {
    conditions.push(lte(events.endTime, new Date(endDate)));
  }

  if (eventType) {
    conditions.push(eq(events.eventType, eventType));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const allEvents = await db.query.events.findMany({
    where: whereClause,
    with: {
      creator: {
        columns: { id: true, name: true, email: true, avatarUrl: true },
      },
      attendees: {
        with: {
          user: {
            columns: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
    },
    orderBy: [events.startTime],
  });

  // Filter by visibility
  const visibleEvents = allEvents.filter((event) => {
    if (event.visibility === "all") return true;
    if (event.creatorId === user.id) return true;
    if (event.visibility === "team" && (user.role === "admin" || user.role === "manager")) return true;
    // Check if user is an attendee
    const isAttendee = event.attendees.some((a) => a.userId === user.id);
    return isAttendee;
  });

  return c.json({ data: visibleEvents });
});

// Create event
calendarRouter.post("/events", zValidator("json", createEventSchema), async (c) => {
  const user = c.get("user");
  const { attendeeIds, ...data } = c.req.valid("json");

  // Validate times
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (endTime <= startTime) {
    return c.json({ error: "End time must be after start time", code: "INVALID_TIME_RANGE" }, 400);
  }

  // Create event
  const [event] = await db
    .insert(events)
    .values({
      ...data,
      creatorId: user.id,
      startTime,
      endTime,
    })
    .returning();

  // Add attendees if provided
  if (attendeeIds && attendeeIds.length > 0) {
    const attendeeValues = attendeeIds.map((userId) => ({
      eventId: event.id,
      userId,
      status: "pending",
    }));

    await db.insert(eventAttendees).values(attendeeValues);
  }

  // Fetch complete event with attendees
  const completeEvent = await db.query.events.findFirst({
    where: eq(events.id, event.id),
    with: {
      creator: {
        columns: { id: true, name: true, email: true },
      },
      attendees: {
        with: {
          user: {
            columns: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  return c.json({ data: completeEvent }, 201);
});

// Get single event
calendarRouter.get("/events/:id", async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: {
      creator: {
        columns: { id: true, name: true, email: true, avatarUrl: true },
      },
      attendees: {
        with: {
          user: {
            columns: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
    },
  });

  if (!event) {
    return c.json({ error: "Event not found", code: "NOT_FOUND" }, 404);
  }

  // Check visibility
  const isCreator = event.creatorId === user.id;
  const isAttendee = event.attendees.some((a) => a.userId === user.id);
  const canView = event.visibility === "all" || isCreator || isAttendee ||
    (event.visibility === "team" && (user.role === "admin" || user.role === "manager"));

  if (!canView) {
    return c.json({ error: "Access denied", code: "FORBIDDEN" }, 403);
  }

  return c.json({ data: event });
});

// Update event schema
const updateEventSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  eventType: z.enum(["meeting", "deadline", "reminder", "holiday", "other"]).optional(),
  visibility: z.enum(["private", "team", "all"]).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  isAllDay: z.boolean().optional(),
  location: z.string().max(200).nullable().optional(),
});

// Update event
calendarRouter.patch("/events/:id", zValidator("json", updateEventSchema), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  const data = c.req.valid("json");

  const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: "Event not found", code: "NOT_FOUND" }, 404);
  }

  // Only creator or admin can update
  if (existing.creatorId !== user.id && user.role !== "admin") {
    return c.json({ error: "Access denied", code: "FORBIDDEN" }, 403);
  }

  const updateData: any = { ...data, updatedAt: new Date() };

  if (data.startTime) {
    updateData.startTime = new Date(data.startTime);
  }
  if (data.endTime) {
    updateData.endTime = new Date(data.endTime);
  }

  const [updated] = await db.update(events).set(updateData).where(eq(events.id, id)).returning();

  return c.json({ data: updated });
});

// Delete event
calendarRouter.delete("/events/:id", async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");

  const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: "Event not found", code: "NOT_FOUND" }, 404);
  }

  // Only creator or admin can delete
  if (existing.creatorId !== user.id && user.role !== "admin") {
    return c.json({ error: "Access denied", code: "FORBIDDEN" }, 403);
  }

  await db.delete(events).where(eq(events.id, id));

  return c.json({ data: { message: "Event deleted successfully" } });
});

// Respond to event invitation
const respondSchema = z.object({
  status: z.enum(["accepted", "declined"]),
});

calendarRouter.post("/events/:id/respond", zValidator("json", respondSchema), async (c) => {
  const eventId = c.req.param("id");
  const user = c.get("user");
  const { status } = c.req.valid("json");

  const [attendee] = await db
    .select()
    .from(eventAttendees)
    .where(and(eq(eventAttendees.eventId, eventId), eq(eventAttendees.userId, user.id)))
    .limit(1);

  if (!attendee) {
    return c.json({ error: "You are not invited to this event", code: "NOT_INVITED" }, 404);
  }

  await db
    .update(eventAttendees)
    .set({ status })
    .where(eq(eventAttendees.id, attendee.id));

  return c.json({ data: { message: `Event ${status}` } });
});

// Get my events (created or attending)
calendarRouter.get("/my", async (c) => {
  const user = c.get("user");

  // Events I created
  const createdEvents = await db.query.events.findMany({
    where: eq(events.creatorId, user.id),
    orderBy: [events.startTime],
  });

  // Events I'm attending
  const attending = await db.query.eventAttendees.findMany({
    where: eq(eventAttendees.userId, user.id),
    with: {
      event: true,
    },
  });

  const attendingEvents = attending.map((a) => a.event);

  // Combine and deduplicate
  const allMyEvents = [...createdEvents];
  for (const event of attendingEvents) {
    if (!allMyEvents.find((e) => e.id === event.id)) {
      allMyEvents.push(event);
    }
  }

  // Sort by start time
  allMyEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return c.json({ data: allMyEvents });
});

export default calendarRouter;
