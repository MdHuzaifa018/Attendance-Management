import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Subject from "../models/Subject.js";
import Class from "../models/Class.js";
import Department from "../models/Department.js";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import AcademicSession from "../models/AcademicSession.js";

const MONGO_URI = "mongodb+srv://mdhuzaifsh786_db_user:P6UEAKp9ByK4DOj0@attendance-management.rcryqdu.mongodb.net/AttendanceSystem";

async function main() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  console.log("Connected successfully!");

  const bcaDept = await Department.findOne({ code: "BCA" });
  const bca2 = await Class.findOne({ code: "BCA-II" });
  const s2627 = await AcademicSession.findOne({ name: "2026-27" });

  if (!bcaDept || !bca2) {
    throw new Error("BCA Department or BCA-II Class not found!");
  }

  const hashedPassword = await bcrypt.hash("Teacher@123", 10);

  // 1. Ensure Farhat Zabeen (FZ) exists as Teacher
  let fzUser = await User.findOne({ email: "farhat@nalanda.edu" });
  if (!fzUser) {
    fzUser = await User.create({
      name: "Farhat Zabeen",
      email: "farhat@nalanda.edu",
      password: hashedPassword,
      role: "teacher",
      isActive: true,
    });
  }
  let fzTeacher = await Teacher.findOne({ user: fzUser._id });
  if (!fzTeacher) {
    fzTeacher = await Teacher.create({
      user: fzUser._id,
      employeeId: "EMP-FZ",
      departments: [bcaDept._id],
      designation: "Assistant Professor",
      phone: "9876543220",
      isActive: true,
    });
  }

  // 2. Ensure Rajnandan Prasad Sinha (RPS) exists as Teacher
  let rpsUser = await User.findOne({ email: "rajnandan@nalanda.edu" });
  if (!rpsUser) {
    rpsUser = await User.create({
      name: "Rajnandan Prasad Sinha",
      email: "rajnandan@nalanda.edu",
      password: hashedPassword,
      role: "teacher",
      isActive: true,
    });
  }
  let rpsTeacher = await Teacher.findOne({ user: rpsUser._id });
  if (!rpsTeacher) {
    rpsTeacher = await Teacher.create({
      user: rpsUser._id,
      employeeId: "EMP-RPS",
      departments: [bcaDept._id],
      designation: "Assistant Professor",
      phone: "9876543221",
      isActive: true,
    });
  }

  // 3. Map all faculties from the routine
  const allTeachers = await Teacher.find().populate("user");
  const getTeacher = (pattern) => allTeachers.find(t => pattern.test(t.user?.name));

  const facultyAA  = getTeacher(/Aftab/i);       // AA  - Aftab Alam
  const facultyPPD = getTeacher(/Parmanand/i);   // PPD - Parmanand Prasad
  const facultyJK  = getTeacher(/Jitendra/i);    // JK  - Jitendra kumar
  const facultyRP  = getTeacher(/Ramashish/i);   // RP  - Ramashish Prasad
  const facultyRK  = getTeacher(/Ramanuj/i);     // RK  - Ramanuj kumar
  const facultyMA  = getTeacher(/Alauddin|Aluddin/i); // MA  - Md. Aluddin
  const facultyAK  = getTeacher(/Alpana/i);      // AK  - Alpana kumari
  const facultyFZ  = fzTeacher;                  // FZ  - Farhat Zabeen

  console.log("Faculties mapped from Routine:");
  console.log("AA  (Aftab Alam):", facultyAA?.user?.name);
  console.log("PPD (Parmanand Prasad):", facultyPPD?.user?.name);
  console.log("JK  (Jitendra kumar):", facultyJK?.user?.name);
  console.log("RP  (Ramashish Prasad):", facultyRP?.user?.name);
  console.log("RK  (Ramanuj kumar):", facultyRK?.user?.name);
  console.log("MA  (Md. Aluddin):", facultyMA?.user?.name);
  console.log("AK  (Alpana kumari):", facultyAK?.user?.name);
  console.log("FZ  (Farhat Zabeen):", fzUser?.name);

  // 4. Delete existing subjects for BCA-II to avoid duplication
  await Subject.deleteMany({ class: bca2._id });

  // 5. Define BCA-II Subjects strictly from the Official Routine
  const bca2RoutineSubjects = [
    {
      code: "BCA-201",
      name: "C++",
      class: bca2._id,
      teacher: facultyAA._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
    {
      code: "BCA-202",
      name: "DS WITH C prog.",
      class: bca2._id,
      teacher: facultyPPD._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
    {
      code: "BCA-203",
      name: "CORE JAVA",
      class: bca2._id,
      teacher: facultyJK._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
    {
      code: "BCA-204",
      name: "Math.",
      class: bca2._id,
      teacher: facultyRP._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
    {
      code: "BCA-205",
      name: "NW & INTERNET",
      class: bca2._id,
      teacher: facultyRK._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
    {
      code: "BCA-206",
      name: "Python",
      class: bca2._id,
      teacher: facultyMA._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
    {
      code: "BCA-207",
      name: "Dig. sys & Archi",
      class: bca2._id,
      teacher: facultyAK._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
    {
      code: "BCA-208",
      name: "Eng.",
      class: bca2._id,
      teacher: facultyFZ._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
    {
      code: "BCA-209",
      name: "LAB",
      class: bca2._id,
      teacher: facultyAK._id,
      totalClasses: 36,
      totalDays: 36,
      isActive: true,
    },
  ];

  const createdSubjects = await Subject.insertMany(bca2RoutineSubjects);
  console.log(`\n✅ Created ${createdSubjects.length} subjects for BCA-II from Routine!`);

  // 6. Update attendance records for BCA-II students to link to these new routine subjects
  const bca2Students = await Student.find({ class: bca2._id });
  const sampleSubject = createdSubjects[0]; // C++

  if (s2627 && bca2Students.length > 0) {
    await Attendance.updateMany(
      { class: bca2._id, academicSession: s2627._id },
      {
        $set: {
          subject: sampleSubject._id,
          teacher: sampleSubject.teacher,
        },
      }
    );
    console.log("✅ Updated BCA-II attendance records to point to routine subject and teacher!");
  }

  // 7. Verification Summary
  const allBca2Subs = await Subject.find({ class: bca2._id })
    .populate({ path: "teacher", populate: { path: "user" } })
    .lean();

  console.log("\n==================== BCA-II ROUTINE SUBJECTS ====================");
  allBca2Subs.forEach((s) => {
    console.log(
      s.code.padEnd(10),
      "|",
      s.name.padEnd(20),
      "| Faculty:",
      s.teacher?.user?.name
    );
  });

  const totalSubsInDb = await Subject.countDocuments();
  console.log(`\nTotal Subjects across all classes in Database: ${totalSubsInDb}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Error setting up BCA-II subjects:", err);
  process.exit(1);
});
