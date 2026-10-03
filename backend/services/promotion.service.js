import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import PromotionHistory from "../models/PromotionHistory.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import AcademicSession from "../models/AcademicSession.js";
import Program from "../models/Program.js";

/**
 * Generate a preview of what happens if we promote students from a specific class.
 */
export const getPromotionPreview = async ({ currentSessionId, targetSessionId, fromClassId }) => {
  const currentSession = await AcademicSession.findById(currentSessionId);
  const targetSession = await AcademicSession.findById(targetSessionId);
  const fromClass = await Class.findById(fromClassId).populate("program");

  if (!currentSession || !targetSession || !fromClass) {
    throw new Error("Invalid session or class ID provided.");
  }

  // Find all active enrollments in the current class
  const enrollments = await Enrollment.find({
    academicSession: currentSessionId,
    class: fromClassId,
    status: { $in: ["active", "year_repeat"] },
  })
    .populate({
      path: "student",
      populate: { path: "user", select: "name email" }
    })
    .lean();

  // Sort by roll number
  enrollments.sort((a, b) => (a.rollNo || "").localeCompare(b.rollNo || "", undefined, { numeric: true }));

  // Guess next class logic (e.g. BCA-1 -> BCA-2)
  // Simple heuristic: find a class in target session with same program/dept and next semester
  const nextSemester = fromClass.semester + 2; // Usually promoted yearly (e.g. sem 1->3 or 2->4)
  const targetClassOptions = await Class.find({
    academicSession: targetSessionId,
    department: fromClass.department,
    program: fromClass.program?._id,
  });

  const exactNextClass = targetClassOptions.find(c => c.semester === nextSemester && c.section === fromClass.section);

  const isFinalYear = fromClass.semester >= (fromClass.program?.totalSemesters || 6) - 1;

  const preview = enrollments.map(enr => {
    let proposedAction = "promoted";
    let proposedClassId = exactNextClass ? exactNextClass._id : null;
    
    if (isFinalYear) {
      proposedAction = "graduated";
      proposedClassId = null;
    }

    return {
      enrollmentId: enr._id,
      studentId: enr.student._id,
      name: enr.student.name || enr.student.user?.name, // Depends if name is populated
      rollNo: enr.rollNo,
      currentYear: enr.year,
      currentClassId: fromClassId,
      proposedAction,
      proposedClassId,
      proposedYear: proposedAction === "promoted" ? enr.year + 1 : (proposedAction === "year_repeat" ? enr.year : null),
    };
  });

  return {
    currentSession,
    targetSession,
    fromClass,
    preview,
    availableTargetClasses: targetClassOptions,
  };
};

/**
 * Execute bulk promotion/graduation using a transaction.
 */
export const executePromotion = async ({
  currentSessionId,
  targetSessionId,
  promotions,
  performedBy,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const results = [];

    for (const promo of promotions) {
      const { enrollmentId, proposedAction: action, proposedClassId, remarks } = promo;
      
      const currentEnrollment = await Enrollment.findById(enrollmentId).session(session);
      if (!currentEnrollment) continue;

      if (currentEnrollment.status === "completed" || currentEnrollment.status === "graduated") {
        continue; // Already processed
      }

      let newEnrollment = null;
      let targetClass = null;

      // 1. Handle Promotion or Year Repeat
      if (action === "promoted" || action === "year_repeat") {
        if (!proposedClassId) throw new Error(`Proposed class required for action: ${action}`);
        
        targetClass = await Class.findById(proposedClassId).session(session);
        if (!targetClass) throw new Error("Target class not found");

        const nextYear = action === "promoted" ? currentEnrollment.year + 1 : currentEnrollment.year;

        // Check if already enrolled in target session
        const existing = await Enrollment.findOne({
          student: currentEnrollment.student,
          academicSession: targetSessionId,
        }).session(session);

        if (existing) {
          throw new Error(`Student ${currentEnrollment.rollNo} is already enrolled in the target session.`);
        }

        newEnrollment = new Enrollment({
          student: currentEnrollment.student,
          academicSession: targetSessionId,
          program: currentEnrollment.program,
          department: currentEnrollment.department,
          class: targetClass._id,
          year: nextYear,
          semester: targetClass.semester,
          section: targetClass.section,
          rollNo: currentEnrollment.rollNo,
          status: "active",
          promotedFrom: currentEnrollment._id,
          remarks: remarks || `Auto ${action}`,
        });

        await newEnrollment.save({ session });
        
        // Update old enrollment status
        currentEnrollment.status = action === "promoted" ? "completed" : "year_repeat";
        await currentEnrollment.save({ session });
      } 
      // 2. Handle Graduation
      else if (action === "graduated") {
        currentEnrollment.status = "graduated";
        await currentEnrollment.save({ session });

        // Mark student as graduated
        await Student.findByIdAndUpdate(currentEnrollment.student, { status: "graduated" }, { session });
      }
      // 3. Handle Dropped / Transferred
      else if (action === "transferred" || action === "dropped") {
        currentEnrollment.status = action;
        await currentEnrollment.save({ session });

        await Student.findByIdAndUpdate(currentEnrollment.student, { status: action }, { session });
      }

      // Create Promotion History
      const history = new PromotionHistory({
        student: currentEnrollment.student,
        fromEnrollment: currentEnrollment._id,
        toEnrollment: newEnrollment ? newEnrollment._id : null,
        fromAcademicSession: currentSessionId,
        toAcademicSession: targetSessionId,
        fromYear: currentEnrollment.year,
        toYear: newEnrollment ? newEnrollment.year : null,
        action,
        performedBy,
        remarks: remarks || "",
      });

      await history.save({ session });
      results.push({ studentId: currentEnrollment.student, action });
    }

    await session.commitTransaction();
    session.endSession();

    return { success: true, processed: results.length, details: results };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
