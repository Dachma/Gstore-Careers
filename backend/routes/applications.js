import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const DATA_FILE = path.resolve("data", "applications.json");

router.get("/", async (req, res) => {
  try {
    let applications = [];

    // ✅ read data safely
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      applications = JSON.parse(data);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    let result = [...applications];

    const {
      vacancyId,
      from,
      to,
      sort = "date_desc",
      page = 1,
      limit = 10,
    } = req.query;

    // ✅ filter by vacancy
    if (vacancyId) {
      result = result.filter(app => app.vacancyId === vacancyId);
    }

    // ✅ filter by date range
    if (from) {
      result = result.filter(app => new Date(app.createdAt) >= new Date(from));
    }

    if (to) {
      result = result.filter(app => new Date(app.createdAt) <= new Date(to));
    }

    // ✅ sorting
    if (sort === "date_asc") {
      result.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    if (sort === "date_desc") {
      result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // ✅ pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;

    const paginatedData = result.slice(startIndex, endIndex);

    res.json({
      data: paginatedData,
      page: pageNumber,
      limit: limitNumber,
      total: result.length,
      totalPages: Math.ceil(result.length / limitNumber),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
