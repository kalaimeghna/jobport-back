import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false, // ✅ fixed
      default: null,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },

    salary: {
      type: Number,
      required: [true, "Salary is required"],
    },

    experience: {
      type: Number,
      default: 0,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Freelance"],
      default: "Full-Time",
    },

    workMode: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid"],
      default: "Onsite",
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    vacancies: {
      type: Number,
      default: 1,
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes for faster queries ───────────────────────────────────────────────
jobSchema.index({ title: "text", description: "text", skills: "text" });
jobSchema.index({ status: 1, applicationDeadline: 1 });
jobSchema.index({ employer: 1 });
jobSchema.index({ company: 1 });

// ─── Virtual: check if job is expired ────────────────────────────────────────
jobSchema.virtual("isExpired").get(function () {
  if (!this.applicationDeadline) return false;
  return new Date() > this.applicationDeadline;
});

// ─── Virtual: check if job is accepting applications ─────────────────────────
jobSchema.virtual("isOpen").get(function () {
  return this.status === "Open" && !this.isExpired;
});

// ─── Auto-close jobs that have passed their deadline ─────────────────────────
jobSchema.pre("save", async function () {
  if (this.applicationDeadline && new Date() > this.applicationDeadline) {
    this.status = "Closed";
  }
});

// ─── Static: get all open jobs with optional filters ─────────────────────────
jobSchema.statics.getOpenJobs = function (filters = {}) {
  return this.find({
    status: "Open",
    ...filters,
    $or: [
      { applicationDeadline: null },
      { applicationDeadline: { $gt: new Date() } },
    ],
  });
};

// ─── Method: increment applicants count ──────────────────────────────────────
jobSchema.methods.addApplicant = async function () {
  this.applicantsCount += 1;
  await this.save();
};

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;