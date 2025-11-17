import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verified: boolean;
  calorieGoal?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  verified: { type: Boolean, default: false },
  calorieGoal: { type: Number, default: 2000 },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model<User>("User", userSchema);

export default User;

