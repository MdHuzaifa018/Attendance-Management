import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import Program from "../models/Program.js";
import AcademicSession from "../models/AcademicSession.js";
import Enrollment from "../models/Enrollment.js";
import Class from "../models/Class.js";
import Department from "../models/Department.js";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

const migrate = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const db = mongoose.connection.db;

    // 1. Create a default Program
    console.log("Creating default Program...");
    const dept = await Department.findOne();
    if (!dept) {
      throw new Error("No department found. Cannot create default Program.");
    }
    
    let defaultProgram = await Program.findOne({ code: "DEFAULT" });
    if (!defaultProgram) {
      defaultProgram = await Program.create({
        name: "Default Program",
        code: "DEFAULT",
        department: dept._id,
        durationYears: 3,
        totalSemesters: 6,
        isActive: true,
      });
      console.log("Created default Program.");
    }

    // 2. Extract unique academic years from Classes and create Academic Sessions
    console.log("Extracting Academic Sessions from Classes...");
    const classes = await Class.find();
    const sessionMap = new Map(); // academicYear -> AcademicSession._id

    for (const cls of classes) {
      const yearStr = cls.academicYear || "2024-25"; // Fallback if missing
      
      if (!sessionMap.has(yearStr)) {
        let session = await AcademicSession.findOne({ name: yearStr });
        if (!session) {
          const startYear = parseInt(yearStr.split("-")[0]);
          const endYear = startYear + 1;
          session = await AcademicSession.create({
            name: yearStr,
            startYear: startYear,
            endYear: endYear,
            startDate: new Date(`${startYear}-07-01`), // Approximation
            endDate: new Date(`${endYear}-06-30`),
            status: "active",
            isCurrent: true, // Just making them all true will leave the last one as true due to pre-save hook
          });
          console.log(`Created Academic Session: ${yearStr}`);
        }
        sessionMap.set(yearStr, session._id);
      }

      // Update Class with academicSession and program
      cls.academicSession = sessionMap.get(yearStr);
      cls.program = defaultProgram._id;
      await cls.save();
    }
    console.log("Updated all Classes with AcademicSession and Program.");

    // 3. Migrate Students to Enrollments
    console.log("Migrating Students to Enrollments...");
    const rawStudents = await db.collection("students").find({}).toArray();
    
    for (const rawStudent of rawStudents) {
      // Create Enrollment
      if (!rawStudent.class) {
        console.log(`Skipping student ${rawStudent._id} - no class found.`);
        continue;
      }

      const studentClass = await Class.findById(rawStudent.class);
      if (!studentClass) {
        console.log(`Class ${rawStudent.class} not found for student ${rawStudent._id}.`);
        continue;
      }

      const existingEnrollment = await Enrollment.findOne({
        student: rawStudent._id,
        academicSession: studentClass.academicSession,
      });

      let enrollmentId;

      if (!existingEnrollment) {
        const newEnrollment = await Enrollment.create({
          student: rawStudent._id,
          academicSession: studentClass.academicSession,
          program: defaultProgram._id,
          department: rawStudent.department,
          class: rawStudent.class,
          year: Math.ceil(studentClass.semester / 2),
          semester: studentClass.semester,
          section: studentClass.section || "A",
          rollNo: rawStudent.rollNo,
          status: "active",
          enrollmentDate: rawStudent.createdAt,
        });
        enrollmentId = newEnrollment._id;
        console.log(`Created Enrollment for student ${rawStudent.rollNo}`);
      } else {
        enrollmentId = existingEnrollment._id;
      }

      // Ensure student has batch and status populated
      await db.collection("students").updateOne(
        { _id: rawStudent._id },
        { 
          $set: { 
            batch: rawStudent.duration || "2024-27",
            status: "active" 
          } 
        }
      );
    }
    console.log("Students migration complete.");

    // 4. Update Attendance records to include Enrollment and AcademicSession
    console.log("Updating Attendance records...");
    const attendances = await Attendance.find();
    let updatedCount = 0;
    
    for (const att of attendances) {
      if (att.enrollment && att.academicSession) continue; // Already migrated

      // Find the enrollment for this student in this class
      const cls = await Class.findById(att.class);
      if (!cls) continue;

      const enrollment = await Enrollment.findOne({
        student: att.student,
        academicSession: cls.academicSession
      });

      if (enrollment) {
        att.enrollment = enrollment._id;
        att.academicSession = cls.academicSession;
        await att.save();
        updatedCount++;
      }
    }
    console.log(`Updated ${updatedCount} Attendance records.`);

    console.log("Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
