import mongoose from "mongoose";
import dotenv from "dotenv";
import Subject from "./models/Subject.js";
import Teacher from "./models/Teacher.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const subjects = await Subject.find().populate({
    path: "teacher",
    populate: { path: "user" }
  }).lean();
  
  console.log(JSON.stringify(subjects, null, 2));
  process.exit(0);
};

run();
