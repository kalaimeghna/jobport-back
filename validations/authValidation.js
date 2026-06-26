const Joi = require("joi");

/* ==============================
   REGISTER VALIDATION
============================== */
exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.base": "Name must be a string",
        "string.min": "Name must be at least 3 characters",
        "any.required": "Name is required",
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      }),

    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
      }),

    role: Joi.string()
      .valid("jobseeker", "employer")
      .required()
      .messages({
        "any.only": "Role must be either jobseeker or employer",
        "any.required": "Role is required",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

/* ==============================
   LOGIN VALIDATION
============================== */
exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

/* ==============================
   CHANGE PASSWORD VALIDATION
============================== */
exports.changePasswordValidation = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),

    newPassword: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.min": "New password must be at least 6 characters",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

/* ==============================
   FORGOT PASSWORD VALIDATION
============================== */
exports.forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};

/* ==============================
   RESET PASSWORD VALIDATION
============================== */
exports.resetPasswordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};