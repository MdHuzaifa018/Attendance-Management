import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Department from "../models/Department.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";

dotenv.config();

const run = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    const email = "teacher@nalanda.edu";
    const user = await User.findOne({ email });
    if (!user) throw new Error("Teacher user not found. Please run seedAdmin.js first.");

    const bcaDept = await Department.findOne({ code: "BCA" });
    const mcaDept = await Department.findOne({ code: "MCA" });
    if (!bcaDept || !mcaDept) throw new Error("Departments not found. Run seedData.js first.");

    let teacher = await Teacher.findOne({ user: user._id });
    if (!teacher) {
      teacher = await Teacher.create({
        user: user._id,
        employeeId: "DEMO-TCH",
        departments: [bcaDept._id, mcaDept._id],
        phone: "1234567890",
        designation: "Head of IT",
        isActive: true,
      });
      console.log("✅ Created Teacher profile for demo user with multiple departments.");
    } else {
      teacher.departments = [bcaDept._id, mcaDept._id];
      await teacher.save();
      console.log("✅ Updated Teacher profile with multiple departments.");
    }

    const bcaClass = await Class.findOne({ code: "BCA-III" });
    const mcaClass = await Class.findOne({ code: "MCA-I" });

    if (bcaClass) {
      await Subject.findOneAndUpdate(
        { code: "BCA-301", class: bcaClass._id },
        { name: "Web Technologies", teacher: teacher._id, totalClasses: 0, isActive: true },
        { upsert: true }
      );
      console.log("✅ Assigned BCA Web Technologies to demo teacher.");
    }

    if (mcaClass) {
      await Subject.findOneAndUpdate(
        { code: "MCA-102", class: mcaClass._id },
        { name: "Advanced Databases", teacher: teacher._id, totalClasses: 0, isActive: true },
        { upsert: true }
      );
      console.log("✅ Assigned MCA Advanced Databases to demo teacher.");
    }

    console.log("Success!");
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
