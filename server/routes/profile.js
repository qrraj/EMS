import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.js";
import { protect } from "../middleware/auth.js";
const router = Router();

router.get("/", protect, getProfile);
router.post("/", protect, updateProfile);

export default router;
