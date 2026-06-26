const sendEmail = require("../utils/sendEmail");

/* ==============================
   GENERIC EMAIL SENDER
============================== */
exports.send = async ({ email, subject, html }) => {
  return await sendEmail({
    email,
    subject,
    html,
  });
};

/* ==============================
   WELCOME EMAIL
============================== */
exports.sendWelcomeEmail = async (user) => {
  return await sendEmail({
    email: user.email,
    subject: "Welcome to Job Portal",
    html: `
      <h2>Welcome ${user.name} 🎉</h2>
      <p>Thanks for joining our job portal platform.</p>
    `,
  });
};

/* ==============================
   EMAIL VERIFICATION
============================== */
exports.sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  return await sendEmail({
    email: user.email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify your account:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `,
  });
};

/* ==============================
   PASSWORD RESET EMAIL
============================== */
exports.sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  return await sendEmail({
    email: user.email,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire soon.</p>
    `,
  });
};

/* ==============================
   APPLICATION STATUS EMAIL
============================== */
exports.sendApplicationStatusEmail = async (application, status, note) => {
  return await sendEmail({
    email: application.applicant.email,
    subject: `Application Update - ${application.job.title}`,
    html: `
      <h2>Application Status Updated</h2>
      <p>Your application for <b>${application.job.title}</b> is now:</p>
      <h3>${status}</h3>
      ${note ? `<p>Note: ${note}</p>` : ""}
    `,
  });
};