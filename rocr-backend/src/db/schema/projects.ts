import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  numeric,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// Project status enum
export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "in_progress",
  "on_hold",
  "review",
  "completed",
  "archived",
]);

// Task priority enum
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

// Task status enum
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "review",
  "done",
  "blocked",
]);

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  clientName: text("client_name"),
  status: projectStatusEnum("status").default("planning").notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  budget: numeric("budget", { precision: 12, scale: 2 }),
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Milestones table
export const milestones = pgTable("milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  milestoneId: uuid("milestone_id").references(() => milestones.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("todo").notNull(),
  priority: taskPriorityEnum("priority").default("medium").notNull(),
  assigneeId: uuid("assignee_id").references(() => users.id, {
    onDelete: "set null",
  }),
  estimatedHours: numeric("estimated_hours", { precision: 6, scale: 2 }),
  actualHours: numeric("actual_hours", { precision: 6, scale: 2 }),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  milestones: many(milestones),
  tasks: many(tasks),
}));

export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  project: one(projects, {
    fields: [milestones.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  milestone: one(milestones, {
    fields: [tasks.milestoneId],
    references: [milestones.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
}));

// Types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
