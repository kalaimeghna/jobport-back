import multer from "multer";
import path from "path";
import fs from "fs";

/* ================= CREATE BASE UPLOAD DIR ================= */
const BASE_DIR = "uploads";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(BASE_DIR);

/* ================= STORAGE CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = BASE_DIR;

    if (file.fieldname === "resume") {
      folder += "/resumes";
    } else if (file.fieldname === "profilePicture") {
      folder += "/profile";
    } else if (file.fieldname === "logo") {
      folder += "/company";
    } else {
      folder += "/others";
    }

    ensureDir(folder);
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`;

    cb(null, uniqueName);
  },
});

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const resumeTypes = [".pdf", ".doc", ".docx"];
  const imageTypes = [".jpg", ".jpeg", ".png", ".webp"];

  // Resume validation
  if (file.fieldname === "resume") {
    if (!resumeTypes.includes(ext)) {
      return cb(
        new Error("Only PDF, DOC, DOCX files are allowed for resumes"),
        false
      );
    }
  }

  // Image validation
  if (
    ["profilePicture", "logo"].includes(file.fieldname)
  ) {
    if (!imageTypes.includes(ext)) {
      return cb(
        new Error("Only JPG, JPEG, PNG, WEBP images are allowed"),
        false
      );
    }
  }

  cb(null, true);
};

/* ================= MULTER CONFIG ================= */
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/* ================= EXPORT ================= */
export default upload;