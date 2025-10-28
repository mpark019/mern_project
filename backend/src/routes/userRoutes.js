import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Get list of all users
router.get("/", getUsers);

// Get single user by id
router.get("/:id", getUserById);

// Create new user
router.post("/", createUser);

// Update a user by id
router.patch("/:id", updateUser);

// Delete a user
router.delete("/:id", deleteUser);

export default router;
