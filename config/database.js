import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connect Successfully.")
    } catch (error) {
        console.error("Database Connection Failed!!", error);
        process.exit(1);
    };
};










