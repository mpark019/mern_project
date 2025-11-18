import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { addCalorieLog, getCalorieLogs } from '../../controllers/calorieController';
import CalorieLogModel from '../../models/calorieModel';

vi.mock('../../models/calorieModel', () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
  },
}));

describe('Calorie Controller - Simple Tests', () => {
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
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  describe('addCalorieLog', () => {
    it('should create a calorie log successfully', async () => {
      // Arrange
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
        ...mockRequest.body,
      };

      vi.mocked(CalorieLogModel.create).mockResolvedValue(mockCalorieLog as any);

      await addCalorieLog(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Calorie log added successfully',
        })
      );
    });

    it('should reject negative calorie values', async () => {
      mockRequest.body = {
        meal: 'Test Meal',
        calories: -100,
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
  });

  describe('getCalorieLogs', () => {
    it('should return all calorie logs for user', async () => {
      const mockLogs = [
        {
          _id: new mongoose.Types.ObjectId(),
          meal: 'Breakfast',
          calories: 300,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          meal: 'Lunch',
          calories: 500,
        },
      ];

      vi.mocked(CalorieLogModel.find).mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockLogs),
      } as any);

      await getCalorieLogs(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meals: mockLogs,
      });
    });
  });
});

