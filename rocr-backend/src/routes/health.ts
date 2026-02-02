import { Hono } from "hono";
import { db } from "../db";

const healthRouter = new Hono();

// Health check endpoint
healthRouter.get("/", async (c) => {
  try {
    // Try a simple database query to check connection
    const result = await db.execute("SELECT 1 as ok");
    
    return c.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
      },
    });
  } catch (error) {
    return c.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "disconnected",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      },
      503
    );
  }
});

// Readiness check (for Kubernetes-style deployments)
healthRouter.get("/ready", async (c) => {
  try {
    await db.execute("SELECT 1");
    return c.json({ ready: true });
  } catch {
    return c.json({ ready: false }, 503);
  }
});

// Liveness check
healthRouter.get("/live", (c) => {
  return c.json({ alive: true });
});

export default healthRouter;
