import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

/* ========== ROUTES ========== */
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

/* ========== MIDDLEWARE ========== */
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

/* ========== DB CONNECT ========== */
connectDB();

/* ========== APP ========== */
const app = express();

/* ========== MIDDLEWARES ========== */

// CORS (important for frontend)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ========== ROUTES ========== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/resumes", resumeRoutes);

/* ========== HEALTH CHECK ========== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Job Portal API Running",
  });
});

/* ========== ERROR HANDLERS ========== */
app.use(notFound);
app.use(errorHandler);

/* ========== SERVER START ========== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});