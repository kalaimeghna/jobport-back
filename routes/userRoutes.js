import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  updateAvatar,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  deleteAccount,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

/* ================= AUTH ================= */

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

/* ================= USER ================= */

router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/me/avatar", protect, updateAvatar);
router.delete("/me", protect, deleteAccount);

/* ================= ADMIN ================= */

router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/role/:id", protect, authorize("admin"), updateUserRole);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;