import "dotenv/config";
import express from "express";
import cors from "cors";
import "./db/connection.js"; // Establish database connection
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // postman

app.use("/users", userRoutes);

// Error handling middleware (must be after all routes)
app.use(errorHandler);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});