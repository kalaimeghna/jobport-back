const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

/* ==============================
   GET JOB RECOMMENDATIONS
============================== */
exports.getRecommendations = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.jobSeekerProfile) {
    return {
      jobs: [],
      message: "Complete your profile for better recommendations",
    };
  }

  const profile = user.jobSeekerProfile;

  const skills = profile.skills || [];
  const preferredJobTypes = profile.preferredJobTypes || [];
  const preferredLocations = profile.preferredLocations || [];

  /* ==============================
     EXCLUDE APPLIED JOBS
  ============================== */
  const applied = await Application.find({ applicant: userId }).select(
    "job"
  );

  const appliedJobIds = applied.map((a) => a.job);

  /* ==============================
     BASE QUERY
  ============================== */
  const query = {
    status: "active",
    _id: { $nin: appliedJobIds },
  };

  const orConditions = [];

  if (skills.length) {
    orConditions.push({ skills: { $in: skills } });
  }

  if (preferredJobTypes.length) {
    orConditions.push({ jobType: { $in: preferredJobTypes } });
  }

  if (preferredLocations.length) {
    orConditions.push({
      $or: preferredLocations.map((loc) => ({
        $or: [
          { "location.city": new RegExp(loc, "i") },
          { "location.state": new RegExp(loc, "i") },
        ],
      })),
    });
  }

  if (profile.expectedSalary?.min) {
    orConditions.push({
      "salary.max": { $gte: profile.expectedSalary.min },
    });
  }

  if (orConditions.length) {
    query.$or = orConditions;
  }

  /* ==============================
     FETCH JOBS
  ============================== */
  const jobs = await Job.find(query)
    .populate("company", "name logo headquarters industry")
    .sort("-createdAt")
    .limit(20);

  /* ==============================
     SCORING SYSTEM
  ============================== */
  const scoredJobs = jobs.map((job) => {
    let score = 0;

    const matchedSkills = skills.filter((skill) =>
      job.skills?.some((s) =>
        s.toLowerCase().includes(skill.toLowerCase())
      )
    );

    score += matchedSkills.length * 10;

    if (preferredJobTypes.includes(job.jobType)) score += 15;

    if (
      preferredLocations.some(
        (loc) =>
          job.location?.city?.toLowerCase().includes(loc.toLowerCase()) ||
          job.location?.state?.toLowerCase().includes(loc.toLowerCase())
      )
    ) {
      score += 10;
    }

    if (
      preferredJobTypes.includes("remote") &&
      job.location?.remote
    ) {
      score += 20;
    }

    if (profile.expectedSalary?.min && job.salary?.max) {
      if (job.salary.max >= profile.expectedSalary.min) {
        score += 5;
      }
    }

    // freshness boost
    const daysOld =
      (Date.now() - new Date(job.createdAt)) /
      (1000 * 60 * 60 * 24);

    score += Math.max(0, 10 - daysOld);

    return {
      ...job.toObject(),
      relevanceScore: score,
      matchedSkills,
    };
  });

  /* ==============================
     SORT BY SCORE
  ============================== */
  scoredJobs.sort(
    (a, b) => b.relevanceScore - a.relevanceScore
  );

  /* ==============================
     FILL IF NOT ENOUGH RESULTS
  ============================== */
  if (scoredJobs.length < 10) {
    const fallbackJobs = await Job.find({
      status: "active",
      _id: {
        $nin: [...appliedJobIds, ...scoredJobs.map((j) => j._id)],
      },
    })
      .populate("company", "name logo headquarters")
      .sort("-isFeatured -createdAt")
      .limit(10 - scoredJobs.length);

    scoredJobs.push(
      ...fallbackJobs.map((j) => ({
        ...j.toObject(),
        relevanceScore: 0,
      }))
    );
  }

  return scoredJobs.slice(0, 15);
};