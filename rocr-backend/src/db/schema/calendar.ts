import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  time,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// Event type enum
export const eventTypeEnum = pgEnum("event_type", [
  "meeting",
  "deadline",
  "reminder",
  "holiday",
  "other",
]);

// Event visibility enum
export const eventVisibilityEnum = pgEnum("event_visibility", [
  "private",
  "team",
  "all",
]);

// Events table (calendar events)
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  eventType: eventTypeEnum("event_type").default("meeting").notNull(),
  visibility: eventVisibilityEnum("visibility").default("private").notNull(),
  creatorId: uuid("creator_id")
    .references(() => users.id)
    .notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isAllDay: boolean("is_all_day").default(false).notNull(),
  location: text("location"),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurrenceRule: text("recurrence_rule"), // iCal RRULE format
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Event attendees (many-to-many)
export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").default("pending"), // pending, accepted, declined
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User schedules (weekly work patterns)
export const schedules = pgTable("schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  dayOfWeek: text("day_of_week").notNull(), // monday, tuesday, etc.
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Off days (PTO, sick days, holidays)
export const offDays = pgTable("off_days", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").notNull(),
  reason: text("reason"),
  type: text("type").default("pto"), // pto, sick, holiday, other
  isApproved: boolean("is_approved").default(false).notNull(),
  approvedById: uuid("approved_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.creatorId],
    references: [users.id],
  }),
  attendees: many(eventAttendees),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendees.userId],
    references: [users.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  user: one(users, {
    fields: [schedules.userId],
    references: [users.id],
  }),
}));

export const offDaysRelations = relations(offDays, ({ one }) => ({
  user: one(users, {
    fields: [offDays.userId],
    references: [users.id],
  }),
  approvedBy: one(users, {
    fields: [offDays.approvedById],
    references: [users.id],
  }),
}));

// Types
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventAttendee = typeof eventAttendees.$inferSelect;
export type NewEventAttendee = typeof eventAttendees.$inferInsert;
export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;
export type OffDay = typeof offDays.$inferSelect;
export type NewOffDay = typeof offDays.$inferInsert;
export type EventType = (typeof eventTypeEnum.enumValues)[number];
export type EventVisibility = (typeof eventVisibilityEnum.enumValues)[number];
