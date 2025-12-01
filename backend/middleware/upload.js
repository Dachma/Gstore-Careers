import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = "uploads/resumes";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .toLowerCase()
      .slice(0, 60);
    cb(null, `${timestamp}-${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const limits = {
  fileSize: 6 * 1024 * 1024,
};

export const upload = multer({ storage, fileFilter, limits });
export const UPLOAD_DIR_PATH = UPLOAD_DIR;
