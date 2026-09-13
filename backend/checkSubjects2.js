import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Teacher from "./models/Teacher.js";
import Subject from "./models/Subject.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const subjects = await Subject.find().populate({
    path: "teacher",
    populate: { path: "user" }
  }).lean();
  
  console.log(JSON.stringify(subjects.map(s => ({
    subj: s.name,
    teacherId: s.teacher?._id,
    teacherUser: s.teacher?.user?._id || s.teacher?.user,
  })), null, 2));

  const teacher = await Teacher.findOne({ employeeId: "DEMO-TCH" }).lean();
  console.log("Demo Teacher ID:", teacher?._id);
  console.log("Demo Teacher User ID:", teacher?.user);

  process.exit(0);
};

run();
