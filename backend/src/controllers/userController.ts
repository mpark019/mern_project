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
    calorieGoal: updatedUser.calorieGoal,
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

// change user password
export const changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    const error = new Error("Please provide both current password and new password") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error("New password must be at least 6 characters long") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  // Find user by ID
  const user = await UserModel.findById(id);
  
  if (!user) {
    const error = new Error("User not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
  if (!isPasswordValid) {
    const error = new Error("Current password is incorrect") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

// forgot password - send reset link via email
export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    const error = new Error("Please provide an email address") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  // Find user by email
  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(200).json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
    return;
  }

  // Validate
  if (!process.env.CLIENT_URL) {
    res.status(500);
    throw new Error("CLIENT_URL environment variable is not set");
  }

  // Generate password reset token
  const resetToken = jwt.sign(
    { id: user._id, type: "password-reset" },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  // Prepare email content
  const clientUrl = process.env.CLIENT_URL.replace(/\/$/, '');
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const html = `
    <h3>Password Reset Request</h3>
    <p>Hello ${user.username},</p>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${resetUrl}</p>
  `;

  try {
    await sendEmail(email, "Password Reset Request", html);
    res.status(200).json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (emailError: any) {
    console.error("Failed to send password reset email:", emailError);
    res.status(500);
    throw new Error(`Failed to send password reset email: ${emailError.message}`);
  }
});

// reset password
export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    const error = new Error("Please provide a new password") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error("Password must be at least 6 characters long") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  try {
    // Verify and decode the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; type?: string };

    // Verify it's a password reset token
    if (decoded.type !== "password-reset") {
      const error = new Error("Invalid reset token") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    // Find user by ID from token
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      const customError = new Error("Invalid or expired reset token") as CustomError;
      customError.statusCode = 400;
      throw customError;
    }
    throw error;
  }
});

