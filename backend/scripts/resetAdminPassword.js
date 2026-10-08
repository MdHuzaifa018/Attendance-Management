/**
 * resetAdminPassword.js
 * CLI Utility to change or reset Administrator credentials (email & password)
 *
 * Usage:
 *   node scripts/resetAdminPassword.js [email] [newPassword]
 *
 * Examples:
 *   node scripts/resetAdminPassword.js
 *   (Resets default admin: admin@nalanda.edu -> Admin@1234)
 *
 *   node scripts/resetAdminPassword.js admin@nalanda.edu MyNewSecret@2026
 *   (Sets new custom password)
 *
 *   node scripts/resetAdminPassword.js newadmin@nalanda.edu SecurePass@999
 *   (Updates email and password)
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SALT_ROUNDS = 10;

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in backend/.env");
    }

    const args = process.argv.slice(2);
    const targetEmail = (args[0] || "admin@nalanda.edu").toLowerCase().trim();
    const newPassword = args[1] || "Admin@1234";

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.\n");

    // Check if target admin exists
    let admin = await User.findOne({ email: targetEmail });

    if (!admin) {
      // Find ANY admin user in the system
      admin = await User.findOne({ role: "admin" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    if (admin) {
      console.log(`Found Admin Account: "${admin.name}" (Current Email: ${admin.email})`);
      admin.email = targetEmail;
      admin.password = hashedPassword;
      admin.isActive = true;
      await admin.save();

      console.log("\n================================================");
      console.log("SUCCESS! Admin Credentials Updated Successfully:");
      console.log(`  Name:     ${admin.name}`);
      console.log(`  Email/ID: ${admin.email}`);
      console.log(`  Password: ${newPassword}`);
      console.log("================================================\n");
    } else {
      // Create new admin if none exists
      console.log("No admin found in database. Creating brand new Admin user...");
      const createdAdmin = await User.create({
        name: "System Admin",
        email: targetEmail,
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });

      console.log("\n================================================");
      console.log("SUCCESS! Created New Admin User:");
      console.log(`  Name:     ${createdAdmin.name}`);
      console.log(`  Email/ID: ${createdAdmin.email}`);
      console.log(`  Password: ${newPassword}`);
      console.log("================================================\n");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error resetting admin password:", error.message);
    process.exit(1);
  }
};

run();
