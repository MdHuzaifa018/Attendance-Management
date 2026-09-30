import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI .env me set nahi hai");
  }

  let attempt = 0;

  while (attempt < 3) {
    attempt++;
    try {
      await mongoose.connect(uri, {
        maxPoolSize: 10,          // Ek saath max 10 DB connections
        serverSelectionTimeoutMS: 5000,  // 5 sec me connect na ho to fail
        socketTimeoutMS: 45000,   // 45 sec se zyada hang kare to drop
        family: 4,                // IPv4 use karo (Atlas pe fast hota hai)
      });
      console.log("MongoDB connected successfully");
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/3 failed:`, error.message);
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec baad retry
    }
  }
};

export default connectDB;