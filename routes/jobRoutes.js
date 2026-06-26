import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Get all jobs
router.get("/", getJobs);

// Get single job
router.get("/:id", validateObjectId("id"), getJobById);

/* ================= EMPLOYER ROUTES ================= */

// Create job
router.post(
  "/",
  protect,
  authorize("employer", "admin"),
  createJob
);

// Get jobs posted by logged-in employer
router.get(
  "/employer/my-jobs",
  protect,
  authorize("employer", "admin"),
  getMyJobs
);

// Update job
router.put(
  "/:id",
  protect,
  authorize("employer", "admin"),
  updateJob
);

// Delete job
router.delete(
  "/:id",
  protect,
  authorize("employer", "admin"),
  deleteJob
);

export default router;