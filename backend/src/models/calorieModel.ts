import mongoose, { Document, Schema } from "mongoose";

export interface CalorieLog extends Document {
  userId: mongoose.Types.ObjectId;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const calorieSchema: Schema<CalorieLog> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true,
  },
  meal: {
    type: String,
    required: [true, "Meal name is required"],
    trim: true,
  },
  calories: {
    type: Number,
    required: [true, "Calories are required"],
    min: [0, "Calories cannot be negative"],
  },
  protein: {
    type: Number,
    required: [true, "Protein is required"],
    min: [0, "Protein cannot be negative"],
  },
  carbs: {
    type: Number,
    required: [true, "Carbs are required"],
    min: [0, "Carbs cannot be negative"],
  },
  fats: {
    type: Number,
    required: [true, "Fats are required"],
    min: [0, "Fats cannot be negative"],
  },
  date: {
    type: String,
    required: [true, "Date is required"],
    index: true,
  },
}, {
  timestamps: true,
});

// Indexing for queries
calorieSchema.index({ userId: 1, date: 1 });

const CalorieLogModel = mongoose.model<CalorieLog>("CalorieLog", calorieSchema);

export default CalorieLogModel;

