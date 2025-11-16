import { Request, Response } from "express";
import CalorieLogModel from "../models/calorieModel";
import asyncHandler from "express-async-handler";

interface CustomError extends Error {
  statusCode?: number;
}

// Add a new calorie log entry
export const addCalorieLog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { meal, calories, protein, carbs, fats, date } = req.body;

  // Validate required fields
  if (!meal || calories === undefined || protein === undefined || carbs === undefined || fats === undefined || !date) {
    const error = new Error("All fields (meal, calories, protein, carbs, fats, date) are required") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  // Validate numeric values
  if (calories < 0 || protein < 0 || carbs < 0 || fats < 0) {
    const error = new Error("Calories, protein, carbs, and fats cannot be negative") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  // Get user ID from authenticated request (set by protect middleware)
  if (!req.user) {
    const error = new Error("User not authenticated") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  const userId = req.user.userId;

  // Create new calorie log entry in separate collection
  const newCalorieLog = await CalorieLogModel.create({
    userId,
    meal,
    calories,
    protein,
    carbs,
    fats,
    date,
  });

  res.status(201).json({
    message: "Calorie log added successfully",
    calorieLog: newCalorieLog,
  });
});

// Get all calorie logs for the authenticated user
export const getCalorieLogs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    const error = new Error("User not authenticated") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  const userId = req.user.userId;

  // Query calorie logs from separate collection
  const calorieLogs = await CalorieLogModel.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    meals: calorieLogs,
  });
});

// Get a specific calorie log by ID
export const getCalorieLogById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    const error = new Error("User not authenticated") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  const userId = req.user.userId;
  const logId = req.params.id;

  // Find calorie log in separate collection, ensuring it belongs to the user
  const calorieLog = await CalorieLogModel.findOne({ _id: logId, userId });
  
  if (!calorieLog) {
    const error = new Error("Calorie log not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(calorieLog);
});

// Update a calorie log entry
export const updateCalorieLog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { meal, calories, protein, carbs, fats, date } = req.body;

  if (!req.user) {
    const error = new Error("User not authenticated") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  const userId = req.user.userId;
  const logId = req.params.id;

  // Find calorie log in separate collection, ensuring it belongs to the user
  const calorieLog = await CalorieLogModel.findOne({ _id: logId, userId });
  
  if (!calorieLog) {
    const error = new Error("Calorie log not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }

  // Validate numeric values if provided
  if (calories !== undefined && calories < 0) {
    const error = new Error("Calories cannot be negative") as CustomError;
    error.statusCode = 400;
    throw error;
  }
  if (protein !== undefined && protein < 0) {
    const error = new Error("Protein cannot be negative") as CustomError;
    error.statusCode = 400;
    throw error;
  }
  if (carbs !== undefined && carbs < 0) {
    const error = new Error("Carbs cannot be negative") as CustomError;
    error.statusCode = 400;
    throw error;
  }
  if (fats !== undefined && fats < 0) {
    const error = new Error("Fats cannot be negative") as CustomError;
    error.statusCode = 400;
    throw error;
  }

  // Update fields if provided
  if (meal !== undefined) calorieLog.meal = meal;
  if (calories !== undefined) calorieLog.calories = calories;
  if (protein !== undefined) calorieLog.protein = protein;
  if (carbs !== undefined) calorieLog.carbs = carbs;
  if (fats !== undefined) calorieLog.fats = fats;
  if (date !== undefined) calorieLog.date = date;

  await calorieLog.save();

  res.status(200).json({
    message: "Calorie log updated successfully",
    calorieLog,
  });
});

// Delete a calorie log entry
export const deleteCalorieLog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    const error = new Error("User not authenticated") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  const userId = req.user.userId;
  const logId = req.params.id;

  // Find and delete calorie log from separate collection, ensuring it belongs to the user
  const calorieLog = await CalorieLogModel.findOneAndDelete({ _id: logId, userId });
  
  if (!calorieLog) {
    const error = new Error("Calorie log not found") as CustomError;
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    message: "Calorie log deleted successfully",
  });
});

// Get calorie logs by date
export const getCalorieLogsByDate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    const error = new Error("User not authenticated") as CustomError;
    error.statusCode = 401;
    throw error;
  }

  const userId = req.user.userId;
  const date = req.params.date;

  // Query calorie logs by date from separate collection
  const logsByDate = await CalorieLogModel.find({ userId, date });

  res.status(200).json({
    date,
    meals: logsByDate,
    totalCalories: logsByDate.reduce((sum, meal) => sum + meal.calories, 0),
    totalProtein: logsByDate.reduce((sum, meal) => sum + meal.protein, 0),
    totalCarbs: logsByDate.reduce((sum, meal) => sum + meal.carbs, 0),
    totalFats: logsByDate.reduce((sum, meal) => sum + meal.fats, 0),
  });
});

