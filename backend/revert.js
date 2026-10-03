import mongoose from 'mongoose';
import Enrollment from './models/Enrollment.js';
import Student from './models/Student.js';
import PromotionHistory from './models/PromotionHistory.js';
import Class from './models/Class.js';

mongoose.connect('mongodb+srv://mdhuzaifsh786_db_user:P6UEAKp9ByK4DOj0@attendance-management.rcryqdu.mongodb.net/AttendanceSystem').then(async () => {
  const bca3 = await Class.findOne({ name: 'BCA Third Year' });
  if (!bca3) { console.log('BCA-3 not found'); return process.exit(1); }

  const graduatedEnrollments = await Enrollment.find({ class: bca3._id, status: 'graduated' });
  
  if (graduatedEnrollments.length === 0) {
    console.log('No graduated enrollments found for BCA-3');
    return process.exit(0);
  }

  const studentIds = graduatedEnrollments.map(e => e.student);

  // Revert Enrollments to active
  const enrRes = await Enrollment.updateMany(
    { class: bca3._id, status: 'graduated' },
    { $set: { status: 'active' } }
  );

  // Revert Students to active
  const stuRes = await Student.updateMany(
    { _id: { $in: studentIds } },
    { $set: { status: 'active' } }
  );

  // Delete Promotion History where action was 'graduated' for these students
  const histRes = await PromotionHistory.deleteMany({
    student: { $in: studentIds },
    action: 'graduated'
  });

  console.log('Revert Summary:');
  console.log('Enrollments reverted:', enrRes.modifiedCount);
  console.log('Students reverted:', stuRes.modifiedCount);
  console.log('Histories deleted:', histRes.deletedCount);
  
  process.exit(0);
}).catch(console.error);
