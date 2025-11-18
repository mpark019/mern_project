/**
 * Calculate total calories from an array of calorie values
 */
export const calculateTotalCalories = (calories: number[]): number => {
  if (calories.length === 0) {
    return 0;
  }
  return calories.reduce((sum, cal) => sum + cal, 0);
};

/**
 * Calculate daily calorie goal progress
 */
export const calculateProgress = (consumed: number, goal: number): number => {
  if (goal === 0) return 0;
  return Math.round((consumed / goal) * 100);
};

/**
 * Validate if calories are within a healthy range
 */
export const isValidCalorieRange = (calories: number): boolean => {
  return calories >= 0 && calories <= 10000;
};

