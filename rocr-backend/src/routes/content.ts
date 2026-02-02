import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { partners, services, content, teamProfiles } from "../db/schema";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth";
import { managerOnly } from "../middleware/roles";

const contentRouter = new Hono();

// ============= PARTNERS =============

// Get partners (public)
contentRouter.get("/partners", optionalAuthMiddleware, async (c) => {
  const allPartners = await db.query.partners.findMany({
    where: eq(partners.isActive, true),
    orderBy: [partners.sortOrder],
  });

  return c.json({ data: allPartners });
});

// Create partner (manager only)
const createPartnerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional(),
  logoUrlDark: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  sortOrder: z.string().optional(),
});

contentRouter.post("/partners", authMiddleware, managerOnly, zValidator("json", createPartnerSchema), async (c) => {
  const data = c.req.valid("json");

  const [partner] = await db.insert(partners).values(data).returning();

  return c.json({ data: partner }, 201);
});

// Update partner
const updatePartnerSchema = createPartnerSchema.partial().extend({
  isActive: z.boolean().optional(),
});

contentRouter.patch("/partners/:id", authMiddleware, managerOnly, zValidator("json", updatePartnerSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const [existing] = await db.select().from(partners).where(eq(partners.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: "Partner not found", code: "NOT_FOUND" }, 404);
  }

  const [updated] = await db
    .update(partners)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(partners.id, id))
    .returning();

  return c.json({ data: updated });
});

// Delete partner
contentRouter.delete("/partners/:id", authMiddleware, managerOnly, async (c) => {
  const id = c.req.param("id");

  const [deleted] = await db.delete(partners).where(eq(partners.id, id)).returning();

  if (!deleted) {
    return c.json({ error: "Partner not found", code: "NOT_FOUND" }, 404);
  }

  return c.json({ data: { message: "Partner deleted" } });
});

// ============= SERVICES =============

// Get services (public)
contentRouter.get("/services", optionalAuthMiddleware, async (c) => {
  const allServices = await db.query.services.findMany({
    where: eq(services.isActive, true),
    orderBy: [services.sortOrder],
  });

  return c.json({ data: allServices });
});

// Create service
const createServiceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(2000).optional(),
  features: z.array(z.string()).default([]),
  sortOrder: z.string().optional(),
});

contentRouter.post("/services", authMiddleware, managerOnly, zValidator("json", createServiceSchema), async (c) => {
  const data = c.req.valid("json");

  const [service] = await db.insert(services).values(data).returning();

  return c.json({ data: service }, 201);
});

// Update service
const updateServiceSchema = createServiceSchema.partial().extend({
  isActive: z.boolean().optional(),
});

contentRouter.patch("/services/:id", authMiddleware, managerOnly, zValidator("json", updateServiceSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const [existing] = await db.select().from(services).where(eq(services.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: "Service not found", code: "NOT_FOUND" }, 404);
  }

  const [updated] = await db
    .update(services)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(services.id, id))
    .returning();

  return c.json({ data: updated });
});

// Delete service
contentRouter.delete("/services/:id", authMiddleware, managerOnly, async (c) => {
  const id = c.req.param("id");

  const [deleted] = await db.delete(services).where(eq(services.id, id)).returning();

  if (!deleted) {
    return c.json({ error: "Service not found", code: "NOT_FOUND" }, 404);
  }

  return c.json({ data: { message: "Service deleted" } });
});

// ============= WEBSITE CONTENT =============

// Get all content (public)
contentRouter.get("/", optionalAuthMiddleware, async (c) => {
  const allContent = await db.query.content.findMany({
    where: eq(content.isPublished, true),
  });

  // Convert array to object keyed by section
  const contentMap: Record<string, any> = {};
  for (const item of allContent) {
    contentMap[item.section] = item.data;
  }

  return c.json({ data: contentMap });
});

// Get content by section (public)
contentRouter.get("/:section", optionalAuthMiddleware, async (c) => {
  const section = c.req.param("section");

  const [item] = await db.select().from(content).where(eq(content.section, section)).limit(1);

  if (!item) {
    return c.json({ data: null });
  }

  return c.json({ data: item });
});

// Update content section
const updateContentSchema = z.object({
  data: z.record(z.any()),
  isPublished: z.boolean().optional(),
});

contentRouter.patch("/:section", authMiddleware, managerOnly, zValidator("json", updateContentSchema), async (c) => {
  const section = c.req.param("section");
  const { data: newData, isPublished } = c.req.valid("json");

  const [existing] = await db.select().from(content).where(eq(content.section, section)).limit(1);

  if (existing) {
    // Update existing
    const [updated] = await db
      .update(content)
      .set({
        data: newData,
        isPublished: isPublished ?? existing.isPublished,
        publishedAt: isPublished ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(content.section, section))
      .returning();

    return c.json({ data: updated });
  } else {
    // Create new
    const [created] = await db
      .insert(content)
      .values({
        section,
        data: newData,
        isPublished: isPublished ?? false,
        publishedAt: isPublished ? new Date() : null,
      })
      .returning();

    return c.json({ data: created }, 201);
  }
});

// ============= TEAM PROFILES =============

// Get team (public)
contentRouter.get("/team/members", optionalAuthMiddleware, async (c) => {
  const team = await db.query.teamProfiles.findMany({
    where: eq(teamProfiles.isActive, true),
    orderBy: [teamProfiles.sortOrder],
  });

  return c.json({ data: team });
});

// Create team member
const createTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  group: z.string().min(1, "Group is required").max(100),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  sortOrder: z.string().optional(),
});

contentRouter.post("/team/members", authMiddleware, managerOnly, zValidator("json", createTeamMemberSchema), async (c) => {
  const data = c.req.valid("json");

  const [member] = await db.insert(teamProfiles).values(data).returning();

  return c.json({ data: member }, 201);
});

// Update team member
const updateTeamMemberSchema = createTeamMemberSchema.partial().extend({
  isActive: z.boolean().optional(),
});

contentRouter.patch("/team/members/:id", authMiddleware, managerOnly, zValidator("json", updateTeamMemberSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const [existing] = await db.select().from(teamProfiles).where(eq(teamProfiles.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: "Team member not found", code: "NOT_FOUND" }, 404);
  }

  const [updated] = await db
    .update(teamProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(teamProfiles.id, id))
    .returning();

  return c.json({ data: updated });
});

// Delete team member
contentRouter.delete("/team/members/:id", authMiddleware, managerOnly, async (c) => {
  const id = c.req.param("id");

  const [deleted] = await db.delete(teamProfiles).where(eq(teamProfiles.id, id)).returning();

  if (!deleted) {
    return c.json({ error: "Team member not found", code: "NOT_FOUND" }, 404);
  }

  return c.json({ data: { message: "Team member deleted" } });
});

export default contentRouter;
