import mongoose from 'mongoose';

const connectDB = async (retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${connection.connection.host}`);
      return connection;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;