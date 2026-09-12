import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Department from "../models/Department.js";
import Subject from "../models/Subject.js";

dotenv.config();

const link = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const bca = await Department.findOne({ code: "BCA" });
    const u = await User.findOne({ email: "teacher@nalanda.edu" });
    if (!u) {
      console.log("User teacher@nalanda.edu not found");
      return;
    }

    let t = await Teacher.findOne({ user: u._id });
    if (!t) {
      t = await Teacher.create({
        user: u._id,
        employeeId: "TCH-DEMO-001",
        department: bca._id,
        designation: "Assistant Professor & Lab Incharge",
        phone: "9876543299",
        isActive: true,
      });
      console.log("Created Teacher record for demo teacher:", t._id);
    }

    // Assign BCA-301 and BCA-302 to demo teacher
    await Subject.updateMany(
      { code: { $in: ["BCA-301", "BCA-302"] } },
      { teacher: t._id }
    );
    console.log("Assigned BCA-301 and BCA-302 to demo teacher successfully!");
  } catch (err) {
    console.error("Link error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

link();
