import mongoose from 'mongoose';
import Class from './models/Class.js';
import AcademicSession from './models/AcademicSession.js';

mongoose.connect('mongodb+srv://mdhuzaifsh786_db_user:P6UEAKp9ByK4DOj0@attendance-management.rcryqdu.mongodb.net/AttendanceSystem').then(async () => {
  const sessions = await AcademicSession.find().sort({ startYear: 1 }).lean();
  if (sessions.length < 3) return process.exit(0);

  const s2024 = sessions[0];
  const s2025 = sessions[1];
  const s2026 = sessions[2];

  const oldClasses = await Class.find({ academicSession: s2024._id }).lean();

  const cloneForSession = async (session) => {
    for (const c of oldClasses) {
      let baseCode = c.code;
      if (baseCode.includes('-')) baseCode = baseCode.split('-').slice(0, -1).join('-');
      // Try to create the cloned class
      const newCode = baseCode + '-' + session.startYear.toString().slice(-2) + '-' + c.semester;
      try {
        await Class.create({
          name: c.name,
          code: newCode,
          department: c.department,
          semester: c.semester,
          section: c.section,
          program: c.program,
          academicYear: session.name,
          academicSession: session._id,
          isActive: true,
        });
        console.log(`Cloned ${c.name} into ${session.name} as ${newCode}`);
      } catch (err) {
        if (err.code !== 11000) {
          console.error(`Failed to clone ${c.name}:`, err.message);
        }
      }
    }
  };

  await cloneForSession(s2025);
  await cloneForSession(s2026);
  process.exit(0);
}).catch(console.error);
