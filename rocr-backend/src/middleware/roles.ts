import type { Context, Next } from "hono";
import type { UserRole } from "../db/schema/users";

// Role hierarchy (higher index = more permissions)
const roleHierarchy: UserRole[] = ["freelancer", "employee", "manager", "admin"];

// Check if user has at least one of the required roles
export function requireRole(allowedRoles: UserRole[]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json(
        { error: "Unauthorized", code: "NO_USER" },
        401
      );
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      return c.json(
        {
          error: "Insufficient permissions",
          code: "FORBIDDEN",
          required: allowedRoles,
          current: user.role,
        },
        403
      );
    }

    await next();
  };
}

// Check if user has at least the minimum role level
export function requireMinRole(minRole: UserRole) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json(
        { error: "Unauthorized", code: "NO_USER" },
        401
      );
    }

    const userRoleIndex = roleHierarchy.indexOf(user.role as UserRole);
    const minRoleIndex = roleHierarchy.indexOf(minRole);

    if (userRoleIndex < minRoleIndex) {
      return c.json(
        {
          error: "Insufficient permissions",
          code: "FORBIDDEN",
          required: `${minRole} or higher`,
          current: user.role,
        },
        403
      );
    }

    await next();
  };
}

// Admin only shorthand
export const adminOnly = requireRole(["admin"]);

// Manager or admin
export const managerOnly = requireRole(["admin", "manager"]);

// Any authenticated user (employee+)
export const employeeOnly = requireMinRole("employee");
