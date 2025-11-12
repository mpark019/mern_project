import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler"
import { sendEmail } from "../utils/sendEmail.js";

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// create a new user with email verification
export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please provide username, email, and password");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    verified: false,
  });

  const savedUser = await newUser.save();

  // Generate verification token
  const verificationToken = jwt.sign(
    { id: savedUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  // Send backend URL for local testing
  const clientUrl = process.env.CLIENT_URL.replace(/\/$/, ''); // Remove trailing slash
  const verifyUrl = `${clientUrl}/verify/${verificationToken}`;

  const html = `
    <h3>Welcome, ${username}!</h3>
    <p>Click below to verify your email:</p>
    <a href="${verifyUrl}" target="_blank">Verify Email</a>
    <p>This link expires in 24 hours.</p>
  `;

  await sendEmail(email, "Verify your email", html);

  res.status(201).json({
    message: "User registered successfully. Please check your email to verify your account.",
  });
});


// fetch all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password"); // Exclude password from response
  res.status(200).json(users);
});

// fetch a single user 
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password"); // Exclude password from response
  
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json(user);
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  // If password is being updated, hash it first
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true } // Return updated doc and run validators
  );
  
  if (!updatedUser) {
    const error = new Error("User not found");
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
export const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  
  if (!deletedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({ message: "User deleted successfully" });
});

// login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    const error = new Error("Please provide email and password");
    error.statusCode = 400;
    throw error;
  }

  

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

 // Check if the account is verified
  if (!user.verified) {
    return res.status(403).json({ message: "Please verify your email first" });
  }

  // Check if password matches
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Return user data and token
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  });
});

// get current user profile (protected route)
export const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is set by the auth middleware
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(user);
});

