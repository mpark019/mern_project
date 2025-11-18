import { describe, it, expect } from 'vitest';
import { calculateTotalCalories, calculateProgress, isValidCalorieRange } from '../../utils/calorieUtils';

describe('Calorie Utils', () => {
  describe('calculateTotalCalories', () => {
    it('should calculate total calories correctly', () => {
      const calories = [100, 200, 50];

      const result = calculateTotalCalories(calories);

      expect(result).toBe(350);
    });

    it('should return zero for empty array', () => {
      const calories: number[] = [];

      const result = calculateTotalCalories(calories);

      expect(result).toBe(0);
    });
  });

  describe('calculateProgress', () => {
    it('should calculate progress percentage correctly', () => {
      const consumed = 1500;
      const goal = 2000;

      const result = calculateProgress(consumed, goal);

      expect(result).toBe(75);
    });

    it('should return zero when goal is zero', () => {
      const consumed = 1000;
      const goal = 0;

      const result = calculateProgress(consumed, goal);

      expect(result).toBe(0);
    });
  });

  describe('isValidCalorieRange', () => {
    it('should return true for valid calorie range', () => {
      const calories = 2000;

      const result = isValidCalorieRange(calories);

      expect(result).toBe(true);
    });

    it('should return false for negative calories', () => {
      const calories = -100;

      const result = isValidCalorieRange(calories);

      expect(result).toBe(false);
    });
  });
});

