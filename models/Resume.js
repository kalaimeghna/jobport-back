import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },

    fileUrl: {
      type: String,
      required: [true, "Resume URL is required"],
    },

    publicId: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      enum: ["pdf", "doc", "docx"],
      required: [true, "File type is required"],
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    isDefault: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one default resume per user
resumeSchema.index(
  { user: 1, isDefault: 1 },
  {
    unique: true,
    partialFilterExpression: { isDefault: true },
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;