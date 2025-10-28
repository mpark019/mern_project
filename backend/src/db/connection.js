import mongoose from "mongoose";

const uri = process.env.ATLAS_URI || "";

if (!uri) {
  console.error("Error: ATLAS_URI is not defined in environment variables");
}

try {
  await mongoose.connect(uri);
  console.log("Successfully connected to MongoDB with Mongoose");
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1);
}

// Export mongoose for use in routes
export default mongoose;
