import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import "./db/connection";
import userRoutes from "./routes/userRoutes";
import calorieRoutes from "./routes/calorieRoutes";
import foodScanRoutes from "./routes/foodScanRoutes";
import { errorHandler } from "./middleware/errorHandler";

const PORT: number = parseInt(process.env.PORT || "5050", 10);
const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased limit for base64 image uploads

app.use("/users", userRoutes);
app.use("/calories", calorieRoutes);
app.use("/food-scan", foodScanRoutes);

// Error handling middleware
app.use(errorHandler);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

