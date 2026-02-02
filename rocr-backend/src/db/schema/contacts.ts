import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// Contact status enum
export const contactStatusEnum = pgEnum("contact_status", [
  "unread",
  "read",
  "in_progress",
  "replied",
  "archived",
]);

// Contacts table (leads from landing page)
export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  source: text("source").default("landing-contact-form"),
  status: contactStatusEnum("status").default("unread").notNull(),
  assignedToId: uuid("assigned_to_id").references(() => users.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  repliedAt: timestamp("replied_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const contactsRelations = relations(contacts, ({ one }) => ({
  assignedTo: one(users, {
    fields: [contacts.assignedToId],
    references: [users.id],
  }),
}));

// Types
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type ContactStatus = (typeof contactStatusEnum.enumValues)[number];
