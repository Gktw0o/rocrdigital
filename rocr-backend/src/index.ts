import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { prettyJSON } from "hono/pretty-json";
import { csrf } from "hono/csrf";

// Load environment variables
import "dotenv/config";

// Import middleware
import { 
  errorHandler, 
  notFound, 
  generalRateLimiter,
  authRateLimiter,
  publicRateLimiter 
} from "./middleware";

// Import routes
import {
  authRouter,
  usersRouter,
  contactsRouter,
  projectsRouter,
  tasksRouter,
  calendarRouter,
  scheduleRouter,
  timeRouter,
  contentRouter,
  healthRouter,
} from "./routes";

// Create Hono app
const app = new Hono();

// Get allowed origins from environment
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:1420")
  .split(",")
  .map((origin) => origin.trim());

// ============================================
// GLOBAL MIDDLEWARE (Security-focused order)
// ============================================

// 1. Request logging
app.use("*", logger());

// 2. Security headers (XSS, clickjacking protection, etc.)
app.use("*", secureHeaders({
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  crossOriginOpenerPolicy: "same-origin",
  crossOriginResourcePolicy: "same-origin",
}));

// 3. CORS configuration
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return null; // Deny requests without origin in production
      if (allowedOrigins.includes(origin)) return origin;
      if (process.env.NODE_ENV !== "production" && origin.includes("localhost")) {
        return origin;
      }
      return null;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposeHeaders: ["Content-Length", "X-Request-Id", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
    maxAge: 600,
  })
);

// 4. JSON formatting
app.use("*", prettyJSON());

// 5. Global rate limiter (100 req/min)
app.use("*", generalRateLimiter);

// 6. Error handler (catches all errors)
app.use("*", errorHandler);

// ============================================
// ROUTE-SPECIFIC RATE LIMITERS
// ============================================

// Strict rate limiting for auth endpoints (5 req/15 min)
app.use("/api/v1/auth/login", authRateLimiter);
app.use("/api/v1/auth/refresh", authRateLimiter);

// Public endpoint rate limiting (30 req/min)
app.use("/api/v1/contacts", publicRateLimiter);

// ============================================
// API ROUTES
// ============================================
app.route("/api/v1/auth", authRouter);
app.route("/api/v1/users", usersRouter);
app.route("/api/v1/contacts", contactsRouter);
app.route("/api/v1/projects", projectsRouter);
app.route("/api/v1/tasks", tasksRouter);
app.route("/api/v1/calendar", calendarRouter);
app.route("/api/v1/schedule", scheduleRouter);
app.route("/api/v1/time", timeRouter);
app.route("/api/v1/content", contentRouter);

// Health check (no rate limiting)
app.route("/health", healthRouter);

// Root endpoint
app.get("/", (c) => {
  return c.json({
    name: "ROCR Backend API",
    version: "0.2.0",
    status: "running",
    documentation: "/api/v1",
    security: {
      rateLimit: "enabled",
      cors: "restricted",
      securityHeaders: "enabled",
    },
  });
});

// API info endpoint
app.get("/api/v1", (c) => {
  return c.json({
    version: "1.0",
    security: {
      authentication: "JWT Bearer Token",
      rateLimit: {
        general: "100 req/min",
        auth: "5 req/15 min",
        public: "30 req/min",
      },
    },
    endpoints: {
      auth: {
        "POST /auth/login": "Login (rate limited)",
        "POST /auth/logout": "Logout",
        "POST /auth/refresh": "Refresh token (rate limited)",
        "GET /auth/me": "Current user",
        "POST /auth/update-password": "Update password",
      },
      users: {
        "GET /users": "List users (admin)",
        "POST /users": "Create user (admin)",
        "GET /users/:id": "Get user (admin)",
        "PATCH /users/:id": "Update user (admin)",
        "DELETE /users/:id": "Deactivate user (admin)",
      },
      contacts: {
        "POST /contacts": "Submit contact (public, rate limited)",
        "GET /contacts": "List contacts",
        "GET /contacts/:id": "Get contact",
        "PATCH /contacts/:id": "Update contact",
        "DELETE /contacts/:id": "Delete contact",
      },
      projects: {
        "GET /projects": "List projects",
        "POST /projects": "Create project (manager+)",
        "GET /projects/:id": "Get project with tasks",
        "PATCH /projects/:id": "Update project (manager+)",
        "DELETE /projects/:id": "Archive project (manager+)",
        "GET /projects/stats/summary": "Project stats",
      },
      tasks: {
        "GET /tasks": "List tasks",
        "POST /tasks": "Create task",
        "GET /tasks/:id": "Get task",
        "PATCH /tasks/:id": "Update task",
        "DELETE /tasks/:id": "Delete task",
        "GET /tasks/my/assigned": "My assigned tasks",
      },
      calendar: {
        "GET /calendar/events": "List events",
        "POST /calendar/events": "Create event",
        "GET /calendar/events/:id": "Get event",
        "PATCH /calendar/events/:id": "Update event",
        "DELETE /calendar/events/:id": "Delete event",
        "POST /calendar/events/:id/respond": "Respond to invitation",
        "GET /calendar/my": "My events",
      },
      schedule: {
        "GET /schedule": "My schedule",
        "PUT /schedule": "Set my schedule",
        "GET /schedule/user/:userId": "User schedule (manager)",
        "GET /schedule/availability": "Team availability (manager)",
        "GET /schedule/off-days": "My off days",
        "POST /schedule/off-days": "Request off day",
        "PATCH /schedule/off-days/:id": "Approve/reject (manager)",
        "DELETE /schedule/off-days/:id": "Cancel request",
        "GET /schedule/off-days/pending": "Pending requests (manager)",
      },
      time: {
        "POST /time/clock-in": "Clock in",
        "POST /time/clock-out": "Clock out",
        "GET /time/status": "Current clock status",
        "GET /time/entries": "List time entries",
        "POST /time/entries": "Manual time entry",
        "PATCH /time/entries/:id": "Update entry",
        "DELETE /time/entries/:id": "Delete entry",
        "GET /time/reports": "Time reports",
        "GET /time/today": "Today's summary",
      },
      content: {
        "GET /content": "All content (public)",
        "GET /content/:section": "Content section (public)",
        "PATCH /content/:section": "Update content (manager+)",
        "GET /content/partners": "Partners (public)",
        "POST /content/partners": "Create partner (manager+)",
        "PATCH /content/partners/:id": "Update partner (manager+)",
        "DELETE /content/partners/:id": "Delete partner (manager+)",
        "GET /content/services": "Services (public)",
        "POST /content/services": "Create service (manager+)",
        "PATCH /content/services/:id": "Update service (manager+)",
        "DELETE /content/services/:id": "Delete service (manager+)",
        "GET /content/team/members": "Team members (public)",
        "POST /content/team/members": "Create member (manager+)",
        "PATCH /content/team/members/:id": "Update member (manager+)",
        "DELETE /content/team/members/:id": "Delete member (manager+)",
      },
      health: {
        "GET /health": "Health check",
        "GET /health/ready": "Readiness",
        "GET /health/live": "Liveness",
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
║   🔒 Security:                                                ║
║   • Rate Limiting: Enabled                                    ║
║   • Security Headers: Enabled                                 ║
║   • CORS: Restricted                                          ║
║   • Input Validation: Zod                                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

export default {
  port,
  fetch: app.fetch,
};
