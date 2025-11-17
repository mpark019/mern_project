import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { addCalorieLog, getCalorieLogs, getCalorieLogById } from '../../controllers/calorieController';
import CalorieLogModel from '../../models/calorieModel';

// Mock the model
vi.mock('../../models/calorieModel', () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

describe('Calorie Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRequest = {
      body: {},
      user: {
        userId: new mongoose.Types.ObjectId().toString(),
      },
      params: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  describe('addCalorieLog', () => {
    it('should create a calorie log successfully', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      mockRequest.user = { userId: mockUserId.toString() };
      mockRequest.body = {
        meal: 'Grilled Salmon',
        calories: 206,
        protein: 34,
        carbs: 0,
        fats: 7,
        date: '2024-01-15',
      };

      const mockCalorieLog = {
        _id: new mongoose.Types.ObjectId(),
        userId: mockUserId,
        ...mockRequest.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(CalorieLogModel.create).mockResolvedValue(mockCalorieLog as any);

      await addCalorieLog(mockRequest as Request, mockResponse as Response, mockNext);

      expect(CalorieLogModel.create).toHaveBeenCalledWith({
        userId: mockUserId.toString(),
        meal: 'Grilled Salmon',
        calories: 206,
        protein: 34,
        carbs: 0,
        fats: 7,
        date: '2024-01-15',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Calorie log added successfully',
        calorieLog: mockCalorieLog,
      });
    });

    it('should reject negative calorie values', async () => {
      mockRequest.body = {
        meal: 'Test Meal',
        calories: -100, // Invalid
        protein: 10,
        carbs: 20,
        fats: 5,
        date: '2024-01-15',
      };

      await addCalorieLog(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Calories, protein, carbs, and fats cannot be negative',
          statusCode: 400,
        })
      );
    });

    it('should reject missing required fields', async () => {
      mockRequest.body = {
        meal: 'Test Meal',
        // Missing other required fields
      };

      await addCalorieLog(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'All fields (meal, calories, protein, carbs, fats, date) are required',
          statusCode: 400,
        })
      );
    });

    it('should reject unauthenticated requests', async () => {
      mockRequest.user = undefined;
      mockRequest.body = {
        meal: 'Test Meal',
        calories: 200,
        protein: 20,
        carbs: 30,
        fats: 10,
        date: '2024-01-15',
      };

      await addCalorieLog(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not authenticated',
          statusCode: 401,
        })
      );
    });
  });

  describe('getCalorieLogs', () => {
    it('should return all calorie logs for authenticated user', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      mockRequest.user = { userId: mockUserId.toString() };

      const mockLogs = [
        {
          _id: new mongoose.Types.ObjectId(),
          userId: mockUserId,
          meal: 'Breakfast',
          calories: 300,
          protein: 20,
          carbs: 30,
          fats: 10,
          date: '2024-01-15',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          userId: mockUserId,
          meal: 'Lunch',
          calories: 500,
          protein: 30,
          carbs: 50,
          fats: 15,
          date: '2024-01-15',
        },
      ];

      vi.mocked(CalorieLogModel.find).mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockLogs),
      } as any);

      await getCalorieLogs(mockRequest as Request, mockResponse as Response, mockNext);

      expect(CalorieLogModel.find).toHaveBeenCalledWith({ userId: mockUserId.toString() });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meals: mockLogs,
      });
    });
  });

  describe('getCalorieLogById', () => {
    it('should return a specific calorie log', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const mockLogId = new mongoose.Types.ObjectId();
      mockRequest.user = { userId: mockUserId.toString() };
      mockRequest.params = { id: mockLogId.toString() };

      const mockLog = {
        _id: mockLogId,
        userId: mockUserId,
        meal: 'Dinner',
        calories: 600,
        protein: 40,
        carbs: 60,
        fats: 20,
        date: '2024-01-15',
      };

      vi.mocked(CalorieLogModel.findOne).mockResolvedValue(mockLog as any);

      await getCalorieLogById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(CalorieLogModel.findOne).toHaveBeenCalledWith({
        _id: mockLogId.toString(),
        userId: mockUserId.toString(),
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLog);
    });

    it('should return 404 if log not found', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const mockLogId = new mongoose.Types.ObjectId();
      mockRequest.user = { userId: mockUserId.toString() };
      mockRequest.params = { id: mockLogId.toString() };

      vi.mocked(CalorieLogModel.findOne).mockResolvedValue(null);

      await getCalorieLogById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Calorie log not found',
          statusCode: 404,
        })
      );
    });
  });
});

