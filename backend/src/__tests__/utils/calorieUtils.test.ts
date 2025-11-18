import { describe, it, expect } from 'vitest';
import { calculateTotalCalories, calculateProgress, isValidCalorieRange } from '../../utils/calorieUtils';

describe('Calorie Utils', () => {
  describe('calculateTotalCalories', () => {
    it('Calculate Total Correctly', () => {
      const calories = [100, 200, 50];

      const result = calculateTotalCalories(calories);

      expect(result).toBe(350);
    });

    it('Return Zero for Null Value', () => {
      const calories: number[] = [];

      const result = calculateTotalCalories(calories);

      expect(result).toBe(0);
    });
  });

  describe('calculateProgress', () => {
    it('Calculate Calorie Percentage', () => {
      const consumed = 1500;
      const goal = 2000;

      const result = calculateProgress(consumed, goal);

      expect(result).toBe(75);
    });

    it('Return 0 when Goal is 0', () => {
      const consumed = 1000;
      const goal = 0;

      const result = calculateProgress(consumed, goal);

      expect(result).toBe(0);
    });
  });

  describe('isValidCalorieRange', () => {
    it('Valid Calorie Range', () => {
      const calories = 2000;

      const result = isValidCalorieRange(calories);

      expect(result).toBe(true);
    });

    it('Return False for Negative Calories', () => {
      const calories = -100;

      const result = isValidCalorieRange(calories);

      expect(result).toBe(false);
    });
  });
});

