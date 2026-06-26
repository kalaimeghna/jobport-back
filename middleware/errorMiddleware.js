import mongoose from "mongoose";

/* ==============================
   404 NOT FOUND MIDDLEWARE
============================== */
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/* ==============================
   GLOBAL ERROR HANDLER
============================== */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";

  /* ================= MONGOOSE INVALID OBJECT ID ================= */
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  /* ================= DUPLICATE KEY ERROR ================= */
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : "Duplicate field error";
  }

  /* ================= MONGOOSE VALIDATION ERROR ================= */
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  /* ================= JWT ERRORS (IMPORTANT) ================= */
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired, please login again";
  }

  /* ================= RESPONSE ================= */
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};