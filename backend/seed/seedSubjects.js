/**
 * seedSubjects.js — Seeds academic subjects mapped to Classes and Teachers.
 *
 * Run from the backend/ directory:
 *   node seed/seedSubjects.js
 *
 * Safe to re-run — skips existing subjects.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import Subject from "../models/Subject.js";

dotenv.config();

const SAMPLE_SUBJECTS = [
  // BCA-III Curriculum (Target Class)
  {
    code: "BCA-301",
    name: "Core Java & OOP Concepts",
    classCode: "BCA-III",
    teacherEmployeeId: "TCH-BCA-001", // Dr. Rajesh Sharma
    totalClasses: 38,
  },
  {
    code: "BCA-302",
    name: "Database Management Systems (DBMS)",
    classCode: "BCA-III",
    teacherEmployeeId: "TCH-BCA-002", // Prof. Anita Roy
    totalClasses: 42,
  },
  {
    code: "BCA-303",
    name: "Computer Networks & Protocols",
    classCode: "BCA-III",
    teacherEmployeeId: "TCH-BCA-003", // Prof. Vikram Verma
    totalClasses: 35,
  },
  {
    code: "BCA-304",
    name: "Web Technologies & Modern Web Apps",
    classCode: "BCA-III",
    teacherEmployeeId: "TCH-BCA-002", // Prof. Anita Roy
    totalClasses: 34,
  },
  {
    code: "BCA-305",
    name: "Software Engineering & Testing",
    classCode: "BCA-III",
    teacherEmployeeId: "TCH-BCA-001", // Dr. Rajesh Sharma
    totalClasses: 30,
  },

  // BCA-I
  {
    code: "BCA-101",
    name: "Fundamentals of Programming in C",
    classCode: "BCA-I",
    teacherEmployeeId: "TCH-BCA-003",
    totalClasses: 25,
  },
  {
    code: "BCA-102",
    name: "Digital Electronics & Computer Architecture",
    classCode: "BCA-I",
    teacherEmployeeId: "TCH-BCA-002",
    totalClasses: 22,
  },

  // BCA-II
  {
    code: "BCA-201",
    name: "Data Structures & Algorithms in C++",
    classCode: "BCA-II",
    teacherEmployeeId: "TCH-BCA-001",
    totalClasses: 28,
  },
  {
    code: "BCA-202",
    name: "Operating Systems & Shell Scripting",
    classCode: "BCA-II",
    teacherEmployeeId: "TCH-BCA-003",
    totalClasses: 26,
  },

  // MCA-I
  {
    code: "MCA-101",
    name: "Advanced Algorithm Design & Complexity",
    classCode: "MCA-I",
    teacherEmployeeId: "TCH-MCA-001", // Dr. Sunita Mishra
    totalClasses: 32,
  },

  // MCA-II
  {
    code: "MCA-201",
    name: "Cloud Computing & Distributed Systems",
    classCode: "MCA-II",
    teacherEmployeeId: "TCH-MCA-001", // Dr. Sunita Mishra
    totalClasses: 30,
  },
];

const seedSubjects = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    console.log("Connecting to MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.\n");

    // Fetch classes lookup map: code -> _id
    const classDocs = await Class.find();
    const classMap = {};
    classDocs.forEach((c) => {
      classMap[c.code] = c._id;
    });

    // Fetch teachers lookup map: employeeId -> _id
    const teacherDocs = await Teacher.find();
    const teacherMap = {};
    teacherDocs.forEach((t) => {
      teacherMap[t.employeeId] = t._id;
    });

    console.log("Seeding subjects…");

    for (const sub of SAMPLE_SUBJECTS) {
      const classId = classMap[sub.classCode];
      if (!classId) {
        console.warn(`Class ${sub.classCode} not found, skipping ${sub.code}`);
        continue;
      }

      const teacherId = teacherMap[sub.teacherEmployeeId];
      if (!teacherId) {
        console.warn(
          `Teacher ${sub.teacherEmployeeId} not found, skipping ${sub.code}`
        );
        continue;
      }

      const existing = await Subject.findOne({
        code: sub.code,
        class: classId,
      });

      if (existing) {
        console.log(
          `⚠️  Subject exists: ${sub.code} in ${sub.classCode} (${sub.name})`
        );
        continue;
      }

      await Subject.create({
        name: sub.name,
        code: sub.code,
        class: classId,
        teacher: teacherId,
        totalClasses: sub.totalClasses || 0,
        isActive: true,
      });

      console.log(
        `✅ Subject created: ${sub.code} — ${sub.name} [${sub.classCode}]`
      );
    }

    console.log("\nSubject seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding subjects:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedSubjects();
