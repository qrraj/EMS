import { Router } from "express";
import { changePassword, login, session } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";
const router = Router();

router.post("/login", login);
router.get("/session", protect, session);
router.post("/change-password", protect, changePassword);

export default router;
