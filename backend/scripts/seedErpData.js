import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Notice from "../models/Notice.js";
import Timetable from "../models/Timetable.js";
import ExamMark from "../models/ExamMark.js";
import Leave from "../models/Leave.js";

dotenv.config();

const seedErp = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("Admin user not found. Skipping notices/timetable.");
      process.exit(0);
    }

    // 1. Seed Notices
    console.log("Seeding Notices...");
    const noticeCount = await Notice.countDocuments();
    if (noticeCount === 0) {
      await Notice.create([
        {
          title: "🚨 Mandatory 75% Attendance Requirement for Semester Examination",
          content: "As per Patliputra University academic regulations, students failing to maintain at least 75% attendance in all core subjects will be debarred from appearing in final examinations. Defaulter lists will be reviewed this week.",
          category: "Attendance",
          priority: "urgent",
          targetRole: "all",
          postedBy: adminUser._id,
        },
        {
          title: "📝 BCA 3rd Year Mid-Term Internal Assessment Schedule",
          content: "Mid-Term evaluations and practical viva for BCA 3rd Year (Batch 2024-27) will commence from next Monday in Computer Lab 1 & 2. Full syllabus covered till date will be assessed.",
          category: "Exam",
          priority: "high",
          targetRole: "all",
          postedBy: adminUser._id,
        },
        {
          title: "🎉 Annual College IT TechFest & Hackathon Registration",
          content: "Registrations are now open for the Nalanda College Annual TechFest. Competitions include Web Development, Algorithmic Coding, and Project Exhibition. Contact Department H.O.D for team registration.",
          category: "Event",
          priority: "normal",
          targetRole: "all",
          postedBy: adminUser._id,
        },
      ]);
      console.log("✓ Seeded 3 official college notices.");
    } else {
      console.log(`Notice board already has ${noticeCount} notices.`);
    }

    // 2. Seed Timetable for BCA-III
    const bcaClass = await Class.findOne({ code: "BCA-III" });
    const subjects = await Subject.find({ class: bcaClass?._id });
    const teachers = await Teacher.find();

    if (bcaClass && subjects.length > 0) {
      console.log("Seeding Timetable for BCA-III...");
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const timeSlots = [
        { period: 1, start: "10:00 AM", end: "11:00 AM", room: "Room 201" },
        { period: 2, start: "11:00 AM", end: "12:00 PM", room: "Room 201" },
        { period: 3, start: "12:30 PM", end: "01:30 PM", room: "Lab 1 (Software Lab)" },
        { period: 4, start: "01:30 PM", end: "02:30 PM", room: "Lab 2 (Network Lab)" },
      ];

      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const periods = timeSlots.map((slot, sIdx) => {
          const sub = subjects[(i + sIdx) % subjects.length];
          const t = teachers[sIdx % (teachers.length || 1)];
          return {
            periodNumber: slot.period,
            startTime: slot.start,
            endTime: slot.end,
            subject: sub._id,
            teacher: t ? t._id : undefined,
            roomNo: slot.room,
          };
        });

        await Timetable.findOneAndUpdate(
          { class: bcaClass._id, dayOfWeek: day },
          { class: bcaClass._id, dayOfWeek: day, periods },
          { upsert: true }
        );
      }
      console.log("✓ Timetable for Monday-Saturday configured.");
    }

    // 3. Seed Sample Exam Marks
    const students = await Student.find({ class: bcaClass?._id }).limit(10);
    if (students.length > 0 && subjects.length > 0) {
      console.log("Seeding Sample Exam Marks...");
      for (const st of students) {
        for (const sub of subjects.slice(0, 3)) {
          const score = Math.floor(Math.random() * 25) + 72; // 72 to 96
          await ExamMark.findOneAndUpdate(
            { student: st._id, subject: sub._id, examType: "Internal Assessment" },
            {
              student: st._id,
              subject: sub._id,
              examType: "Internal Assessment",
              maxMarks: 100,
              marksObtained: score,
              remarks: score >= 85 ? "Excellent performance" : "Good grasp of fundamentals",
              gradedBy: adminUser._id,
            },
            { upsert: true }
          );
        }
      }
      console.log("✓ Sample exam marks seeded.");
    }

    // 4. Seed Sample Leave Applications
    if (students.length >= 2) {
      console.log("Seeding Sample Leave requests...");
      const leaveCount = await Leave.countDocuments();
      if (leaveCount === 0) {
        await Leave.create([
          {
            student: students[0]._id,
            leaveType: "Medical",
            startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            reason: "Viral fever and physician recommended rest.",
            status: "approved",
            reviewedBy: adminUser._id,
            reviewNote: "Approved with medical prescription verified.",
          },
          {
            student: students[1]._id,
            leaveType: "Academic",
            startDate: new Date(),
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            reason: "Attending inter-university technical symposium at Patna.",
            status: "pending",
          },
        ]);
        console.log("✓ Sample leaves created.");
      }
    }

    console.log("\n ERP Seed complete! All modules ready.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedErp();
