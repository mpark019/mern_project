import express from "express";
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

// Public routes
router.post("/", createUser); // Register new user
router.post("/login", loginUser); // Login user

// Protected routes (require authentication)
router.get("/me", protect, getCurrentUser);
router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.patch("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
