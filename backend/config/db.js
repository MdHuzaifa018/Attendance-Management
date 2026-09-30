import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI .env me set nahi hai");
  }

  let attempt = 0;

  while (attempt < 5) {
    attempt++;
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000, // 30 seconds timeout
        socketTimeoutMS: 45000,
      });
      console.log("MongoDB connected successfully");
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/5 failed:`, error.message);
      if (attempt === 5) throw error;
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sec wait before retry
    }
  }
};

export default connectDB;