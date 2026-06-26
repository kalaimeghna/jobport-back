import Application from "../models/application.js"; // ✅ lowercase
import Job from "../models/job.js";                  // ✅ lowercase
import ErrorResponse from "../utils/errorResponse.js";

/* ================= APPLY FOR A JOB ================= */
export const applyForJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorResponse("Job not found", 404));
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (alreadyApplied) {
      return next(new ErrorResponse("Already applied for this job", 400));
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      resume: req.body.resume,
      coverLetter: req.body.coverLetter,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET MY APPLICATIONS ================= */
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate({
        path: "job",
        select: "title location salary",
        populate: {
          path: "company",       // ✅ fixed nested populate
          select: "name logo",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET JOB APPLICATIONS (EMPLOYER / ATS) ================= */
export const getJobApplications = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorResponse("Job not found", 404));
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email skills experience resume")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE APPLICATION STATUS ================= */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "shortlisted", "rejected", "accepted"];

    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse("Invalid status value", 400));
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return next(new ErrorResponse("Application not found", 404));
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated",
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= DELETE APPLICATION ================= */
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return next(new ErrorResponse("Application not found", 404));
    }

    // Only applicant or admin can delete
    if (
      application.applicant.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new ErrorResponse("Not authorized", 403));
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET SINGLE APPLICATION ================= */
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "name email skills resume");

    if (!application) {
      return next(new ErrorResponse("Application not found", 404));
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};