import type { Context, Next } from "hono";

// In-memory store for rate limiting
// For production, use Redis or similar
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (value.resetTime < now) {
      requestCounts.delete(key);
    }
  }
}, 60000); // Clean every minute

interface RateLimitOptions {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
  message?: string;  // Error message
  keyGenerator?: (c: Context) => string; // Custom key generator
}

// Rate limiter factory
export function rateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = "Too many requests, please try again later",
    keyGenerator = (c: Context) => {
      // Use IP + user agent as key
      const ip = c.req.header("x-forwarded-for") || 
                 c.req.header("x-real-ip") || 
                 "unknown";
      return `${ip}:${c.req.path}`;
    },
  } = options;

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c);
    const now = Date.now();

    let entry = requestCounts.get(key);

    if (!entry || entry.resetTime < now) {
      // Create new entry
      entry = {
        count: 1,
        resetTime: now + windowMs,
      };
      requestCounts.set(key, entry);
    } else {
      // Increment count
      entry.count++;
    }

    // Set rate limit headers
    c.header("X-RateLimit-Limit", max.toString());
    c.header("X-RateLimit-Remaining", Math.max(0, max - entry.count).toString());
    c.header("X-RateLimit-Reset", Math.ceil(entry.resetTime / 1000).toString());

    if (entry.count > max) {
      c.header("Retry-After", Math.ceil((entry.resetTime - now) / 1000).toString());
      return c.json(
        {
          error: message,
          code: "RATE_LIMITED",
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        },
        429
      );
    }

    await next();
  };
}

// Preset rate limiters
export const strictRateLimiter = rateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  max: 10,              // 10 requests per minute
  message: "Too many requests. Please wait before trying again.",
});

export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 login attempts per 15 minutes
  message: "Too many login attempts. Please try again later.",
});

export const generalRateLimiter = rateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,             // 100 requests per minute
  message: "Rate limit exceeded. Please slow down.",
});

export const publicRateLimiter = rateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  max: 30,              // 30 requests per minute for public endpoints
  message: "Too many requests from this IP.",
});
