import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, and, or, ilike } from "drizzle-orm";
import { db } from "../db";
import { projects, tasks, milestones, users } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { managerOnly } from "../middleware/roles";

const projectsRouter = new Hono();

// All routes require authentication
projectsRouter.use("/*", authMiddleware);

// Create project schema
const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(2000).optional(),
  clientName: z.string().max(100).optional(),
  budget: z.coerce.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
});

// List projects schema
const listProjectsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["planning", "in_progress", "on_hold", "review", "completed", "archived"]).optional(),
  search: z.string().optional(),
});

// List projects
projectsRouter.get("/", zValidator("query", listProjectsSchema), async (c) => {
  const user = c.get("user");
  const { page, perPage, status, search } = c.req.valid("query");
  const offset = (page - 1) * perPage;

  // Build conditions
  const conditions = [];

  // Non-admin users can only see projects they own or are assigned to
  if (user.role !== "admin" && user.role !== "manager") {
    conditions.push(eq(projects.ownerId, user.id));
  }

  if (status) {
    conditions.push(eq(projects.status, status));
  }

  if (search) {
    conditions.push(
      or(
        ilike(projects.name, `%${search}%`),
        ilike(projects.clientName, `%${search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db.query.projects.findMany({
    where: whereClause,
    with: {
      owner: {
        columns: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
    orderBy: [desc(projects.createdAt)],
    limit: perPage,
    offset,
  });

  // Get total count
  const allProjects = await db.select({ id: projects.id }).from(projects).where(whereClause);
  const total = allProjects.length;

  return c.json({
    data: results,
    meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
  });
});

// Create project (manager+ only)
projectsRouter.post("/", managerOnly, zValidator("json", createProjectSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");

  const [project] = await db
    .insert(projects)
    .values({
      ...data,
      ownerId: user.id,
      status: "planning",
      budget: data.budget?.toString() || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    })
    .returning();

  return c.json({ data: project }, 201);
});

// Get single project with tasks and milestones
projectsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      owner: {
        columns: { id: true, name: true, email: true, avatarUrl: true },
      },
      milestones: {
        orderBy: [milestones.sortOrder],
      },
      tasks: {
        with: {
          assignee: {
            columns: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
        orderBy: [tasks.sortOrder],
      },
    },
  });

  if (!project) {
    return c.json({ error: "Project not found", code: "NOT_FOUND" }, 404);
  }

  // Check access for non-admin/manager
  if (user.role !== "admin" && user.role !== "manager" && project.ownerId !== user.id) {
    return c.json({ error: "Access denied", code: "FORBIDDEN" }, 403);
  }

  return c.json({ data: project });
});

// Update project schema
const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).nullable().optional(),
  clientName: z.string().max(100).nullable().optional(),
  status: z.enum(["planning", "in_progress", "on_hold", "review", "completed", "archived"]).optional(),
  budget: z.coerce.number().positive().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

// Update project
projectsRouter.patch("/:id", managerOnly, zValidator("json", updateProjectSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const [existing] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: "Project not found", code: "NOT_FOUND" }, 404);
  }

  // Prepare update data
  const updateData: any = { ...data, updatedAt: new Date() };

  if (data.budget !== undefined) {
    updateData.budget = data.budget?.toString() || null;
  }
  if (data.startDate !== undefined) {
    updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  }
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  if (data.status === "completed" && existing.status !== "completed") {
    updateData.completedAt = new Date();
  }

  const [updated] = await db.update(projects).set(updateData).where(eq(projects.id, id)).returning();

  return c.json({ data: updated });
});

// Delete project (archive)
projectsRouter.delete("/:id", managerOnly, async (c) => {
  const id = c.req.param("id");

  const [existing] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: "Project not found", code: "NOT_FOUND" }, 404);
  }

  // Soft delete - set status to archived
  await db.update(projects).set({ status: "archived", updatedAt: new Date() }).where(eq(projects.id, id));

  return c.json({ data: { message: "Project archived successfully" } });
});

// Get project stats
projectsRouter.get("/stats/summary", async (c) => {
  const user = c.get("user");

  let condition;
  if (user.role !== "admin" && user.role !== "manager") {
    condition = eq(projects.ownerId, user.id);
  }

  const allProjects = await db.select().from(projects).where(condition);

  const stats = {
    total: allProjects.length,
    planning: allProjects.filter((p) => p.status === "planning").length,
    inProgress: allProjects.filter((p) => p.status === "in_progress").length,
    onHold: allProjects.filter((p) => p.status === "on_hold").length,
    review: allProjects.filter((p) => p.status === "review").length,
    completed: allProjects.filter((p) => p.status === "completed").length,
    archived: allProjects.filter((p) => p.status === "archived").length,
  };

  return c.json({ data: stats });
});

export default projectsRouter;
