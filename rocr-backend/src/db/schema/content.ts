import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// Partners table (portfolio)
export const partners = pgTable("partners", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  logoUrlDark: text("logo_url_dark"),
  websiteUrl: text("website_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: text("sort_order").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Services table (service catalog)
export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  features: jsonb("features").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: text("sort_order").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content table (website content - key-value store)
export const content = pgTable("content", {
  id: uuid("id").defaultRandom().primaryKey(),
  section: text("section").notNull().unique(), // hero, about, stats, values
  data: jsonb("data").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team profiles (public-facing team info)
export const teamProfiles = pgTable("team_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  group: text("group").notNull(), // Founders & Leadership, Design Studio, Engineering Lab
  description: text("description"),
  avatarUrl: text("avatar_url"),
  linkedinUrl: text("linkedin_url"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: text("sort_order").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
export type TeamProfile = typeof teamProfiles.$inferSelect;
export type NewTeamProfile = typeof teamProfiles.$inferInsert;
