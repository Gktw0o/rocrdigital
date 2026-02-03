import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, and, or, ilike } from "drizzle-orm";
import { db } from "../db";
import { contacts, users } from "../db/schema";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth";
import { managerOnly } from "../middleware/roles";
import { sanitizeString, sanitizeEmail, escapeLikePattern } from "../utils/sanitize";

const contactsRouter = new Hono();

// Create contact schema (public endpoint)
const createContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  source: z.string().optional().default("landing-contact-form"),
});

// Public endpoint - receive contact form submissions
contactsRouter.post("/", zValidator("json", createContactSchema), async (c) => {
  const data = c.req.valid("json");

  // Sanitize all input data
  const sanitizedData = {
    name: sanitizeString(data.name),
    email: sanitizeEmail(data.email),
    subject: sanitizeString(data.subject),
    message: sanitizeString(data.message),
    source: sanitizeString(data.source || "landing-contact-form"),
    status: "unread" as const,
  };

  const [contact] = await db
    .insert(contacts)
    .values(sanitizedData)
    .returning();

  return c.json(
    {
      data: {
        id: contact.id,
        message: "Contact form submitted successfully",
      },
    },
    201
  );
});

// All routes below require authentication
contactsRouter.use("/*", authMiddleware);

// List contacts schema
const listContactsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["unread", "read", "in_progress", "replied", "archived"]).optional(),
  search: z.string().optional(),
  assignedToId: z.string().uuid().optional(),
});

// List contacts
contactsRouter.get("/", zValidator("query", listContactsSchema), async (c) => {
  const { page, perPage, status, search, assignedToId } = c.req.valid("query");
  const offset = (page - 1) * perPage;

  // Build where conditions
  const conditions = [];

  if (status) {
    conditions.push(eq(contacts.status, status));
  }

  if (assignedToId) {
    conditions.push(eq(contacts.assignedToId, assignedToId));
  }

  if (search) {
    // Escape special characters to prevent SQL injection in LIKE patterns
    const safeSearch = escapeLikePattern(search);
    conditions.push(
      or(
        ilike(contacts.name, `%${safeSearch}%`),
        ilike(contacts.email, `%${safeSearch}%`),
        ilike(contacts.subject, `%${safeSearch}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get contacts with pagination
  const results = await db.query.contacts.findMany({
    where: whereClause,
    with: {
      assignedTo: {
        columns: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: [desc(contacts.createdAt)],
    limit: perPage,
    offset,
  });

  // Get total count
  const allContacts = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(whereClause);

  const total = allContacts.length;

  return c.json({
    data: results,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
});

// Get single contact
contactsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const contact = await db.query.contacts.findFirst({
    where: eq(contacts.id, id),
    with: {
      assignedTo: {
        columns: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!contact) {
    return c.json({ error: "Contact not found", code: "NOT_FOUND" }, 404);
  }

  return c.json({ data: contact });
});

// Update contact schema
const updateContactSchema = z.object({
  status: z.enum(["unread", "read", "in_progress", "replied", "archived"]).optional(),
  assignedToId: z.string().uuid().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

// Update contact
contactsRouter.patch(
  "/:id",
  zValidator("json", updateContactSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    // Check if contact exists
    const [existing] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);

    if (!existing) {
      return c.json({ error: "Contact not found", code: "NOT_FOUND" }, 404);
    }

    // Prepare update data
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // Set repliedAt if status changed to replied
    if (data.status === "replied" && existing.status !== "replied") {
      updateData.repliedAt = new Date();
    }

    const [updated] = await db
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.id, id))
      .returning();

    return c.json({ data: updated });
  }
);

// Delete contact (archive)
contactsRouter.delete("/:id", managerOnly, async (c) => {
  const id = c.req.param("id");

  const [deleted] = await db
    .delete(contacts)
    .where(eq(contacts.id, id))
    .returning();

  if (!deleted) {
    return c.json({ error: "Contact not found", code: "NOT_FOUND" }, 404);
  }

  return c.json({ data: { message: "Contact deleted successfully" } });
});

// Get contact stats
contactsRouter.get("/stats/summary", async (c) => {
  const allContacts = await db.select().from(contacts);

  const stats = {
    total: allContacts.length,
    unread: allContacts.filter((c) => c.status === "unread").length,
    read: allContacts.filter((c) => c.status === "read").length,
    inProgress: allContacts.filter((c) => c.status === "in_progress").length,
    replied: allContacts.filter((c) => c.status === "replied").length,
    archived: allContacts.filter((c) => c.status === "archived").length,
  };

  return c.json({ data: stats });
});

export default contactsRouter;
