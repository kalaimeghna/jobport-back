import Job from "../models/job.js";
import Application from "../models/application.js";
import User from "../models/user.js";

/* ================= JOB RECOMMENDATIONS ================= */
export const getJobRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find jobs user already applied to
    const applications = await Application.find({ applicant: userId }).select("job");

    const appliedJobIds = applications.map((app) => app.job);

    // Recommended jobs (simple logic)
    const jobs = await Job.find({
      _id: { $nin: appliedJobIds },
      status: "active",
    })
      .limit(10)
      .populate("company", "name logo");

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GENERAL RECOMMENDATIONS ================= */
export const getRecommendations = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .sort("-createdAt")
      .limit(10)
      .populate("company", "name logo");

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= USER RECOMMENDATIONS ================= */
export const getUserRecommendations = async (req, res, next) => {
  try {
    const users = await User.find({
      role: "jobseeker",
      _id: { $ne: req.user.id },
    })
      .select("name email skills experience")
      .limit(10);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};