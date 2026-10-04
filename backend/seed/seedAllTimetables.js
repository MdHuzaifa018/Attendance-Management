import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Timetable from "../models/Timetable.js";
import AcademicSession from "../models/AcademicSession.js";

async function populateAllTimetables() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const currentSession = await AcademicSession.findOne({ isCurrent: true });
  const classes = await Class.find({ academicSession: currentSession._id });
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (const cls of classes) {
    const subjects = await Subject.find({ class: cls._id });
    if (subjects.length === 0) continue;

    console.log(`Setting timetable for ${cls.name} (${cls.code}) with ${subjects.length} subjects`);

    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
      const day = days[dayIdx];
      const periods = [];

      for (let p = 1; p <= 4; p++) {
        const sub = subjects[(dayIdx + p - 1) % subjects.length];
        const times = [
          { start: "09:00 AM", end: "10:00 AM" },
          { start: "10:00 AM", end: "11:00 AM" },
          { start: "11:30 AM", end: "12:30 PM" },
          { start: "12:30 PM", end: "01:30 PM" },
        ];
        periods.push({
          periodNumber: p,
          startTime: times[p - 1].start,
          endTime: times[p - 1].end,
          subject: sub._id,
          teacher: sub.teacher,
          roomNo: "Room " + (100 + cls.semester),
        });
      }

      await Timetable.findOneAndUpdate(
        { class: cls._id, dayOfWeek: day },
        { class: cls._id, dayOfWeek: day, periods },
        { upsert: true }
      );
    }
  }

  console.log("All class timetables populated!");
  await mongoose.disconnect();
}

populateAllTimetables().catch(console.error);
