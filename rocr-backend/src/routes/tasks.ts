import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, and, or, ilike } from "drizzle-orm";
import { db } from "../db";
import { tasks, projects, milestones } from "../db/schema";
import { authMiddleware } from "../middleware/auth";

const tasksRouter = new Hono();

// All routes require authentication
tasksRouter.use("/*", authMiddleware);

// Create task schema
const createTaskSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  milestoneId: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  assigneeId: z.string().uuid().optional(),
  estimatedHours: z.coerce.number().positive().optional(),
  dueDate: z.string().datetime().optional(),
});

// List tasks schema
const listTasksSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
  projectId: z.string().uuid().optional(),
  status: z.enum(["todo", "in_progress", "review", "done", "blocked"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assigneeId: z.string().uuid().optional(),
  search: z.string().optional(),
});

// List tasks
tasksRouter.get("/", zValidator("query", listTasksSchema), async (c) => {
  const user = c.get("user");
  const { page, perPage, projectId, status, priority, assigneeId, search } = c.req.valid("query");
  const offset = (page - 1) * perPage;

  // Build conditions
  const conditions = [];

  // Non-admin/manager users can only see tasks assigned to them or in their projects
  if (user.role !== "admin" && user.role !== "manager") {
    conditions.push(
      or(
        eq(tasks.assigneeId, user.id),
        // Tasks in projects they own
        eq(projects.ownerId, user.id)
      )
    );
  }

  if (projectId) {
    conditions.push(eq(tasks.projectId, projectId));
  }

  if (status) {
    conditions.push(eq(tasks.status, status));
  }

  if (priority) {
    conditions.push(eq(tasks.priority, priority));
  }

  if (assigneeId) {
    conditions.push(eq(tasks.assigneeId, assigneeId));
  }

  if (search) {
    conditions.push(ilike(tasks.title, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db.query.tasks.findMany({
    where: whereClause,
    with: {
      project: {
        columns: { id: true, name: true },
      },
      assignee: {
        columns: { id: true, name: true, email: true, avatarUrl: true },
      },
      milestone: {
        columns: { id: true, title: true },
      },
    },
    orderBy: [desc(tasks.createdAt)],
    limit: perPage,
    offset,
  });

  const allTasks = await db.select({ id: tasks.id }).from(tasks).where(whereClause);
  const total = allTasks.length;

  return c.json({
    data: results,
    meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
  });
});

// Create task
tasksRouter.post("/", zValidator("json", createTaskSchema), async (c) => {
  const data = c.req.valid("json");

  // Verify project exists
  const [project] = await db.select().from(projects).where(eq(projects.id, data.projectId)).limit(1);
  if (!project) {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  // Verify milestone exists if provided
  if (data.milestoneId) {
    const [milestone] = await db.select().from(milestones).where(eq(milestones.id, data.milestoneId)).limit(1);
    if (!milestone || milestone.projectId !== data.projectId) {
      return c.json({ error: "Milestone not found or not in this project", code: "MILESTONE_NOT_FOUND" }, 404);
    }
  }

  const [task] = await db
    .insert(tasks)
    .values({
      ...data,
      status: "todo",
      estimatedHours: data.estimatedHours?.toString() || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    })
    .returning();

  return c.json({ data: task }, 201);
});

// Get single task
tasksRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    with: {
      project: {
        columns: { id: true, name: true, clientName: true },
      },
      assignee: {
        columns: { id: true, name: true, email: true, avatarUrl: true },
      },
      milestone: true,
    },
  });

  if (!task) {
    return c.json({ error: "Task not found", code: "NOT_FOUND" }, 404);
  }

  return c.json({ data: task });
});

// Update task schema
const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(["todo", "in_progress", "review", "done", "blocked"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  milestoneId: z.string().uuid().nullable().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  estimatedHours: z.coerce.number().positive().nullable().optional(),
  actualHours: z.coerce.number().positive().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  sortOrder: z.coerce.number().optional(),
});

// Update task
tasksRouter.patch("/:id", zValidator("json", updateTaskSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const [existing] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: "Task not found", code: "NOT_FOUND" }, 404);
  }

  // Prepare update data
  const updateData: any = { ...data, updatedAt: new Date() };

  if (data.estimatedHours !== undefined) {
    updateData.estimatedHours = data.estimatedHours?.toString() || null;
  }
  if (data.actualHours !== undefined) {
    updateData.actualHours = data.actualHours?.toString() || null;
  }
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  if (data.status === "done" && existing.status !== "done") {
    updateData.completedAt = new Date();
  }

  const [updated] = await db.update(tasks).set(updateData).where(eq(tasks.id, id)).returning();

  return c.json({ data: updated });
});

// Delete task
tasksRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning();

  if (!deleted) {
    return c.json({ error: "Task not found", code: "NOT_FOUND" }, 404);
  }

  return c.json({ data: { message: "Task deleted successfully" } });
});

// Get my tasks (assigned to current user)
tasksRouter.get("/my/assigned", async (c) => {
  const user = c.get("user");

  const myTasks = await db.query.tasks.findMany({
    where: eq(tasks.assigneeId, user.id),
    with: {
      project: {
        columns: { id: true, name: true },
      },
    },
    orderBy: [desc(tasks.createdAt)],
  });

  return c.json({ data: myTasks });
});

export default tasksRouter;
