// backend/middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ensure upload dirs exist
const UPLOAD_DIR = 'uploads/resumes';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// filename helper: safe timestamp + original name
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    // keep extension and use sanitized original name
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .toLowerCase()
      .slice(0, 60);
    cb(null, `${timestamp}-${base}${ext}`);
  },
});

// file filter: only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

// size limit (example: 6 MB)
const limits = {
  fileSize: 6 * 1024 * 1024,
};

export const upload = multer({ storage, fileFilter, limits });
export const UPLOAD_DIR_PATH = UPLOAD_DIR;
