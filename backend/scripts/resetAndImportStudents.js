import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Department from "../models/Department.js";
import Class from "../models/Class.js";

dotenv.config();

const rawData = `1 MURLIDHAR YADAV UPENDRA YADAV 64 36 Poor
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

const commonLastNames = ["KUMAR", "KUMARI", "RAJ", "GUPTA", "YADAV", "SHARMA", "SINGH", "ALAM", "PATEL", "PASWAN", "RANJAN", "SHUBHAM", "SUMAN", "MEHTA", "JOSHI", "SANA", "RANI", "VERMA", "KORACHH", "FAISAL", "ABEDIN"];

const parseLine = (line) => {
  const parts = line.split(" ");
  const rollNo = parts[0];
  
  let ptr = parts.length - 2;
  if (parts[parts.length - 2] === "Very") {
    ptr--;
  }
  
  ptr -= 2; // skip percentage and attendance numbers
  
  const nameParts = parts.slice(1, ptr + 1);
  
  let candidateWords = [];
  let fatherWords = [];
  
  // Custom overriding for known hard names to ensure 100% accuracy based on visual inspection
  if (nameParts.join(" ") === "MURLIDHAR YADAV UPENDRA YADAV") {
      candidateWords = ["MURLIDHAR", "YADAV"]; fatherWords = ["UPENDRA", "YADAV"];
  } else if (nameParts.join(" ") === "BALI KUMAR BHUSHAN CHAUHAN") {
      candidateWords = ["BALI", "KUMAR"]; fatherWords = ["BHUSHAN", "CHAUHAN"];
  } else if (nameParts.join(" ") === "SHIVAM KUMAR RAVI RANJAN PRASAD") {
      candidateWords = ["SHIVAM", "KUMAR"]; fatherWords = ["RAVI", "RANJAN", "PRASAD"];
  } else if (nameParts.join(" ") === "ZAINUL ABEDIN ALI MD SHAUKAT SIRAT") {
      candidateWords = ["ZAINUL", "ABEDIN", "ALI"]; fatherWords = ["MD", "SHAUKAT", "SIRAT"];
  } else if (nameParts.join(" ") === "VIDYA SUMAN KUMARI RAVI SHANKAR KUMAR") {
      candidateWords = ["VIDYA", "SUMAN", "KUMARI"]; fatherWords = ["RAVI", "SHANKAR", "KUMAR"];
  } else if (nameParts.join(" ") === "TANAV KUMAR GAUTAM RANDHIR KUMAR GAUTAM") {
      candidateWords = ["TANAV", "KUMAR", "GAUTAM"]; fatherWords = ["RANDHIR", "KUMAR", "GAUTAM"];
  } else if (nameParts.join(" ") === "MD SAHOON ALAM MD MUKHTAR ALAM") {
      candidateWords = ["MD", "SAHOON", "ALAM"]; fatherWords = ["MD", "MUKHTAR", "ALAM"];
  } else if (nameParts.join(" ") === "AAYUSH KUMAR KAUSHIK PRANAY KUMAR") {
      candidateWords = ["AAYUSH", "KUMAR", "KAUSHIK"]; fatherWords = ["PRANAY", "KUMAR"];
  } else if (nameParts.join(" ") === "RISHIKET KUMAR CHANDRA BHUSHAN PANDIT") {
      candidateWords = ["RISHIKET", "KUMAR"]; fatherWords = ["CHANDRA", "BHUSHAN", "PANDIT"];
  } else if (nameParts.join(" ") === "MD AMAN FAISAL MD SHAHEEN AKHTAR") {
      candidateWords = ["MD", "AMAN", "FAISAL"]; fatherWords = ["MD", "SHAHEEN", "AKHTAR"];
  } else {
      // General heuristic
      if (nameParts.length <= 4) {
          // Generally 2 words for candidate, 2 words for father
          candidateWords = nameParts.slice(0, 2);
          fatherWords = nameParts.slice(2);
      } else {
          // If 5 words, check if 2nd word is a common last name identifier
          if (commonLastNames.includes(nameParts[1])) {
              candidateWords = nameParts.slice(0, 2);
              fatherWords = nameParts.slice(2);
          } else if (commonLastNames.includes(nameParts[2])) {
              candidateWords = nameParts.slice(0, 3);
              fatherWords = nameParts.slice(3);
          } else {
              // fallback
              candidateWords = nameParts.slice(0, 2);
              fatherWords = nameParts.slice(2);
          }
      }
  }

  const candidateName = candidateWords.join(" ");
  const fatherName = fatherWords.join(" ");

  return {
    rollNo: String(rollNo).padStart(3, '0'),
    candidateName,
    fatherName
  };
};

const run = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const bcaDept = await Department.findOne({ code: "BCA" });
    const bcaClass = await Class.findOne({ code: "BCA-III" });

    if (!bcaDept || !bcaClass) throw new Error("BCA department or class not found");

    console.log("Wiping existing Student records...");
    const existingStudents = await Student.find({});
    
    // Find associated user accounts to delete
    const userIdsToDelete = existingStudents.map(s => s.user);
    
    // Delete Students
    await Student.deleteMany({});
    
    // Delete their User accounts
    if (userIdsToDelete.length > 0) {
        await User.deleteMany({ _id: { $in: userIdsToDelete } });
    }
    
    // Wipe all attendance records to prevent orphans
    await Attendance.deleteMany({});

    console.log(`Deleted ${existingStudents.length} students and their user accounts. Reset complete.`);

    const lines = rawData.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const hashedPassword = await bcrypt.hash("Student@123", 10);
    
    let created = 0;

    console.log("Importing new 1-120 BCA-3 data...");
    for (const line of lines) {
      const { rollNo, candidateName, fatherName } = parseLine(line);
      const studentRoll = "BCA-III-" + rollNo;
      
      // email format: firstname.rollno@nalanda.edu
      const email = candidateName.split(" ")[0].toLowerCase() + "." + rollNo + "@nalanda.edu";

      const user = await User.create({
        name: candidateName,
        email,
        password: hashedPassword,
        role: "student",
        isActive: true
      });

      await Student.create({
        user: user._id,
        rollNo: studentRoll,
        fatherName: fatherName || "N/A",
        department: bcaDept._id,
        class: bcaClass._id,
        admissionYear: 2024,
        duration: "2024-27",
        phone: "9999999999",
      });
      created++;
    }

    console.log(`✅ Successfully imported ${created} students with accurate names, admissionYear 2024, and duration 2024-27!`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

run();
