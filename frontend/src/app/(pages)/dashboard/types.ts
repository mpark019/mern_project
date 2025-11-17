export interface CalorieLog {
  _id: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrentUser {
  _id: string;
  username: string;
  email: string;
  calorieGoal?: number;
}

export interface MealFormData {
  meal: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  date: string;
}

export interface TodayTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

