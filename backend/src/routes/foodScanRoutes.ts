import express from "express";
import { scanFood } from "../controllers/foodScanController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Food scan route requires authentication
router.post("/", protect, scanFood);

export default router;

