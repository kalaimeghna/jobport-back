import crypto from "crypto";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";
import sendEmail from "../utils/sendEmail.js";

/* ================= REGISTER ================= */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return next(new ErrorResponse("Please fill all fields", 400));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorResponse("User already exists", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide email and password", 400)
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res, "Login successful");
  } catch (error) {
    next(error);
  }
};

/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("company");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return next(
        new ErrorResponse("Current password is incorrect", 401)
      );
    }

    user.password = newPassword;

    await user.save();

    sendTokenResponse(user, 200, res, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({
      validateBeforeSave: false,
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res, next) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorResponse("Invalid or expired token", 400)
      );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

/* ================= VERIFY EMAIL ================= */
export const verifyEmail = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
};