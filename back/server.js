import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const POST = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})