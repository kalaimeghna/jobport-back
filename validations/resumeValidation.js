const Joi = require("joi");

/* ==============================
   RESUME METADATA VALIDATION
============================== */
exports.resumeValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(2)
      .max(150)
      .optional()
      .messages({
        "string.min": "Title must be at least 2 characters",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

/* ==============================
   FILE VALIDATION (UPLOAD)
============================== */
exports.resumeFileValidation = (file) => {
  if (!file) {
    return {
      error: "Resume file is required",
    };
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      error: "Only PDF, DOC, DOCX files are allowed",
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