/**
 * Database Seed Script
 * 
 * Creates the initial admin user from environment variables.
 * Run with: bun run db:seed
 */

import "dotenv/config";
import { db } from "./index";
import { users } from "./schema";
import { hashPassword } from "../utils/password";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seed...\n");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  // Check if admin already exists
  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail.toLowerCase()))
    .limit(1);

  if (existingAdmin) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
    console.log("\n🌱 Seed completed (no changes needed).\n");
    process.exit(0);
  }

  // Create admin user
  const passwordHash = await hashPassword(adminPassword);

  const [admin] = await db
    .insert(users)
    .values({
      email: adminEmail.toLowerCase(),
      passwordHash,
      name: "Admin",
      role: "admin",
      isActive: true,
    })
    .returning();

  console.log(`✅ Created admin user:`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   ID: ${admin.id}`);

  console.log("\n🌱 Seed completed successfully!\n");
  console.log("⚠️  Remember to change the admin password after first login.\n");

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
