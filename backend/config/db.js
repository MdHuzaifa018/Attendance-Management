import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected:${connection.connection.host}`);


    }catch(error){
        console.error("DB error",error.message);
        throw error;
        process.exit(1);
    }
};

export default connectDB;