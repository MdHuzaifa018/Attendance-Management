import mongoose from 'mongoose';
import AcademicSession from './models/AcademicSession.js';
import Enrollment from './models/Enrollment.js';
import Class from './models/Class.js';

mongoose.connect('mongodb+srv://mdhuzaifsh786_db_user:P6UEAKp9ByK4DOj0@attendance-management.rcryqdu.mongodb.net/AttendanceSystem').then(async () => {
  // 1. Get the 2024-25 and 2026-27 sessions
  const s2024 = await AcademicSession.findOne({ name: '2024-25' });
  const s2026 = await AcademicSession.findOne({ name: '2026-27' });

  if (!s2026) {
    console.log("2026-27 session not found!");
    return process.exit(1);
  }

  // 2. Make 2026-27 the ONLY active session
  await AcademicSession.updateMany({}, { $set: { isCurrent: false } });
  await AcademicSession.updateOne({ _id: s2026._id }, { $set: { isCurrent: true } });
  console.log("Set 2026-27 as the active current session.");

  // 3. Find BCA-3 class in 2026-27
  // Note: We cloned classes previously. The code for BCA-3 in 2026-27 is 'BCA-III-26-5' or similar.
  // Wait, let's just find by name and session
  const bca3_2026 = await Class.findOne({ name: 'BCA Third Year', academicSession: s2026._id });
  const bca3_2024 = await Class.findOne({ name: 'BCA Third Year', academicSession: s2024._id });

  if (!bca3_2026 || !bca3_2024) {
    console.log("BCA-3 classes not found!");
    return process.exit(1);
  }

  // 4. Move all enrollments that were mistakenly put in 2024-25 BCA-3 into 2026-27 BCA-3
  const updateRes = await Enrollment.updateMany(
    { academicSession: s2024._id, class: bca3_2024._id },
    { $set: { academicSession: s2026._id, class: bca3_2026._id, year: 3 } }
  );

  console.log(`Moved ${updateRes.modifiedCount} enrollments to 2026-27 session.`);
  
  process.exit(0);
}).catch(console.error);
