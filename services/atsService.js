const Application = require("../models/Application");
const Job = require("../models/Job");
const mongoose = require("mongoose");

/* ==============================
   GET ATS DASHBOARD STATS
============================== */
exports.getATSStats = async (employerId) => {
  // Get all jobs posted by employer
  const employerJobs = await Job.find({ postedBy: employerId }).select("_id");

  const jobIds = employerJobs.map((job) => job._id);

  if (!jobIds.length) {
    return {
      stats: [],
      totalApplications: 0,
      recentApplications: [],
      totalJobs: 0,
    };
  }

  /* ==============================
     STATUS WISE STATS
  ============================== */
  const stats = await Application.aggregate([
    {
      $match: {
        job: { $in: jobIds },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  /* ==============================
     TOTAL APPLICATIONS
  ============================== */
  const totalApplications = await Application.countDocuments({
    job: { $in: jobIds },
  });

  /* ==============================
     RECENT APPLICATIONS
  ============================== */
  const recentApplications = await Application.find({
    job: { $in: jobIds },
  })
    .populate("applicant", "name avatar")
    .populate("job", "title")
    .sort("-createdAt")
    .limit(5);

  return {
    stats,
    totalApplications,
    recentApplications,
    totalJobs: employerJobs.length,
  };
};