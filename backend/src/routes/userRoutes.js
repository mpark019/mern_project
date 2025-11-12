import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getCurrentUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes - MUST be before protected routes
router.post("/", createUser); // Register new user
router.post("/login", loginUser); // Login user

// VERIFY EMAIL - Public route
router.get("/verify/:token", async (req, res) => {
  console.log("Verify route hit");
  console.log("Token received:", req.params.token);

  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("No user found for decoded ID");
      return res.status(400).json({ message: "Invalid verification link" });
    }

    if (user.verified) {
      console.log("User already verified:", user.email);
      return res.status(200).json({ message: "Email already verified" });
    }

    user.verified = true;
    await user.save();
    console.log("User verified successfully:", user.email);

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// Protected routes (require authentication)
router.get("/me", protect, getCurrentUser);
router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.patch("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;