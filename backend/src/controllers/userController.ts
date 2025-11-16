import { Request, Response } from "express";
import UserModel, { type User } from "../models/userModel";
import CalorieLogModel from "../models/calorieModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/sendEmail";

interface CustomError extends Error {
  statusCode?: number;
}

// Generate JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// create a new user with email verification
export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please provide username, email, and password");
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
    verified: false,
  });

  // Validate CLIENT_URL before proceeding
  if (!process.env.CLIENT_URL) {
    res.status(500);
    throw new Error("CLIENT_URL environment variable is not set");
  }

  // Generate verification token before saving user
  const verificationToken = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );

  // Prepare email content
  const clientUrl = process.env.CLIENT_URL.replace(/\/$/, '');
  const verifyUrl = `${clientUrl}/verify/${verificationToken}`;

  const html = `
    <h3>Welcome, ${username}!</h3>
    <p>Click below to verify your email:</p>
    <a href="${verifyUrl}" target="_blank">Verify Email</a>
    <p>This link expires in 24 hours.</p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${verifyUrl}</p>
  `;

  // Try to send email first, only save user if email is sent successfully
  try {
    await sendEmail(email, "Verify your email", html);
  } catch (emailError: any) {
    // If email fails, don't create the user
    res.status(500);
    throw new Error(`Failed to send verification email: ${emailError.message}`);
  }

  // Only save user if email was sent successfully
  await newUser.save();

  res.status(201).json({
    message: "User registered successfully. Please check your email to verify your account.",
  });
});

// fetch all users
export const getUsers = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const users = await UserModel.find({}).select("-password"); // Exclude password from response
  res.status(200).json(users);
});

// fetch a single user 
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await UserModel.findById(req.params.id).select("-password");
  
  if (!user) {
    const error = new Error("User not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json(user);
});

// update user
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const updateData: Partial<User> = { ...req.body };

  // If password is being updated, hash it first
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true } // Return updated doc and run validators
  );
  
  if (!updatedUser) {
    const error = new Error("User not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }

  // Don't return the password in the response
  const userResponse = {
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
  
  res.status(200).json(userResponse);
});

// delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
  
  if (!deletedUser) {
    const error = new Error("User not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({ message: "User deleted successfully" });
});

// login user
export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    const error = new Error("Please provide email and password") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  // Find user by email
  const user = await UserModel.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  // Check if the account is verified
  if (!user.verified) {
    res.status(403).json({ message: "Please verify your email first" });
    return;
  }

  // Check if password matches
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT token
  const token = generateToken(String(user._id));

  // Return user data and token
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  });
});

// get current user profile (protected route)
export const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // req.user is set by the auth middleware
  if (!req.user) {
    const error = new Error("User not authenticated") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  const user = await UserModel.findById(req.user.userId).select("-password");

  if (!user) {
    const error = new Error("User not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(user);
});

// get user by username with meals
export const getUserByUsername = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  
  const user = await UserModel.findOne({ username }).select("-password");
  
  if (!user) {
    const error = new Error("User not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }
  
  // Fetch calorie logs from separate collection
  const meals = await CalorieLogModel.find({ userId: user._id }).sort({ createdAt: -1 });
  
  res.status(200).json({
    username: user.username,
    meals,
  });
});

