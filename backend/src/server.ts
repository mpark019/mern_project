import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import "./db/connection";
import userRoutes from "./routes/userRoutes";
import calorieRoutes from "./routes/calorieRoutes";
import { errorHandler } from "./middleware/errorHandler";

const PORT: number = parseInt(process.env.PORT || "5050", 10);
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // postman

app.use("/users", userRoutes);
app.use("/calories", calorieRoutes);

// Error handling middleware
app.use(errorHandler);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

