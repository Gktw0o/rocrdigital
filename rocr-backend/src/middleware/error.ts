import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

// Custom error class with code
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Error handler middleware
export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);

    // Handle HTTPException from Hono
    if (error instanceof HTTPException) {
      return c.json(
        {
          error: error.message,
          code: "HTTP_EXCEPTION",
        },
        error.status
      );
    }

    // Handle our custom AppError
    if (error instanceof AppError) {
      return c.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        error.statusCode as 400 | 401 | 403 | 404 | 500
      );
    }

    // Handle Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return c.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: (error as any).errors,
        },
        400
      );
    }

    // Handle database errors
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return c.json(
        {
          error: "Resource already exists",
          code: "DUPLICATE_ENTRY",
        },
        409
      );
    }

    // Generic error
    if (error instanceof Error) {
      return c.json(
        {
          error: process.env.NODE_ENV === "production" 
            ? "Internal server error" 
            : error.message,
          code: "INTERNAL_ERROR",
        },
        500
      );
    }

    // Unknown error
    return c.json(
      {
        error: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      },
      500
    );
  }
}

// Not found handler
export function notFound(c: Context) {
  return c.json(
    {
      error: "Not found",
      code: "NOT_FOUND",
      path: c.req.path,
    },
    404
  );
}
