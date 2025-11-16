import express from "express";
import {
  addCalorieLog,
  getCalorieLogs,
  getCalorieLogById,
  updateCalorieLog,
  deleteCalorieLog,
  getCalorieLogsByDate,
} from "../controllers/calorieController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All calorie routes require authentication
router.post("/", protect, addCalorieLog); // Add a new calorie log
router.get("/", protect, getCalorieLogs); // Get all calorie logs for authenticated user
router.get("/date/:date", protect, getCalorieLogsByDate); // Get calorie logs by date
router.get("/:id", protect, getCalorieLogById); // Get a specific calorie log by ID
router.patch("/:id", protect, updateCalorieLog); // Update a calorie log
router.delete("/:id", protect, deleteCalorieLog); // Delete a calorie log

export default router;

