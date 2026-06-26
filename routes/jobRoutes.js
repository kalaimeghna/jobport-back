import express from "express";

import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  toggleJobStatus,
  toggleSaveJob,
  getSavedJobs,
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */
router.get("/", getJobs);
router.get("/:id", validateObjectId("id"), getJob);

/* ================= EMPLOYER ROUTES ================= */
router.post("/", protect, authorize("employer"), createJob);

router.get("/employer/my-jobs", protect, authorize("employer"), getMyJobs);

router.put("/:id", protect, authorize("employer", "admin"), updateJob);

router.delete("/:id", protect, authorize("employer", "admin"), deleteJob);

router.patch(
  "/:id/status",
  protect,
  authorize("employer", "admin"),
  toggleJobStatus
);

/* ================= JOB SEEKER ROUTES ================= */
router.post(
  "/:id/save",
  protect,
  authorize("jobseeker"),
  toggleSaveJob
);

router.get(
  "/saved/me",
  protect,
  authorize("jobseeker"),
  getSavedJobs
);

export default router;