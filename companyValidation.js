const Joi = require("joi");

/* ==============================
   CREATE COMPANY VALIDATION
============================== */
exports.createCompanyValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.base": "Company name must be a string",
        "any.required": "Company name is required",
      }),

    description: Joi.string()
      .min(10)
      .max(2000)
      .required()
      .messages({
        "any.required": "Company description is required",
      }),

    industry: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        "any.required": "Industry is required",
      }),

    size: Joi.string()
      .valid("1-10", "11-50", "51-200", "201-500", "500+")
      .optional()
      .messages({
        "any.only": "Invalid company size range",
      }),

    headquarters: Joi.string()
      .max(200)
      .optional(),

    website: Joi.string()
      .uri()
      .allow("")
      .optional()
      .messages({
        "string.uri": "Website must be a valid URL",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

/* ==============================
   UPDATE COMPANY VALIDATION
============================== */
exports.updateCompanyValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100),

    description: Joi.string().min(10).max(2000),

    industry: Joi.string().min(2).max(100),

    size: Joi.string().valid("1-10", "11-50", "51-200", "201-500", "500+"),

    headquarters: Joi.string().max(200),

    website: Joi.string().uri().allow(""),
  });

  return schema.validate(data, { abortEarly: false });
};

/* ==============================
   COMPANY LOGO VALIDATION
============================== */
exports.companyLogoValidation = (file) => {
  if (!file) {
    return {
      error: "Logo file is required",
    };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      error: "Only JPG, JPEG, PNG files are allowed",
    };
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return {
      error: "File size must be less than 5MB",
    };
  }

  return { error: null };
};