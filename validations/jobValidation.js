const Joi = require("joi");

/* ==============================
   CREATE JOB VALIDATION
============================== */
exports.createJobValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(150)
      .required()
      .messages({
        "any.required": "Job title is required",
      }),

    description: Joi.string()
      .min(20)
      .required()
      .messages({
        "any.required": "Job description is required",
      }),

    category: Joi.string()
      .min(2)
      .max(100)
      .required(),

    jobType: Joi.string()
      .valid("full-time", "part-time", "remote", "internship")
      .required()
      .messages({
        "any.only":
          "Job type must be full-time, part-time, remote, or internship",
      }),

    experienceLevel: Joi.string()
      .valid("fresher", "junior", "mid", "senior", "lead")
      .required(),

    company: Joi.string()
      .length(24)
      .required()
      .messages({
        "string.length": "Invalid company ID",
      }),

    skills: Joi.array()
      .items(Joi.string())
      .min(1)
      .required(),

    salary: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
    }).optional(),

    location: Joi.object({
      city: Joi.string().allow(""),
      state: Joi.string().allow(""),
      country: Joi.string().allow(""),
      remote: Joi.boolean(),
    }).optional(),

    isFeatured: Joi.boolean().optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

/* ==============================
   UPDATE JOB VALIDATION
============================== */
exports.updateJobValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(150),

    description: Joi.string().min(20),

    category: Joi.string().min(2).max(100),

    jobType: Joi.string().valid(
      "full-time",
      "part-time",
      "remote",
      "internship"
    ),

    experienceLevel: Joi.string().valid(
      "fresher",
      "junior",
      "mid",
      "senior",
      "lead"
    ),

    skills: Joi.array().items(Joi.string()),

    salary: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
    }),

    location: Joi.object({
      city: Joi.string().allow(""),
      state: Joi.string().allow(""),
      country: Joi.string().allow(""),
      remote: Joi.boolean(),
    }),

    status: Joi.string().valid("active", "closed", "draft"),
  });

  return schema.validate(data, { abortEarly: false });
};

/* ==============================
   JOB STATUS VALIDATION
============================== */
exports.jobStatusValidation = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("active", "closed", "draft")
      .required(),
  });

  return schema.validate(data);
};