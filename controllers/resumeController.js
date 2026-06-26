import Resume from "../models/Resume.js";
import ErrorResponse from "../utils/errorResponse.js";

/* ================= UPLOAD RESUME ================= */
export const uploadResume = async (req, res, next) => {
  try {
    const resume = await Resume.create({
      user: req.user.id,
      file: req.file?.path,
      title: req.body.title,
    });

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET MY RESUME ================= */
export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET SINGLE RESUME ================= */
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(new ErrorResponse("Resume not found", 404));
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= DELETE RESUME (FIX FOR YOUR ERROR) ================= */
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(new ErrorResponse("Resume not found", 404));
    }

    // allow only owner or admin
    if (
      resume.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new ErrorResponse("Not authorized", 403));
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};