import express from "express";

import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  uploadCompanyLogo,
  getMyCompany,
} from "../controllers/companyController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =============== PUBLIC ROUTES =============== */

router.get("/", getCompanies);

router.get("/:id", getCompanyById);

/* =============== EMPLOYER ROUTES =============== */

router.get(
  "/my/company",
  protect,
  authorize("employer"),
  getMyCompany
);

router.post(
  "/",
  protect,
  authorize("employer"),
  createCompany
);

router.put(
  "/:id",
  protect,
  authorize("employer", "admin"),
  updateCompany
);

router.delete(
  "/:id",
  protect,
  authorize("employer", "admin"),
  deleteCompany
);

router.post(
  "/:id/logo",
  protect,
  authorize("employer", "admin"),
  upload.single("logo"),
  uploadCompanyLogo
);

export default router;