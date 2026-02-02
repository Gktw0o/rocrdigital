import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// User roles enum
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "manager",
  "employee",
  "freelancer",
]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").default("employee").notNull(),
  avatarUrl: text("avatar_url"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  phone: text("phone"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions table (for refresh tokens)
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  refreshToken: text("refresh_token").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
