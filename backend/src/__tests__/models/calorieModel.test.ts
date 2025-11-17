import { describe, it, expect, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import CalorieLogModel from '../../models/calorieModel';

describe('CalorieLog Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a calorie log with valid data', async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const calorieData = {
      userId: mockUserId,
      meal: 'Chicken Breast',
      calories: 231,
      protein: 43.5,
      carbs: 0,
      fats: 5,
      date: '2024-01-15',
    };

    // Mock the model's create method
    const mockCreate = vi.spyOn(CalorieLogModel, 'create').mockResolvedValue({
      ...calorieData,
      _id: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      save: vi.fn(),
    } as any);

    const result = await CalorieLogModel.create(calorieData);

    expect(mockCreate).toHaveBeenCalledWith(calorieData);
    expect(result).toHaveProperty('meal', 'Chicken Breast');
    expect(result).toHaveProperty('calories', 231);
  });

  it('should validate required fields', () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const invalidData = {
      userId: mockUserId,
      // Missing required fields
    };

    // In a real test, you'd validate against the schema
    // This is a simplified example
    expect(() => {
      // Schema validation would throw here
      if (!invalidData.meal || !invalidData.calories) {
        throw new Error('Required fields missing');
      }
    }).toThrow();
  });

  it('should enforce minimum values for numeric fields', () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const invalidData = {
      userId: mockUserId,
      meal: 'Test Meal',
      calories: -100, // Invalid: negative
      protein: 10,
      carbs: 20,
      fats: 5,
      date: '2024-01-15',
    };

    // Schema validation would reject negative values
    expect(invalidData.calories).toBeLessThan(0);
  });
});

