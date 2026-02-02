import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { prettyJSON } from "hono/pretty-json";

// Load environment variables
import "dotenv/config";

// Import middleware
import { errorHandler, notFound } from "./middleware";

// Import routes
import {
  authRouter,
  usersRouter,
  contactsRouter,
  healthRouter,
} from "./routes";

// Create Hono app
const app = new Hono();

// Get allowed origins from environment
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:1420")
  .split(",")
  .map((origin) => origin.trim());

// Global middleware
app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return "*";
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) return origin;
      // In development, allow localhost variants
      if (process.env.NODE_ENV !== "production" && origin.includes("localhost")) {
        return origin;
      }
      return null;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
  })
);

// Error handler (must be before routes)
app.use("*", errorHandler);

// API routes
app.route("/api/v1/auth", authRouter);
app.route("/api/v1/users", usersRouter);
app.route("/api/v1/contacts", contactsRouter);

// Health check (no /api/v1 prefix)
app.route("/health", healthRouter);

// Root endpoint
app.get("/", (c) => {
  return c.json({
    name: "ROCR Backend API",
    version: "0.1.0",
    status: "running",
    documentation: "/api/v1",
  });
});

// API info endpoint
app.get("/api/v1", (c) => {
  return c.json({
    version: "1.0",
    endpoints: {
      auth: {
        "POST /api/v1/auth/login": "Login with email and password",
        "POST /api/v1/auth/refresh": "Refresh access token",
        "POST /api/v1/auth/logout": "Logout and invalidate tokens",
        "GET /api/v1/auth/me": "Get current user info",
        "POST /api/v1/auth/update-password": "Update password",
      },
      users: {
        "GET /api/v1/users": "List all users (admin only)",
        "POST /api/v1/users": "Create new user (admin only)",
        "GET /api/v1/users/:id": "Get user by ID (admin only)",
        "PATCH /api/v1/users/:id": "Update user (admin only)",
        "DELETE /api/v1/users/:id": "Deactivate user (admin only)",
        "POST /api/v1/users/:id/reset-password": "Reset user password (admin only)",
      },
      contacts: {
        "POST /api/v1/contacts": "Submit contact form (public)",
        "GET /api/v1/contacts": "List contacts (authenticated)",
        "GET /api/v1/contacts/:id": "Get contact details (authenticated)",
        "PATCH /api/v1/contacts/:id": "Update contact (authenticated)",
        "DELETE /api/v1/contacts/:id": "Delete contact (manager+)",
        "GET /api/v1/contacts/stats/summary": "Get contact stats (authenticated)",
      },
      health: {
        "GET /health": "Health check",
        "GET /health/ready": "Readiness check",
        "GET /health/live": "Liveness check",
      },
    },
  });
});

// 404 handler
app.notFound(notFound);

// Start server
const port = parseInt(process.env.PORT || "3000");

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 ROCR Backend API Server                                  ║
║                                                               ║
║   Environment: ${(process.env.NODE_ENV || "development").padEnd(43)}║
║   Port: ${port.toString().padEnd(52)}║
║   Health: http://localhost:${port}/health                      ║
║   API Docs: http://localhost:${port}/api/v1                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

export default {
  port,
  fetch: app.fetch,
};
