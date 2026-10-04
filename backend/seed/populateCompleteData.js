import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config();

import User from "../models/User.js";
import Student from "../models/Student.js";
import Department from "../models/Department.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import Timetable from "../models/Timetable.js";
import Enrollment from "../models/Enrollment.js";
import AcademicSession from "../models/AcademicSession.js";
import Attendance from "../models/Attendance.js";

// Real 100 students from user's PDF
const REAL_BCA2_STUDENTS = [
  { rollNo: 1, name: "RAHUL KUMAR", fatherName: "JANARDAN PRASAD", attended: 1 },
  { rollNo: 2, name: "HARSH KUMAR", fatherName: "JITENDRA KUMAR SINGH", attended: 17 },
  { rollNo: 3, name: "ADITYA RAJ", fatherName: "JITENDRA SAW", attended: 94 },
  { rollNo: 4, name: "ROHIT KUMAR", fatherName: "JITENDRA MALAKAR", attended: 100 },
  { rollNo: 5, name: "RAVI RANJAN", fatherName: "RAKESH SINGH", attended: 27 },
  { rollNo: 6, name: "ANKUSH RAJ", fatherName: "MADHUSUDAN PRASAD", attended: 8 },
  { rollNo: 7, name: "HANS RAJ", fatherName: "SHANKAR KUMAR", attended: 99 },
  { rollNo: 8, name: "KUNAL KRISHN", fatherName: "SHASHI BHUSHAN PRASAD", attended: 8 },
  { rollNo: 9, name: "RAVI RANJAN KUMAR", fatherName: "UPENDRA PRASAD", attended: 63 },
  { rollNo: 10, name: "KUNDAN KUMAR", fatherName: "RAJESH RAM", attended: 97 },
  { rollNo: 11, name: "PRAGYA SUMAN", fatherName: "PRAMOD PRASAD", attended: 71 },
  { rollNo: 12, name: "ABHAY KUMAR", fatherName: "MANOJ KUMAR", attended: 8 },
  { rollNo: 13, name: "TANVIR ALAM", fatherName: "MD SARWAR ALAM", attended: 10 },
  { rollNo: 14, name: "MD HASAN REZA", fatherName: "MD ILIYAS ALAM", attended: 25 },
  { rollNo: 15, name: "AMARJEET RAJ", fatherName: "PRATAP SINGH", attended: 103 },
  { rollNo: 16, name: "NUPUR KUMARI SINHA", fatherName: "PRATAP KUMAR SINHA", attended: 55 },
  { rollNo: 17, name: "RIYA BHARTI", fatherName: "SANJEET KUMAR", attended: 63 },
  { rollNo: 18, name: "RICHA KUMARI", fatherName: "SANTOSH KUMAR", attended: 75 },
  { rollNo: 19, name: "DOLLY KUMARI", fatherName: "MUNNA PRASAD GUPTA", attended: 60 },
  { rollNo: 20, name: "SHILPI KUMARI", fatherName: "SURAJ KUMAR", attended: 42 },
  { rollNo: 21, name: "PRINCE KUMAR", fatherName: "MUNNA KUMAR", attended: 54 },
  { rollNo: 22, name: "RAJEEV KUMAR", fatherName: "DEVENDRA PRASAD", attended: 8 },
  { rollNo: 23, name: "ANJAY KUMAR", fatherName: "AJAY KUMAR", attended: 16 },
  { rollNo: 24, name: "JEET GUPTA", fatherName: "UMESH KUMAR", attended: 78 },
  { rollNo: 25, name: "SHIVAM KUMAR", fatherName: "MAHESH RAM", attended: 15 },
  { rollNo: 26, name: "MUKESH KUMAR", fatherName: "UMESH PRASAD", attended: 74 },
  { rollNo: 27, name: "AMAN KUMAR", fatherName: "SANJAY KUMAR", attended: 49 },
  { rollNo: 28, name: "MAYANK SHARMA", fatherName: "SHAILENDRA KUMAR", attended: 0 },
  { rollNo: 29, name: "ROCKY KUMAR", fatherName: "DHARMENDRA PRASAD", attended: 11 },
  { rollNo: 30, name: "KUMARI NEHA BHARTI", fatherName: "VINOD PRASAD", attended: 38 },
  { rollNo: 31, name: "SATYAM KUMAR", fatherName: "MANOJ KUMAR", attended: 91 },
  { rollNo: 32, name: "SAHIL KUMAR", fatherName: "DHARMENDRA KUMAR", attended: 57 },
  { rollNo: 33, name: "ABHINANDAN KUMAR", fatherName: "MUNNA KUMAR", attended: 83 },
  { rollNo: 34, name: "SANIA SINHA", fatherName: "RAKESHWAR KUMAR", attended: 52 },
  { rollNo: 35, name: "DEEPAK RAJ", fatherName: "SURESH PRASAD", attended: 0 },
  { rollNo: 36, name: "ABHISHEK KUMAR", fatherName: "ANIL KUMAR", attended: 20 },
  { rollNo: 37, name: "GAUTAM KUMAR", fatherName: "SANJAY SAW", attended: 1 },
  { rollNo: 38, name: "SUBHAM KUMAR", fatherName: "MAHENDRA RAM", attended: 4 },
  { rollNo: 39, name: "AYUSH KUMAR", fatherName: "AKHILESH SINGH", attended: 3 },
  { rollNo: 40, name: "SONALI KUMARI", fatherName: "VINAY KUMAR", attended: 55 },
  { rollNo: 41, name: "AVINASH KUMAR", fatherName: "PRADEEP PRASAD", attended: 1 },
  { rollNo: 42, name: "VISHAL KUMAR", fatherName: "KISHOR KUMAR SINGH", attended: 78 },
  { rollNo: 43, name: "ABHISHEK KUMAR", fatherName: "AKALESH KUMAR", attended: 59 },
  { rollNo: 44, name: "VARSHA RANI", fatherName: "KAMLESH KUMAR", attended: 56 },
  { rollNo: 45, name: "RAGINI PRAJAPATI", fatherName: "RAVINDAR KUMAR", attended: 91 },
  { rollNo: 46, name: "KASTURI KUMARI", fatherName: "BHOLA KUMAR", attended: 98 },
  { rollNo: 47, name: "ADITYA KUMAR", fatherName: "NAVIN KUMAR", attended: 5 },
  { rollNo: 48, name: "VIKASH KUMAR", fatherName: "LALKESHWAR MOCHI", attended: 108 },
  { rollNo: 49, name: "SWETA RAJ", fatherName: "RAJNISH SINGH", attended: 0 },
  { rollNo: 50, name: "PRAKASH RANJAN", fatherName: "RAJ KUMAR PRASAD", attended: 35 },
  { rollNo: 51, name: "SHIVRAJ KUMAR", fatherName: "BRAJESH KUMAR", attended: 110 },
  { rollNo: 52, name: "SHUBHAM KUMAR", fatherName: "DILIP SAW", attended: 15 },
  { rollNo: 53, name: "IQRA ADIL", fatherName: "MD ADIL JAFRI", attended: 0 },
  { rollNo: 54, name: "RISHAV RAJ", fatherName: "AJIT KUMAR SINGH", attended: 0 },
  { rollNo: 55, name: "NITISH KUMAR", fatherName: "SATISH KUMAR", attended: 18 },
  { rollNo: 56, name: "ANJALI KUMARI", fatherName: "ANUP KUMAR", attended: 58 },
  { rollNo: 57, name: "SITTU KUMAR", fatherName: "PAPPU MALAKAR", attended: 34 },
  { rollNo: 58, name: "SHUBHAM KUMAR", fatherName: "PRAVIN KUMAR", attended: 2 },
  { rollNo: 59, name: "SAURAV KUMAR", fatherName: "JAYPATI PRASAD", attended: 108 },
  { rollNo: 60, name: "KARAN ARJUN", fatherName: "RAJKUMAR PAL", attended: 0 },
  { rollNo: 61, name: "PRASHANT KUMAR VERMA", fatherName: "SANJAY PRASAD", attended: 3 },
  { rollNo: 62, name: "VIKASH KUMAR", fatherName: "DINESH CHAUDHARI", attended: 4 },
  { rollNo: 63, name: "SHEEN ALIA", fatherName: "MOHAMMED TARIQUE HUSSAIN", attended: 9 },
  { rollNo: 64, name: "YUVRAJ KUMAR", fatherName: "GOPAL SINGH", attended: 0 },
  { rollNo: 65, name: "PIYUSH KUMAR", fatherName: "DHARMENDRA KUMAR", attended: 128 },
  { rollNo: 66, name: "SHREYA BHARTI", fatherName: "KUMAR AMRENDAR SINHA", attended: 3 },
  { rollNo: 67, name: "AMIT PRAKASH", fatherName: "MUNDRIKA PRASAD", attended: 96 },
  { rollNo: 68, name: "RITU NANDA KUMARI", fatherName: "SUDHIR KUMAR SINHA", attended: 0 },
  { rollNo: 69, name: "SHIVAM KUMAR", fatherName: "SHANKAR KUMAR", attended: 17 },
  { rollNo: 70, name: "MONU KUMAR", fatherName: "AYODHYA PRASAD", attended: 20 },
  { rollNo: 71, name: "RAVI RANJAN KUMAR", fatherName: "DHARMENDRA KUMAR", attended: 30 },
  { rollNo: 72, name: "VIBHANSHU SHEKHAR", fatherName: "PRAVIN KUMAR", attended: 15 },
  { rollNo: 73, name: "PREM KUMAR", fatherName: "RANJIT KUMAR", attended: 53 },
  { rollNo: 74, name: "ADITYA KUMAR", fatherName: "MITHLESH KUMAR", attended: 1 },
  { rollNo: 75, name: "ANKIT KUMAR", fatherName: "NAGENDRA PRASAD", attended: 18 },
  { rollNo: 76, name: "SUDHANSHU KUMAR", fatherName: "SUVESH KUMAR", attended: 72 },
  { rollNo: 77, name: "MD KAIF KHAN", fatherName: "MD JAMAL KHAN", attended: 95 },
  { rollNo: 78, name: "ARWAZ KHAN", fatherName: "MD AMIR KHAN", attended: 1 },
  { rollNo: 79, name: "ABHAY KUMAR", fatherName: "RANJIT KUMAR SINGH", attended: 111 },
  { rollNo: 80, name: "ABHISHEK KUMAR", fatherName: "RAJESH GUPTA", attended: 23 },
  { rollNo: 81, name: "DEVANSHU PANDEY", fatherName: "JITU PANDEY", attended: 43 },
  { rollNo: 82, name: "MD SAKLAIN MUSTAK", fatherName: "MD FIRDOUS ALAM", attended: 0 },
  { rollNo: 83, name: "KRISH KUMAR", fatherName: "RAJU SINGH", attended: 1 },
  { rollNo: 84, name: "KANHAIYA KUMAR", fatherName: "AKHILESH KUMAR", attended: 0 },
  { rollNo: 85, name: "MILI KUMARI", fatherName: "SUDHIR KUMAR", attended: 0 },
  { rollNo: 86, name: "DEEPAK KUMAR", fatherName: "SURESH YADAV", attended: 28 },
  { rollNo: 87, name: "VIJAY KUMAR", fatherName: "KRISHANNADAN PRASAD", attended: 1 },
  { rollNo: 88, name: "ABHINAB DEV", fatherName: "AKHILESH KUMAR", attended: 0 },
  { rollNo: 89, name: "AMIT KUMAR", fatherName: "AMAR RANJAN SINGH", attended: 0 },
  { rollNo: 90, name: "GAURAV KUMAR", fatherName: "ARVIND KUMAR SINGH", attended: 0 },
  { rollNo: 91, name: "AJIT KUMAR", fatherName: "BHARAT YADAV", attended: 10 },
  { rollNo: 92, name: "RITIK RAJ", fatherName: "BIPIN KUMAR", attended: 56 },
  { rollNo: 93, name: "SONAL ANAND", fatherName: "DINESH KUMAR AMBEDKAR", attended: 114 },
  { rollNo: 94, name: "RAVI RAJ", fatherName: "SATYENDRA KUMAR", attended: 2 },
  { rollNo: 95, name: "RUDRA ABHISHEK", fatherName: "SHRAVAN PRASAD GUPTA", attended: 0 },
  { rollNo: 96, name: "MD RASHID EQBAL", fatherName: "MD MOJAHID EQBAL", attended: 2 },
  { rollNo: 97, name: "ABHISHEK KUMAR", fatherName: "AKHILESH KUMAR", attended: 109 },
  { rollNo: 98, name: "AAYUSH RAJ", fatherName: "VINAY KUMAR", attended: 0 },
  { rollNo: 99, name: "SANJANA GUPTA", fatherName: "GAUTAM GUPTA", attended: 69 },
  { rollNo: 100, name: "LAKSHMAN KUMAR", fatherName: "SUDHIR PRASAD", attended: 3 }
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // 1. Get current active session (2026-27)
  const currentSession = await AcademicSession.findOne({ isCurrent: true });
  if (!currentSession) throw new Error("Current active session not found");
  console.log(`Current Session: ${currentSession.name} (${currentSession._id})`);

  const department = await Department.findOne({ code: "BCA" }) || await Department.findOne();

  // 2. Find or update classes for the current session
  let bca1 = await Class.findOne({ code: "BCA-I" });
  let bca2 = await Class.findOne({ code: "BCA-II" });
  let bca3 = await Class.findOne({ code: "BCA-III" });

  if (bca1) {
    await Class.findByIdAndUpdate(bca1._id, { name: "BCA First Year", academicSession: currentSession._id });
  }
  if (bca2) {
    await Class.findByIdAndUpdate(bca2._id, { name: "BCA Second Year", academicSession: currentSession._id });
  }
  if (bca3) {
    await Class.findByIdAndUpdate(bca3._id, { name: "BCA Third Year", academicSession: currentSession._id });
  }

  console.log(`BCA-I: ${bca1?._id} | BCA-II: ${bca2?._id} | BCA-III: ${bca3?._id}`);

  // 3. Get all teachers
  const teachers = await Teacher.find().populate("user");
  const teacherByEmp = {};
  teachers.forEach(t => { teacherByEmp[t.employeeId] = t; });

  const alauddin = teachers.find(t => t.employeeId === "TCH-BCA-001") || teachers[0];
  const aftab = teachers.find(t => t.employeeId === "TCH-BCA-002") || teachers[1];
  const parmanand = teachers.find(t => t.employeeId === "TCH-BCA-003") || teachers[2];
  const jitendra = teachers.find(t => t.employeeId === "TCH-BCA-004") || teachers[3];
  const ramanuj = teachers.find(t => t.employeeId === "TCH-BCA-005") || teachers[4];
  const ramashish = teachers.find(t => t.employeeId === "TCH-BCA-006") || teachers[5];
  const alpana = teachers.find(t => t.employeeId === "TCH-BCA-007") || teachers[6];

  // 4. Create / Update Subjects for BCA-II in current session
  console.log("\nSetting up Subjects for BCA-II...");
  const bca2SubjectDefs = [
    { code: "BCA2-DSA", name: "Data Structures & Algorithms in C++", teacher: alauddin._id, totalClasses: 28 },
    { code: "BCA2-DBMS", name: "Database Management Systems (DBMS)", teacher: jitendra._id, totalClasses: 28 },
    { code: "BCA2-CPP", name: "Object Oriented Programming with C++", teacher: aftab._id, totalClasses: 26 },
    { code: "BCA2-OS", name: "Operating Systems & Linux Shell", teacher: parmanand._id, totalClasses: 26 },
    { code: "BCA2-WEB", name: "Web Technologies & Internet", teacher: ramanuj._id, totalClasses: 24 },
  ];

  const bca2Subjects = [];
  for (const sDef of bca2SubjectDefs) {
    let sub = await Subject.findOne({ class: bca2._id, code: sDef.code });
    if (!sub) {
      sub = await Subject.create({
        code: sDef.code,
        name: sDef.name,
        class: bca2._id,
        teacher: sDef.teacher,
        totalClasses: sDef.totalClasses,
        isActive: true,
      });
    } else {
      sub.teacher = sDef.teacher;
      sub.name = sDef.name;
      sub.totalClasses = sDef.totalClasses;
      sub.isActive = true;
      await sub.save();
    }
    bca2Subjects.push(sub);
  }
  console.log(`Created/updated ${bca2Subjects.length} subjects for BCA-II`);

  // Subjects for BCA-I
  if (bca1) {
    const bca1SubjectDefs = [
      { code: "BCA1-PROG", name: "Programming in C", teacher: aftab._id, totalClasses: 25 },
      { code: "BCA1-FND", name: "Computer Fundamentals", teacher: alpana._id, totalClasses: 22 },
      { code: "BCA1-DE", name: "Digital Electronics", teacher: alauddin._id, totalClasses: 22 },
      { code: "BCA1-OFF", name: "MS-Office Automation", teacher: parmanand._id, totalClasses: 20 },
    ];
    for (const sDef of bca1SubjectDefs) {
      let sub = await Subject.findOne({ class: bca1._id, code: sDef.code });
      if (!sub) {
        await Subject.create({ ...sDef, class: bca1._id, isActive: true });
      }
    }
  }

  // Subjects for BCA-III
  if (bca3) {
    const bca3SubjectDefs = [
      { code: "BCA3-JAVA", name: "Core Java & OOP", teacher: jitendra._id, totalClasses: 35 },
      { code: "BCA3-VB", name: "Visual Basic & .NET", teacher: parmanand._id, totalClasses: 30 },
      { code: "BCA3-SE", name: "Software Engineering", teacher: aftab._id, totalClasses: 28 },
      { code: "BCA3-NET", name: "Computer Networks", teacher: alauddin._id, totalClasses: 32 },
    ];
    for (const sDef of bca3SubjectDefs) {
      let sub = await Subject.findOne({ class: bca3._id, code: sDef.code });
      if (!sub) {
        await Subject.create({ ...sDef, class: bca3._id, isActive: true });
      }
    }
  }

  // 5. Setup Timetable for BCA-II (Monday to Saturday)
  console.log("\nSetting up Timetable for BCA-II...");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periodsTemplate = [
    { periodNumber: 1, startTime: "09:00 AM", endTime: "10:00 AM", subject: bca2Subjects[0]._id, teacher: bca2Subjects[0].teacher, roomNo: "Room 101" },
    { periodNumber: 2, startTime: "10:00 AM", endTime: "11:00 AM", subject: bca2Subjects[1]._id, teacher: bca2Subjects[1].teacher, roomNo: "Room 101" },
    { periodNumber: 3, startTime: "11:30 AM", endTime: "12:30 PM", subject: bca2Subjects[2]._id, teacher: bca2Subjects[2].teacher, roomNo: "Room 102" },
    { periodNumber: 4, startTime: "12:30 PM", endTime: "01:30 PM", subject: bca2Subjects[3]._id, teacher: bca2Subjects[3].teacher, roomNo: "Room 102" },
    { periodNumber: 5, startTime: "02:00 PM", endTime: "03:00 PM", subject: bca2Subjects[4]._id, teacher: bca2Subjects[4].teacher, roomNo: "Computer Lab 1" },
  ];

  for (const day of days) {
    await Timetable.findOneAndUpdate(
      { class: bca2._id, dayOfWeek: day },
      { class: bca2._id, dayOfWeek: day, periods: periodsTemplate },
      { upsert: true, new: true }
    );
  }
  console.log("Timetable created for BCA-II (Mon-Sat, 5 periods/day)");

  // 6. Insert Real 100 Students for BCA-II
  console.log("\nEnrolling real 100 students into BCA-II...");
  const hashedPassword = await bcrypt.hash("Student@123", 10);
  const studentDocs = [];

  for (const item of REAL_BCA2_STUDENTS) {
    const padded = String(item.rollNo).padStart(3, "0");
    const rollNoStr = `BCA26-${padded}`;
    const emailPrefix = item.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
    const email = `${emailPrefix}.${padded}@nalanda.edu`;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: item.name,
        email,
        password: hashedPassword,
        role: "student",
        isActive: true,
      });
    }

    let student = await Student.findOne({ user: user._id });
    if (!student) {
      student = await Student.create({
        user: user._id,
        rollNo: rollNoStr,
        fatherName: item.fatherName,
        department: department._id,
        admissionYear: 2025,
        duration: "2025-28",
        batch: "2025-28",
        phone: "9876543" + padded,
      });
    } else {
      student.fatherName = item.fatherName;
      student.rollNo = rollNoStr;
      await student.save();
    }

    // Ensure Active Enrollment in BCA-II (Current Session)
    let enrollment = await Enrollment.findOne({
      student: student._id,
      class: bca2._id,
      academicSession: currentSession._id,
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: student._id,
        class: bca2._id,
        academicSession: currentSession._id,
        department: department._id,
        year: 2,
        semester: 3,
        section: "A",
        rollNo: rollNoStr,
        status: "active",
      });
    }

    studentDocs.push({
      student,
      enrollment,
      item,
    });
  }
  console.log(`Successfully prepared 100 students in BCA-II`);

  // 7. Seed Real Attendance Records for BCA-II (Total 132 classes engaged between 2026-07-02 and 2026-09-01)
  console.log("\nGenerating real attendance records (132 sessions engaged)...");
  
  // Wipe previous attendance for BCA-II to ensure exact parity with PDF
  await Attendance.deleteMany({ class: bca2._id, academicSession: currentSession._id });

  // Generate 132 distinct session slots across the date range 2026-07-02 to 2026-09-01
  // Total classes = 132
  const sessionSlots = [];
  const startDate = new Date(Date.UTC(2026, 6, 2)); // 02 July 2026
  let currentDate = new Date(startDate);

  let sessionCount = 0;
  while (sessionCount < 132) {
    const dayOfWeek = currentDate.getUTCDay(); // 0 is Sunday
    if (dayOfWeek !== 0) { // Monday-Saturday
      // 2 to 3 sessions per day
      const sessionsPerDay = Math.min(3, 132 - sessionCount);
      for (let sIdx = 0; sIdx < sessionsPerDay; sIdx++) {
        const sub = bca2Subjects[sessionCount % bca2Subjects.length];
        sessionSlots.push({
          date: new Date(currentDate),
          session: `Lecture-${sIdx + 1}`,
          subject: sub._id,
          teacher: sub.teacher,
        });
        sessionCount++;
      }
    }
    // advance 1 day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  console.log(`Built ${sessionSlots.length} lecture session slots`);

  // Bulk write attendance
  // For each student, attended count is X out of 132.
  // The first X sessions are present, the remaining (132 - X) are absent.
  const attendanceBatch = [];
  for (const sObj of studentDocs) {
    const { student, item } = sObj;
    const targetAttended = item.attended;

    for (let i = 0; i < sessionSlots.length; i++) {
      const slot = sessionSlots[i];
      const isPresent = i < targetAttended;

      attendanceBatch.push({
        student: student._id,
        enrollment: sObj.enrollment._id,
        academicSession: currentSession._id,
        class: bca2._id,
        subject: slot.subject,
        teacher: slot.teacher,
        date: slot.date,
        session: slot.session,
        status: isPresent ? "present" : "absent",
        markedAt: new Date(slot.date),
      });

      if (attendanceBatch.length >= 1000) {
        await Attendance.insertMany(attendanceBatch);
        attendanceBatch.length = 0;
      }
    }
  }

  if (attendanceBatch.length > 0) {
    await Attendance.insertMany(attendanceBatch);
  }

  console.log("✅ Successfully inserted all real attendance records for BCA-II!");

  // 8. Add dummy students in BCA-I and BCA-III for testing
  if (bca1) {
    console.log("\nAdding test students to BCA-I...");
    const bca1Sub = await Subject.findOne({ class: bca1._id });
    for (let i = 1; i <= 20; i++) {
      const p = String(i).padStart(3, "0");
      const roll = `BCA26-1-${p}`;
      const email = `bca1.student${p}@nalanda.edu`;
      let u = await User.findOne({ email });
      if (!u) {
        u = await User.create({ name: `BCA1 Student ${i}`, email, password: hashedPassword, role: "student", isActive: true });
      }
      let st = await Student.findOne({ user: u._id });
      if (!st) {
        st = await Student.create({ user: u._id, rollNo: roll, fatherName: `Parent ${i}`, department: department._id, admissionYear: 2026, duration: "2026-29", batch: "2026-29" });
      }
      await Enrollment.findOneAndUpdate(
        { student: st._id, class: bca1._id, academicSession: currentSession._id },
        { student: st._id, class: bca1._id, academicSession: currentSession._id, department: department._id, year: 1, semester: 1, section: "A", rollNo: roll, status: "active" },
        { upsert: true }
      );
    }
    console.log("BCA-I has 20 students enrolled");
  }

  if (bca3) {
    console.log("\nAdding test students to BCA-III...");
    for (let i = 1; i <= 20; i++) {
      const p = String(i).padStart(3, "0");
      const roll = `BCA26-3-${p}`;
      const email = `bca3.student${p}@nalanda.edu`;
      let u = await User.findOne({ email });
      if (!u) {
        u = await User.create({ name: `BCA3 Student ${i}`, email, password: hashedPassword, role: "student", isActive: true });
      }
      let st = await Student.findOne({ user: u._id });
      if (!st) {
        st = await Student.create({ user: u._id, rollNo: roll, fatherName: `Parent ${i}`, department: department._id, admissionYear: 2024, duration: "2024-27", batch: "2024-27" });
      }
      await Enrollment.findOneAndUpdate(
        { student: st._id, class: bca3._id, academicSession: currentSession._id },
        { student: st._id, class: bca3._id, academicSession: currentSession._id, department: department._id, year: 3, semester: 5, section: "A", rollNo: roll, status: "active" },
        { upsert: true }
      );
    }
    console.log("BCA-III has 20 students enrolled");
  }

  console.log("\n🎉 ALL DATA HAS BEEN SUCCESSFULLY POPULATED!");
  await mongoose.disconnect();
}

main().catch(err => {
  console.error("Error in populateCompleteData:", err);
  process.exit(1);
});
