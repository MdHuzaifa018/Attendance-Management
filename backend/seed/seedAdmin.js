/**
 * seedAdmin.js — Creates demo users for development and testing.
 *
 * Run from the backend/ directory:
 *   node seed/seedAdmin.js
 *
 * Or via npm script (after adding to package.json):
 *   npm run seed:admin
 *
 * Creates:
 *   1. Admin user   — admin@nalanda.edu / Admin@1234
 *   2. Teacher user — teacher@nalanda.edu / Teacher@1234
 *
 * Safe to re-run — skips existing accounts.
 * These are DEVELOPMENT credentials. Change before deployment.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Load .env from the backend/ directory (one level up from seed/)
dotenv.config();

const SALT_ROUNDS = 10;

const DEMO_USERS = [
  {
    name: "System Admin",
    email: "admin@nalanda.edu",
    password: "Admin@1234",
    role: "admin",
  },
  {
    name: "Demo Teacher",
    email: "teacher@nalanda.edu",
    password: "Teacher@1234",
    role: "teacher",
  },
];

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in .env");
    }

    console.log("Connecting to MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.\n");

    for (const userData of DEMO_USERS) {
      const existing = await User.findOne({ email: userData.email });

      if (existing) {
        console.log(`⚠️  Already exists: ${userData.email} (role: ${existing.role}) — skipped`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
      });

      console.log(`✅ Created  [${userData.role}]  ${userData.email}  /  ${userData.password}`);
    }

    console.log("\nSeed complete.\n");
    console.log("Login credentials:");
    console.log("  Admin:   admin@nalanda.edu   / Admin@1234");
    console.log("  Teacher: teacher@nalanda.edu / Teacher@1234");
    console.log("\n⚠️  Change these passwords before deploying to production.\n");

  } catch (error) {
    console.error("Seed error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seed();
