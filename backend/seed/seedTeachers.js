import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Department from "../models/Department.js";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";

dotenv.config();

const SAMPLE_TEACHERS = [
  {
    name: "Dr. Rajesh Sharma",
    email: "rajesh@nalanda.edu",
    employeeId: "TCH-BCA-001",
    deptCode: "BCA",
    designation: "Associate Professor & HOD",
    phone: "9812345670",
  },
  {
    name: "Prof. Anita Roy",
    email: "anita@nalanda.edu",
    employeeId: "TCH-BCA-002",
    deptCode: "BCA",
    designation: "Assistant Professor",
    phone: "9812345671",
  },
  {
    name: "Prof. Vikram Verma",
    email: "vikram@nalanda.edu",
    employeeId: "TCH-BCA-003",
    deptCode: "BCA",
    designation: "Assistant Professor",
    phone: "9812345672",
  },
  {
    name: "Dr. Sunita Mishra",
    email: "sunita@nalanda.edu",
    employeeId: "TCH-MCA-001",
    deptCode: "MCA",
    designation: "Associate Professor",
    phone: "9812345673",
  },
];

const DEFAULT_PASSWORD = "Teacher@1234";

const seedTeachers = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");

    console.log("Connecting to MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.\n");

    const deptMap = {};
    const departments = await Department.find();
    departments.forEach((d) => {
      deptMap[d.code] = d._id;
    });

    console.log("Seeding teachers…");
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    for (const t of SAMPLE_TEACHERS) {
      const deptId = deptMap[t.deptCode];
      if (!deptId) {
        console.warn(`Department ${t.deptCode} not found, skipping ${t.name}`);
        continue;
      }

      let teacherDoc = await Teacher.findOne({ employeeId: t.employeeId });
      if (teacherDoc) {
        console.log(`⚠️  Teacher exists: ${t.employeeId} (${t.name})`);
        continue;
      }

      let userDoc = await User.findOne({ email: t.email });
      if (!userDoc) {
        userDoc = await User.create({
          name: t.name,
          email: t.email,
          password: hashedPassword,
          role: "teacher",
          isActive: true,
        });
        console.log(`+ User created: ${t.email}`);
      }

      teacherDoc = await Teacher.create({
        user: userDoc._id,
        employeeId: t.employeeId,
        department: deptId,
        designation: t.designation,
        phone: t.phone,
        isActive: true,
      });

      console.log(`✓ Teacher created: ${t.employeeId} — ${t.name} (${t.designation})`);
    }

    console.log("\nTeacher seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding teachers:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedTeachers();
