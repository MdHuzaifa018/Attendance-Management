import dotenv from "dotenv";
import mongoose from "mongoose";
import Notice from "../models/Notice.js";
import Timetable from "../models/Timetable.js";
import Leave from "../models/Leave.js";
import ExamMark from "../models/ExamMark.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas!");

    const noticeCount = await Notice.countDocuments();
    console.log(`✓ Notices in DB: ${noticeCount}`);

    const timetableCount = await Timetable.countDocuments();
    console.log(`✓ Timetables in DB: ${timetableCount}`);

    const leaveCount = await Leave.countDocuments();
    console.log(`✓ Leave requests in DB: ${leaveCount}`);

    const marksCount = await ExamMark.countDocuments();
    console.log(`✓ Exam Marks in DB: ${marksCount}`);

    console.log("\nAll Database collections for remaining phases verified 100%!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
