import mongoose from "mongoose";
import dotenv from "dotenv";
import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";

dotenv.config();

const run = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const subjects = await Subject.find({});
    console.log(`Found ${subjects.length} subjects. Recalculating...`);

    let updated = 0;
    for (const subj of subjects) {
      // Find all unique (date, session) pairs for totalClasses
      const sessions = await Attendance.aggregate([
        { $match: { subject: subj._id } },
        { $group: { _id: { date: "$date", session: "$session" } } }
      ]);
      const totalClasses = sessions.length;

      // Find all unique dates for totalDays
      const days = await Attendance.aggregate([
        { $match: { subject: subj._id } },
        { $group: { _id: "$date" } }
      ]);
      const totalDays = days.length;

      await Subject.findByIdAndUpdate(subj._id, { totalClasses, totalDays });
      console.log(`Subject ${subj.code}: ${totalClasses} sessions, ${totalDays} days`);
      updated++;
    }

    console.log(`\nSuccessfully updated ${updated} subjects.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
};

run();
