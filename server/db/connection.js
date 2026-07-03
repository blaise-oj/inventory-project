import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri =
            process.env.NODE_ENV === "production"
                ? process.env.MONGO_URI_ATLAS
                : process.env.MONGO_URI_LOCAL;

        await mongoose.connect(uri);

        console.log(
            process.env.NODE_ENV === "production"
                ? "✅ Connected to MongoDB Atlas"
                : "✅ Connected to Local MongoDB"
        );
    } catch (error) {
        console.error("❌ Connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;