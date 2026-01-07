import mongoose from "mongoose";

const client = async () => {
  try {
    await mongoose.connect(process.env.mongoURI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.log("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default client;
