const Joi = require("joi");

/* ==============================
   APPLY JOB VALIDATION
============================== */
exports.applyJobValidation = (data) => {
  const schema = Joi.object({
    jobId: Joi.string()
      .length(24)
      .required()
      .messages({
        "string.base": "Job ID must be a string",
        "string.length": "Invalid Job ID format",
        "any.required": "Job ID is required",
      }),

    resumeId: Joi.string()
      .length(24)
      .required()
      .messages({
        "any.required": "Resume is required",
        "string.length": "Invalid resume ID",
      }),

    coverLetter: Joi.string()
      .max(2000)
      .allow("")
      .optional(),

    expectedSalary: Joi.number()
      .min(0)
      .optional()
      .messages({
        "number.base": "Expected salary must be a number",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};