import express from "express";

import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationById,
} from "../controllers/applicationController.js";

import {
  protect,
  employerOnly,
  jobSeekerOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= JOB SEEKER ROUTES ================= */

// Apply for a job
router.post(
  "/apply/:jobId",
  protect,
  jobSeekerOnly,
  applyForJob
);

// Get my applications
router.get(
  "/my",
  protect,
  jobSeekerOnly,
  getMyApplications
);

/* ================= EMPLOYER ROUTES ================= */

// Get all applications for a job (ATS view)
router.get(
  "/job/:jobId",
  protect,
  employerOnly,
  getJobApplications
);

// Update application status (shortlist/reject/hire)
router.put(
  "/:id/status",
  protect,
  employerOnly,
  updateApplicationStatus
);

/* ================= COMMON ROUTES ================= */

// Get single application
router.get(
  "/:id",
  protect,
  getApplicationById
);

// Delete application (user or admin logic handled in controller)
router.delete(
  "/:id",
  protect,
  deleteApplication
);

export default router;