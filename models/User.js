import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      default: "jobseeker",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    education: {
      type: String,
      default: "",
      trim: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      default: undefined,
    },

    resetPasswordExpire: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;