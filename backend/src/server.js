import "dotenv/config";
import express from "express";
import cors from "cors";
import "./db/connection.js"; // Establish database connection
import userRoutes from "./routes/userRoutes.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes)

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});