import mongoose from 'mongoose';
import Class from './models/Class.js';

mongoose.connect('mongodb+srv://mdhuzaifsh786_db_user:P6UEAKp9ByK4DOj0@attendance-management.rcryqdu.mongodb.net/AttendanceSystem').then(async () => {
  const classes = await Class.find({}).lean();
  
  const toDelete = [];
  
  const groups = {};
  for (const c of classes) {
    const key = c.academicSession + '|' + c.name;
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  }
  
  for (const key in groups) {
    const group = groups[key];
    if (group.length > 1) {
      group.sort((a, b) => a.code.length - b.code.length); 
      for (let i = 0; i < group.length - 1; i++) {
        toDelete.push(group[i]._id);
      }
    }
  }
  
  console.log('Duplicate classes found:', toDelete.length);
  if (toDelete.length > 0) {
    const delRes = await Class.deleteMany({ _id: { $in: toDelete } });
    console.log('Deleted:', delRes.deletedCount);
  }
  
  process.exit(0);
}).catch(console.error);
