import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= AUTH ROUTES ================= */

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.put("/change-password", protect, changePassword);

router.get("/verify-email/:token", verifyEmail);

export default router;