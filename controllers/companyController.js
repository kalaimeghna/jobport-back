import Company from "../models/Company.js";
import Job from "../models/job.js";
import ErrorResponse from "../utils/errorResponse.js";

/* ===========================================
   CREATE COMPANY
=========================================== */
export const createCompany = async (req, res, next) => {
  try {
    const {
      companyName,
      description,
      industry,
      website,
      email,
      phone,
      location,
      companySize,
      foundedYear,
      socialLinks,
    } = req.body;

    const companyExists = await Company.findOne({ companyName });

    if (companyExists) {
      return next(new ErrorResponse("Company already exists", 400));
    }

    const company = await Company.create({
      companyName,
      description,
      industry,
      website,
      email,
      phone,
      location,
      companySize,
      foundedYear,
      socialLinks,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================================
   GET ALL COMPANIES
=========================================== */
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find()
      .populate("owner", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================================
   GET SINGLE COMPANY
=========================================== */
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("owner", "name email");

    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================================
   GET MY COMPANY
=========================================== */
export const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      owner: req.user._id,
    });

    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================================
   UPDATE COMPANY
=========================================== */
export const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }

    if (
      company.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new ErrorResponse("Not authorized", 403));
    }

    company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================================
   DELETE COMPANY
=========================================== */
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }

    if (
      company.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new ErrorResponse("Not authorized", 403));
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================================
   UPLOAD COMPANY LOGO
=========================================== */
export const uploadCompanyLogo = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }

    if (
      company.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new ErrorResponse("Not authorized", 403));
    }

    if (!req.file) {
      return next(new ErrorResponse("Please upload a logo", 400));
    }

    company.logo = req.file.path;

    await company.save();

    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================================
   GET COMPANY JOBS
=========================================== */
export const getCompanyJobs = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }

    const jobs = await Job.find({
      company: req.params.id,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};