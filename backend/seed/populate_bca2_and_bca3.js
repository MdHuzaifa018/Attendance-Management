import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";
import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import AcademicSession from "../models/AcademicSession.js";
import Department from "../models/Department.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import { bca2PdfStudents } from "./bca2PdfStudents.js";

const MONGO_URI = "mongodb+srv://mdhuzaifsh786_db_user:P6UEAKp9ByK4DOj0@attendance-management.rcryqdu.mongodb.net/AttendanceSystem";

// 120 BCA-3 Students raw data from importBCAStudents.js
const bca3RawData = `1 MURLIDHAR YADAV UPENDRA YADAV 64 36 Poor
2 BALI KUMAR BHUSHAN CHAUHAN 3 2 Very Poor
3 ANANT RAJ RANJEET KUMAR 29 16 Very Poor
4 AMBIKA KUMARI RANJEET KUMAR 28 16 Very Poor
5 RAUSHAN KUMAR SHIV KUMAR PRASAD 37 21 Very Poor
6 ADITI GUPTA RAJESH KUMAR 90 50 Good
7 ANJALI GUPTA SUNIL KUMAR 33 18 Very Poor
8 SUMIT KUMAR VIJAY CHAUDHARI 172 96 Excellent
9 SHRUTI SHARMA SHAILENDRA KUMAR 1 1 Very Poor
10 HIMANSHU KUMAR SATYENDRA KUMAR 24 13 Very Poor
11 SURUCHI KUMARI ANIL KUMAR 76 42 Poor
12 ARYAN KUMAR SANTOSH PRASAD 17 9 Very Poor
13 SAURAV KUMAR SHAILENDRA PRASAD 6 3 Very Poor
14 MD HUZAIFA MD CHAND 79 44 Poor
15 HARSH GUPTA RAJKUMAR PRASAD 19 11 Very Poor
16 KUMAR SAGAR NITIN KUMAR 3 2 Very Poor
17 ANISHA KUMARI JAWAHAR SINGH 0 0 Very Poor
18 ADITYA SHUBHAM SHAILENDRA KUMAR 8 4 Very Poor
19 PRIYANSHU KUMAR VINOD KUMAR 4 2 Very Poor
20 HARSH RAJ UDAY KUMAR PANDIT 6 3 Very Poor
21 SURAJ KUMAR SHIV SHANKAR KUMAR 1 1 Very Poor
22 SALONI AJAY KUMAR 38 21 Very Poor
23 SUBHYA SUMAN ABHAYDEO KUMAR 21 12 Very Poor
24 KARAN KUMAR NANDLAL SINGH 28 16 Very Poor
25 RISHIKET KUMAR CHANDRA BHUSHAN PANDIT 5 3 Very Poor
26 AMIT RAJ ARVIND KUMAR 0 0 Very Poor
27 MD SAHOON ALAM MD MUKHTAR ALAM 0 0 Very Poor
28 MUSKAN KUMARI PRAMOD KUMAR 34 19 Very Poor
29 MD ARSHAD MD RIYAZ 23 13 Very Poor
30 SAURAV KUMAR SANJAY PRATAP 0 0 Very Poor
31 SAURAV KUMAR SANJAY KUMAR 15 8 Very Poor
32 HARSHIT KUMAR PRADIP KUMAR RAM 6 3 Very Poor
33 PAYAL KUMARI YAMUNA PRASAD 3 2 Very Poor
34 ANKIT KUMAR SHASHI KUMAR 0 0 Very Poor
35 ANKIT KUMAR DILIP KUMAR 41 23 Very Poor
36 SOHAN KUMAR ATISH SINGH 0 0 Very Poor
37 JAY KUMAR JITENDRA KUMAR 20 11 Very Poor
38 ANJALI RANI SHAMBHU KUMAR 6 3 Very Poor
39 ROHIT KUMAR KAUSHAL KISHOR 37 21 Very Poor
40 AAYUSH KUMAR KAUSHIK PRANAY KUMAR 21 12 Very Poor
41 RUDRA RAJ DILIP KUMAR 2 1 Very Poor
42 SHREYA SUNIL KUMAR SINHA 94 53 Good
43 ASHISH RANJAN SHAILENDRA KUMAR 67 37 Poor
44 SHIVAM KUMAR RAVI RANJAN PRASAD 0 0 Very Poor
45 ISHA MEHTA BHAGWAT PRASAD 39 22 Very Poor
46 ABHINAV GUPTA SURAJ SEN GUPTA 11 6 Very Poor
47 ZAINUL ABEDIN ALI MD SHAUKAT SIRAT 52 29 Very Poor
48 ADITYA KUMAR LATE ANIL PRASAD 12 7 Very Poor
49 ASHISH RANJAN MITLESH CHAUHAN 0 0 Very Poor
50 ALOK KUMAR NAVIN KUMAR 3 2 Very Poor
51 VIDYA SUMAN KUMARI RAVI SHANKAR KUMAR 59 33 Poor
52 PAMMI JOSHI UMESH PRASAD 15 8 Very Poor
53 KHUSHIYAN KUMARI SUDHIR KUMAR 0 0 Very Poor
54 PRIYADARSHAN KUMAR BIRENDRA PRASAD 8 4 Very Poor
55 SACHIN KUMAR LALAN PASWAN 7 4 Very Poor
56 KARINA KUMARI UMESH PRASAD 70 39 Poor
57 DIVYA KUMARI RAVINDRA KUMAR 71 40 Poor
58 PUSHPANJAY SINHA AJIT KUMAR SINGH 15 8 Very Poor
59 MAHLAQA SANA MD. SANAULLAH 75 42 Poor
60 SNEHA KUMARI UMA PRASAD 20 11 Very Poor
61 SUMAN KUMAR LAL MUNI PRASAD 2 1 Very Poor
62 SONU KUMAR VIRESH PRASAD 0 0 Very Poor
63 KOMAL KUMARI RAKESH KUMAR SHAW 4 2 Very Poor
64 PRASHANT KUMAR RAMESH KUMAR 9 5 Very Poor
65 SNAYA SAVANT DHIRENDRA PASWAN 0 0 Very Poor
66 MUSKAN KUMARI ARUN KUMAR 9 5 Very Poor
67 KUNDAN RAJ SHRAVAN CHAUHAN 49 27 Very Poor
68 ANKIT KUMAR ARJUN PRASAD SAW 0 0 Very Poor
69 PAYAL KUMARI MANOJ KUMAR 13 7 Very Poor
70 ADITYA KUMAR SHIV SHANKAR LAL 0 0 Very Poor
71 ANKUSH KUMAR RAKESH KUMAR 0 0 Very Poor
72 ROHIT RANJAN MANOJ CHOUHAN 0 0 Very Poor
73 RISHAV KUMAR MANOJ YADAV 0 0 Very Poor
74 TANAV KUMAR GAUTAM RANDHIR KUMAR GAUTAM 0 0 Very Poor
75 PRASHANT RAJ DAMODAR KUMAR 0 0 Very Poor
76 RAHUL KUMAR RAVINDRA PRASAD 0 0 Very Poor
77 SAKSHI KUMARI SANJAY KUMAR 12 7 Very Poor
78 SANDEEP KUMAR SANJAY KUMAR 8 4 Very Poor
79 STUTI KUMARI SUDHIR KUMAR 80 45 Poor
80 PRIYANKA KUMARI VIJAY KUMAR BASFOR 16 9 Very Poor
81 AKRITI VERMA RAVINDRA PRASAD 57 32 Poor
82 SALONI RAJ SHYAMSUNDAR PRASAD 7 4 Very Poor
83 SHIVANI KUMARI MUKESH KUMAR 0 0 Very Poor
84 SAMIR KUMAR RANJAN PASWAN 23 13 Very Poor
85 ANKIT KUMAR SUDHIR PASWAN 1 1 Very Poor
86 PUSHPANJALI KUMARI SANJIV KUMAR SINHA 0 0 Very Poor
87 NILESH KUMAR NAND KISHOR PRASAD GUPTA 68 38 Poor
88 RAJU KUMAR VINAY RAM 0 0 Very Poor
89 GAUTAM KUMAR AJAY KUMAR 102 57 Good
90 GOPAL KUMAR MANOJ KUMAR 66 37 Poor
91 MD AMAN FAISAL MD SHAHEEN AKHTAR 5 3 Very Poor
92 SHIV SHANKAR PRASAD ALAKHDEV PRASAD 47 26 Very Poor
93 AMAN RAJ SRIKANT YADAV 8 4 Very Poor
94 ASHWANI KUMAR BABLU KUMAR 17 9 Very Poor
95 RISHU RAJ VIDYA SHANKAR 0 0 Very Poor
96 ZEESHAN MD SULEMAN 12 7 Very Poor
97 MOHIT KUMAR RANJIT KUMAR 2 1 Very Poor
98 ALOK KUMAR SANJAY KUMAR 3 2 Very Poor
99 MAYANK KORACHH MANOJ KUMAR 30 17 Very Poor
100 RISHAV RAJ RAJ KUMAR PRASAD 20 11 Very Poor
101 RAHUL KUMAR SANJAY KUMAR 10 6 Very Poor
102 AKASH KUMAR MUNNA SAW 169 94 Excellent
103 PUSHPANJAY PATEL SANJAY KUMAR SINHA 25 14 Very Poor
104 AKASHDEEP KUMAR MUKESH KUMAR 2 1 Very Poor
105 SAHIL RAJ SANTOSH KUMAR GOSWAMI 39 22 Very Poor
106 ANKIT KUMAR MANOJ KUMAR SINHA 3 2 Very Poor
107 SHUBHAM RAJ SANTOSH KUMAR GOSWAMI 21 12 Very Poor
108 SINTU KUMAR BABAN SINGH 0 0 Very Poor
109 AMAN KUMAR RANJEET SAW 1 1 Very Poor
110 SHIVAM KUMAR ASHUTOSH KUMAR 0 0 Very Poor
111 SAURAV KUMAR SANJAY KUMAR 74 41 Poor
112 SHUBHAM RAJ MITHLESH PRASAD 2 1 Very Poor
113 PRAVEEN KUMAR ASHOK KUMAR 0 0 Very Poor
114 ABNISH KUMAR SHYAM KISHORE PRASAD 11 6 Very Poor
115 SUBHAM KUMAR SHAILENDRA KUMAR 46 26 Very Poor
116 DIPESH PATEL YUGESHWAR PRASAD 0 0 Very Poor
117 RAUNAK RAJ SHRAVAN PRASAD GUPTA 8 4 Very Poor
118 ANKIT RAJ SANJAY KUMAR 0 0 Very Poor
119 NIRAJ KUMAR ASHOK KUMAR 27 15 Very Poor
120 SUBODH KUMAR BHOLA PRASAD 1 1 Very Poor`;

const parseBca3Line = (line) => {
  const parts = line.split(" ");
  const rollNo = parts[0];
  let ptr = parts.length - 1;
  if (parts[ptr] === "Poor") {
    if (parts[ptr - 1] === "Very") ptr -= 2;
    else ptr -= 1;
  } else if (parts[ptr] === "Good" || parts[ptr] === "Excellent") {
    if (parts[ptr - 1] === "Very") ptr -= 2;
    else ptr -= 1;
  }
  const percent = parseInt(parts[ptr]) || 0;
  ptr--;
  const attended = parseInt(parts[ptr]) || 0;
  ptr--;
  const nameParts = parts.slice(1, ptr + 1);
  const mid = Math.ceil(nameParts.length / 2);
  const name = nameParts.slice(0, mid).join(" ");
  const father = nameParts.slice(mid).join(" ");
  return { rollNo: String(rollNo).padStart(3, "0"), name, father, attended, percent };
};

async function main() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  console.log("Connected successfully!");

  const bcaDept = await Department.findOne({ code: "BCA" });
  const bca1 = await Class.findOne({ code: "BCA-I" });
  const bca2 = await Class.findOne({ code: "BCA-II" });
  const bca3 = await Class.findOne({ code: "BCA-III" });

  const s2425 = await AcademicSession.findOne({ name: "2024-25" });
  const s2526 = await AcademicSession.findOne({ name: "2025-26" });
  const s2627 = await AcademicSession.findOne({ name: "2026-27" });

  const validSubject = await Subject.findOne();
  const validTeacher = await Teacher.findOne();

  console.log("Cleaning up all student records & enrollments for a 100% fresh, clean state...");
  await Attendance.deleteMany({});
  await Enrollment.deleteMany({});
  await Student.deleteMany({});
  await User.deleteMany({ role: "student" });

  const hashedPassword = await bcrypt.hash("Student@123", 10);

  // -------------------------------------------------------------------------
  // 1. POPULATE BCA-III (120 Students: Murlidhar Yadav, Md Huzaifa, etc.)
  // -------------------------------------------------------------------------
  console.log("\nPopulating BCA-III (120 Students)...");
  const bca3Lines = bca3RawData.split("\n").map(l => l.trim()).filter(Boolean);
  const bca3StudentDocs = [];
  const bca3Enrollments = [];

  for (const line of bca3Lines) {
    const { rollNo, name, father } = parseBca3Line(line);
    const email = `bca3.${rollNo}@nalanda.edu`;
    const studentRoll = `BCA-III-${rollNo}`;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      isActive: true,
    });

    const student = await Student.create({
      user: user._id,
      rollNo: studentRoll,
      fatherName: father || "N/A",
      department: bcaDept._id,
      class: bca3._id,
      admissionYear: 2024,
      duration: "2024-27",
      batch: "2024-27",
      phone: "9876543210",
      status: "active",
    });

    bca3StudentDocs.push(student);

    // Current 2026-27 Enrollment (BCA-III)
    bca3Enrollments.push({
      student: student._id,
      academicSession: s2627._id,
      department: bcaDept._id,
      class: bca3._id,
      rollNo: studentRoll,
      year: 3,
      status: "active",
    });

    // Past 2025-26 Enrollment (BCA-II)
    if (s2526) {
      bca3Enrollments.push({
        student: student._id,
        academicSession: s2526._id,
        department: bcaDept._id,
        class: bca2._id,
        rollNo: `BCA-II-${rollNo}`,
        year: 2,
        status: "completed",
      });
    }

    // Past 2024-25 Enrollment (BCA-I)
    if (s2425) {
      bca3Enrollments.push({
        student: student._id,
        academicSession: s2425._id,
        department: bcaDept._id,
        class: bca1._id,
        rollNo: `BCA-I-${rollNo}`,
        year: 1,
        status: "completed",
      });
    }
  }

  await Enrollment.insertMany(bca3Enrollments);
  console.log(`✅ BCA-III: Created 120 Students & ${bca3Enrollments.length} Enrollments!`);

  // -------------------------------------------------------------------------
  // 2. POPULATE BCA-II (Exact 100 Students from PDF: Rahul Kumar to Lakshman Kumar)
  // -------------------------------------------------------------------------
  console.log("\nPopulating BCA-II (Exact 100 Students from PDF)...");
  const bca2StudentDocs = [];
  const bca2Enrollments = [];

  for (const item of bca2PdfStudents) {
    const padRoll = String(item.roll).padStart(3, "0");
    const email = `bca2.${padRoll}@nalanda.edu`;
    const studentRoll = `BCA-II-${padRoll}`;

    const user = await User.create({
      name: item.name,
      email,
      password: hashedPassword,
      role: "student",
      isActive: true,
    });

    const student = await Student.create({
      user: user._id,
      rollNo: studentRoll,
      fatherName: item.father || "N/A",
      department: bcaDept._id,
      class: bca2._id,
      admissionYear: 2025,
      duration: "2025-28",
      batch: "2025-28",
      phone: "9876543210",
      status: "active",
    });

    bca2StudentDocs.push(student);

    // Current 2026-27 Enrollment (BCA-II)
    bca2Enrollments.push({
      student: student._id,
      academicSession: s2627._id,
      department: bcaDept._id,
      class: bca2._id,
      rollNo: studentRoll,
      year: 2,
      status: "active",
    });

    // Past 2025-26 Enrollment (BCA-I)
    if (s2526) {
      bca2Enrollments.push({
        student: student._id,
        academicSession: s2526._id,
        department: bcaDept._id,
        class: bca1._id,
        rollNo: `BCA-I-${padRoll}`,
        year: 1,
        status: "completed",
      });
    }
  }

  await Enrollment.insertMany(bca2Enrollments);
  console.log(`✅ BCA-II: Created 100 Students & ${bca2Enrollments.length} Enrollments!`);

  // -------------------------------------------------------------------------
  // 3. GENERATE REALISTIC ATTENDANCE RECORDS FOR BCA-II & BCA-III IN 2026-27
  // -------------------------------------------------------------------------
  console.log("\nGenerating Attendance Records for 2026-27...");
  const dates = [];
  const start = new Date("2026-07-02T10:00:00Z");
  for (let i = 0; i < 25; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + (i * 2) + (i % 2 === 0 ? 1 : 0));
    dates.push(d);
  }

  const attendanceBatch = [];

  // BCA-II Attendance (based on their exact PDF %)
  for (let i = 0; i < bca2StudentDocs.length; i++) {
    const student = bca2StudentDocs[i];
    const pdfData = bca2PdfStudents[i];
    const presentRate = (pdfData.percent || 10) / 100;

    for (const d of dates) {
      const isPresent = Math.random() < presentRate;
      attendanceBatch.push({
        student: student._id,
        class: bca2._id,
        academicSession: s2627._id,
        subject: validSubject._id,
        teacher: validTeacher._id,
        date: d,
        status: isPresent ? "present" : "absent",
      });
    }
  }

  // BCA-III Attendance (~85% attendance rate)
  for (let i = 0; i < bca3StudentDocs.length; i++) {
    const student = bca3StudentDocs[i];
    for (const d of dates) {
      const isPresent = Math.random() < 0.85;
      attendanceBatch.push({
        student: student._id,
        class: bca3._id,
        academicSession: s2627._id,
        subject: validSubject._id,
        teacher: validTeacher._id,
        date: d,
        status: isPresent ? "present" : "absent",
      });
    }
  }

  console.log(`Inserting ${attendanceBatch.length} attendance records in chunks...`);
  const chunkSize = 1000;
  for (let i = 0; i < attendanceBatch.length; i += chunkSize) {
    await Attendance.insertMany(attendanceBatch.slice(i, i + chunkSize));
  }
  console.log("✅ Attendance records created successfully!");

  // -------------------------------------------------------------------------
  // 4. VERIFICATION
  // -------------------------------------------------------------------------
  const finalBca2 = await Enrollment.countDocuments({ class: bca2._id, academicSession: s2627._id });
  const finalBca3 = await Enrollment.countDocuments({ class: bca3._id, academicSession: s2627._id });
  const totalStudents = await Student.countDocuments();
  const totalAttendance = await Attendance.countDocuments({ academicSession: s2627._id });

  console.log("\n==================== VERIFICATION SUMMARY ====================");
  console.log(`2026-27 BCA-II Students: ${finalBca2} (Exact PDF: Rahul Kumar to Lakshman Kumar)`);
  console.log(`2026-27 BCA-III Students: ${finalBca3} (Exact 120: Murlidhar Yadav, Md Huzaifa, etc.)`);
  console.log(`Total Students: ${totalStudents}`);
  console.log(`Total 2026-27 Attendance Records: ${totalAttendance}`);

  const sampleBca2_1 = await Student.findOne({ rollNo: "BCA-II-001" }).populate("user");
  console.log(`Sample BCA-II Roll 1: ${sampleBca2_1?.rollNo} | ${sampleBca2_1?.user?.name} | Father: ${sampleBca2_1?.fatherName}`);

  const sampleBca2_100 = await Student.findOne({ rollNo: "BCA-II-100" }).populate("user");
  console.log(`Sample BCA-II Roll 100: ${sampleBca2_100?.rollNo} | ${sampleBca2_100?.user?.name} | Father: ${sampleBca2_100?.fatherName}`);

  const sampleBca3_1 = await Student.findOne({ rollNo: "BCA-III-001" }).populate("user");
  console.log(`Sample BCA-III Roll 1: ${sampleBca3_1?.rollNo} | ${sampleBca3_1?.user?.name} | Father: ${sampleBca3_1?.fatherName}`);

  const sampleBca3_14 = await Student.findOne({ rollNo: "BCA-III-014" }).populate("user");
  console.log(`Sample BCA-III Roll 14: ${sampleBca3_14?.rollNo} | ${sampleBca3_14?.user?.name} | Father: ${sampleBca3_14?.fatherName}`);

  process.exit(0);
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
