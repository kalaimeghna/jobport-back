import express from "express";
import {
  getRecommendations,
  getJobRecommendations,
  getUserRecommendations,
} from "../controllers/recommendationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= JOB RECOMMENDATIONS ================= */
router.get("/jobs", protect, getJobRecommendations);

/* ================= USER RECOMMENDATIONS ================= */
router.get("/user", protect, getUserRecommendations);

/* ================= GENERAL RECOMMENDATIONS ================= */
router.get("/", protect, getRecommendations);

export default router;