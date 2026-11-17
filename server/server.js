import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import employeeRouter from "./routes/employee.js";
import profileRouter from "./routes/profile.js";
import attendanceRouter from "./routes/attendance.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(multer().none());

app.get("/", (req, res) => {
  res.send("server is running");
});
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRouter);

connectDB();
app.listen(PORT, () => {
  console.log(`app running on port${PORT}`);
});
