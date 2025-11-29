import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { upload } from '../middleware/upload.js';

const router = express.Router();

const DATA_FILE = path.resolve('data', 'applications.json');

router.post(
  '/',
  upload.single('resume'),
  async (req, res) => {
    try {
      const { name, email, phone, vacancyId } = req.body;

      // ✅ backend validation
      if (!name || !email || !phone || !vacancyId || !req.file) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const newApplication = {
        id: Date.now(),               // OK for JSON storage
        name,
        email,
        phone,
        vacancyId,
        resumeFile: req.file.filename,
        createdAt: new Date().toISOString(),
      };

      let applications = [];

      try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        applications = JSON.parse(data);
      } catch (err) {
        // file does not exist yet → start empty
        if (err.code !== 'ENOENT') throw err;
      }

      applications.push(newApplication);

      await fs.writeFile(
        DATA_FILE,
        JSON.stringify(applications, null, 2)
      );

      res.status(201).json({
        message: 'Application submitted successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;