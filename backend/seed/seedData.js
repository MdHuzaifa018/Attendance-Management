/**
 * seedData.js — Seeds departments, classes, and sample students.
 *
 * Run from the backend/ directory:
 *   node seed/seedData.js
 *   npm run seed:data
 *
 * Safe to re-run — skips existing records.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Department from "../models/Department.js";
import Class from "../models/Class.js";
import User from "../models/User.js";
import Student from "../models/Student.js";

dotenv.config();

// ─── Seed data definitions ────────────────────────────────────────────────────

const DEPARTMENTS = [
  { name: "Bachelor of Computer Applications", code: "BCA" },
  { name: "Master of Computer Applications", code: "MCA" },
];

// Classes keyed by department code
const CLASSES_BY_DEPT = {
  BCA: [
    { name: "BCA First Year",  code: "BCA-I",   semester: 1, academicYear: "2024-25" },
    { name: "BCA Second Year", code: "BCA-II",  semester: 3, academicYear: "2024-25" },
    { name: "BCA Third Year",  code: "BCA-III", semester: 5, academicYear: "2024-25" },
  ],
  MCA: [
    { name: "MCA First Year",  code: "MCA-I",   semester: 1, academicYear: "2024-25" },
    { name: "MCA Second Year", code: "MCA-II",  semester: 3, academicYear: "2024-25" },
  ],
};

// Sample students for BCA-III (the target class for this system)
const SAMPLE_STUDENTS = [
  { name: "Md Huzaifa",    rollNo: "BCA-III-001", email: "huzaifa@bca.edu",    fatherName: "Md Salim",       admissionYear: 2022, phone: "9876543210" },
  { name: "Rahul Kumar",   rollNo: "BCA-III-002", email: "rahul@bca.edu",      fatherName: "Raj Kumar",      admissionYear: 2022, phone: "9876543211" },
  { name: "Priya Singh",   rollNo: "BCA-III-003", email: "priya@bca.edu",      fatherName: "Ram Singh",      admissionYear: 2022, phone: "9876543212" },
  { name: "Aman Verma",    rollNo: "BCA-III-004", email: "aman@bca.edu",       fatherName: "Anil Verma",     admissionYear: 2022, phone: "9876543213" },
  { name: "Neha Gupta",    rollNo: "BCA-III-005", email: "neha@bca.edu",       fatherName: "Naresh Gupta",   admissionYear: 2022, phone: "9876543214" },
];

const DEFAULT_PASSWORD = "Student@1234";

// ─── Seed logic ───────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");

    console.log("Connecting to MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.\n");

    // 1. Seed departments
    console.log("── Departments ──────────────────────────────");
    const deptMap = {}; // code → _id

    for (const dept of DEPARTMENTS) {
      let existing = await Department.findOne({ code: dept.code });
      if (existing) {
        console.log(`⚠️  Department exists: ${dept.code}`);
        deptMap[dept.code] = existing._id;
      } else {
        const created = await Department.create({ ...dept, isActive: true });
        console.log(`✅ Department created: ${dept.code} — ${dept.name}`);
        deptMap[dept.code] = created._id;
      }
    }

    // 2. Seed classes
    console.log("\n── Classes ──────────────────────────────────");
    const classMap = {}; // code → _id

    for (const [deptCode, classes] of Object.entries(CLASSES_BY_DEPT)) {
      const departmentId = deptMap[deptCode];
      for (const cls of classes) {
        let existing = await Class.findOne({ code: cls.code });
        if (existing) {
          console.log(`⚠️  Class exists: ${cls.code}`);
          classMap[cls.code] = existing._id;
        } else {
          const created = await Class.create({
            ...cls,
            department: departmentId,
            isActive: true,
          });
          console.log(`✅ Class created: ${cls.code} — ${cls.name}`);
          classMap[cls.code] = created._id;
        }
      }
    }

    // 3. Seed sample BCA-III students
    console.log("\n── Sample Students (BCA-III) ────────────────");
    const bcaIIIId = classMap["BCA-III"];
    const bcaDeptId = deptMap["BCA"];
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    for (const s of SAMPLE_STUDENTS) {
      const existingStudent = await Student.findOne({ rollNo: s.rollNo });
      if (existingStudent) {
        console.log(`⚠️  Student exists: ${s.rollNo}`);
        continue;
      }

      const existingUser = await User.findOne({ email: s.email });
      let userId;

      if (existingUser) {
        userId = existingUser._id;
      } else {
        const user = await User.create({
          name: s.name,
          email: s.email,
          password: hashedPassword,
          role: "student",
          isActive: true,
        });
        userId = user._id;
      }

      await Student.create({
        user: userId,
        rollNo: s.rollNo,
        fatherName: s.fatherName,
        department: bcaDeptId,
        class: bcaIIIId,
        admissionYear: s.admissionYear,
        phone: s.phone,
      });

      console.log(`✅ Student created: ${s.rollNo} — ${s.name} (${s.email})`);
    }

    console.log(`\n📌 Default student password: ${DEFAULT_PASSWORD}`);
    console.log("\nSeed complete.\n");

  } catch (err) {
    console.error("Seed error:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
};

seed();
