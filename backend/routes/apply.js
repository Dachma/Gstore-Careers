import express from 'express';
import fs from 'fs';
import path from 'path';
import { upload } from '../middleware/upload.js';

const router = express.Router();

const DATA_FILE = 'data/applications.json';

router.post(
  '/',
  upload.single('resume'), // 👈 'resume' must match frontend FormData key
  (req, res) => {
    try {
      const { name, email, phone, vacancyId } = req.body;

      // ✅ basic validation (backend always validates)
      if (!name || !email || !phone || !vacancyId || !req.file) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newApplication = {
        id: Date.now(),
        name,
        email,
        phone,
        vacancyId,
        resumeFile: req.file.filename,
        createdAt: new Date().toISOString(),
      };

      // ✅ read existing data (or initialize)
      const existing = fs.existsSync(DATA_FILE)
        ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
        : [];

      existing.push(newApplication);

      fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));

      res.status(201).json({
        message: 'Application submitted successfully',
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;