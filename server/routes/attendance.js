import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { clockInOut, getAttendance } from "../controllers/attendance.js";

const router = Router();

router.post("/", protect, clockInOut);
router.get("/", protect, getAttendance);

export default router;
