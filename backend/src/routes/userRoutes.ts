import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getCurrentUser,
  getUserByUsername,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

interface JwtPayload {
  id: string;
}

// Public routes 
router.post("/", createUser); // Register new user
router.post("/login", loginUser); // Login user
router.post("/forgot-password", forgotPassword); // Request password reset
router.post("/reset-password/:token", resetPassword); // Reset password with token

// VERIFY EMAIL - Public route
router.get("/verify/:token", async (req: Request, res: Response): Promise<void> => {
  console.log("Verify route hit");
  console.log("Token received:", req.params.token);

  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET as string) as JwtPayload;
    
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("No user found for decoded ID");
      res.status(400).json({ message: "Invalid verification link" });
      return;
    }

    if (user.verified) {
      console.log("User already verified:", user.email);
      res.status(200).json({ message: "Email already verified" });
      return;
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

// Public route to get user by username
router.get("/get-user/:username", getUserByUsername);

// Protected routes (require authentication)
router.get("/me", protect, getCurrentUser);
router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.patch("/:id/password", protect, changePassword); // More specific route first
router.patch("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;

