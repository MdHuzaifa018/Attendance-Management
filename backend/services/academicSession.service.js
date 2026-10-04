import AcademicSession from "../models/AcademicSession.js";
import Class from "../models/Class.js";

export const getSessions = async () => {
  return await AcademicSession.find().sort({ startYear: -1 }).lean();
};

export const createSession = async (data) => {
  // 1. Find the latest session to clone classes from
  const previousSession = await AcademicSession.findOne().sort({ startYear: -1 }).lean();

  // 2. Create the new session
  const newSession = await AcademicSession.create(data);

  // 3. Clone classes from previous session (if exists)
  if (previousSession) {
    const oldClasses = await Class.find({ academicSession: previousSession._id, isActive: true }).lean();
    
    if (oldClasses.length > 0) {
      const clonedClasses = oldClasses.map(c => ({
        name: c.name,
        code: c.code,
        department: c.department,
        semester: c.semester,
        section: c.section,
        program: c.program,
        academicYear: newSession.name, // e.g. "2026-27"
        academicSession: newSession._id,
        isActive: true,
      }));

      // Use insertMany to bypass some unique code constraints if we suffix them? 
      // Wait, class code is unique globally! (unique: true in schema).
      // If we clone "BCA-3", the code "BCA3" will throw a duplicate key error!
      // We must append the session name to the class code to make it unique across years.
      clonedClasses.forEach(c => {
        c.code = `${c.code}-${newSession.startYear.toString().slice(-2)}`; 
      });

      try {
        await Class.insertMany(clonedClasses);
      } catch (err) {
        console.error("Failed to clone classes, might be duplicate code issue:", err.message);
      }
    }
  }

  return newSession;
};

export const updateSession = async (id, data) => {
  const session = await AcademicSession.findById(id);
  if (!session) throw new Error("Session not found");

  Object.assign(session, data);
  await session.save();
  return session;
};

export const deleteSession = async (id) => {
  const session = await AcademicSession.findById(id);
  if (!session) throw new Error("Session not found");

  if (session.isCurrent) {
    throw new Error("Cannot delete the currently active session. Activate another session first.");
  }

  const mongoose = (await import("mongoose")).default;

  // Check for existing enrollments
  const enrollmentsCount = await mongoose.model("Enrollment").countDocuments({ academicSession: id });
  if (enrollmentsCount > 0) {
    throw new Error(`Cannot delete: ${enrollmentsCount} student enrollments exist in this session.`);
  }

  // Check for existing attendance
  const attendanceCount = await mongoose.model("Attendance").countDocuments({ academicSession: id });
  if (attendanceCount > 0) {
    throw new Error(`Cannot delete: ${attendanceCount} attendance records exist in this session.`);
  }

  // Delete all classes tied to this session
  await mongoose.model("Class").deleteMany({ academicSession: id });
  
  await AcademicSession.findByIdAndDelete(id);
  return { success: true };
};

export const getActiveSession = async () => {
  return await AcademicSession.findOne({ isCurrent: true }).lean();
};
