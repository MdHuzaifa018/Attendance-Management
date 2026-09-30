import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  // Mongoose connection options tuned for MongoDB Atlas (cloud):
  // - maxPoolSize: keep up to 10 concurrent DB connections ready
  // - serverSelectionTimeoutMS: fail fast if Atlas is unreachable (5s)
  // - socketTimeoutMS: drop queries that hang longer than 45s
  // - family: 4 forces IPv4 which avoids DNS resolution delays on some hosts
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      const conn = await mongoose.connect(uri, options);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${maxAttempts} failed: ${err.message}`);
      if (attempt === maxAttempts) throw err;
      // Wait 2 seconds before retrying
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
};

export default connectDB;