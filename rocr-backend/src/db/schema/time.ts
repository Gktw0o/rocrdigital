import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { tasks, projects } from "./projects";

// Time entries table (clock in/out, manual entries)
export const timeEntries = pgTable("time_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  taskId: uuid("task_id").references(() => tasks.id, {
    onDelete: "set null",
  }),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: numeric("duration", { precision: 8, scale: 2 }), // in minutes
  isBillable: boolean("is_billable").default(true).notNull(),
  isManual: boolean("is_manual").default(false).notNull(),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }), // snapshot of rate at time of entry
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [timeEntries.taskId],
    references: [tasks.id],
  }),
}));

// Types
export type TimeEntry = typeof timeEntries.$inferSelect;
export type NewTimeEntry = typeof timeEntries.$inferInsert;
