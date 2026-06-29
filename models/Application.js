import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Store resume file URL
    resume: {
      type: String,
      default: "",
      trim: true,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "interviewed",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from applying to the same job twice
applicationSchema.index(
  { job: 1, applicant: 1 },
  { unique: true }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default Application;