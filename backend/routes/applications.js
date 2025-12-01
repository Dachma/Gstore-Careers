import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();
const DATA_FILE = path.resolve("data", "applications.json");

router.get("/", async (req, res) => {
  try {
    let applications = [];

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
      search,
      page = "1",
      limit = "10",
    } = req.query;

    if (vacancyId) {
      result = result.filter((app) => app.vacancyId === vacancyId);
    }

    if (from) {
      const fromDate = new Date(from);
      result = result.filter((app) => new Date(app.createdAt) >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      result = result.filter((app) => new Date(app.createdAt) <= toDate);
    }

    if (search) {
      const text = search.toLowerCase();
      result = result.filter(
        (app) =>
          (app.name && app.name.toLowerCase().includes(text)) ||
          (app.email && app.email.toLowerCase().includes(text))
      );
    }

    if (sort === "date_asc") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "date_desc") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "name_asc") {
      result.sort((a, b) =>
        a.name.trim().localeCompare(b.name.trim(), "en", {
          sensitivity: "base",
        })
      );
    } else if (sort === "name_desc") {
      result.sort((a, b) =>
        b.name.trim().localeCompare(a.name.trim(), "en", {
          sensitivity: "base",
        })
      );
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);

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
