const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const Review = require("../models/Review");

// ⚠️ Use the same admin-auth middleware your adminRoutes already uses.
// Adjust this path/name to match your project.
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const submitLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5, // 5 submissions per IP per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many reviews submitted. Please try again later." },
});

/* ---------- Public ---------- */

// GET /api/reviews  -> approved reviews only
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find({ status: "approved" })
            .sort({ createdAt: -1 })
            .limit(50)
            .select("name location rating quote createdAt");
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not load reviews." });
    }
});

// POST /api/reviews  -> saved as "pending" until approved
router.post("/", submitLimiter, async (req, res) => {
    try {
        const { name, location, rating, quote, website } = req.body || {};

        // Honeypot: pretend success so bots don't retry
        if (website) return res.status(201).json({ ok: true });

        // Plain strings only (blocks NoSQL operator injection)
        if (
            typeof name !== "string" ||
            typeof quote !== "string" ||
            (location !== undefined && typeof location !== "string")
        ) {
            return res.status(400).json({ error: "Invalid input." });
        }

        const r = Number(rating);
        if (!Number.isInteger(r) || r < 1 || r > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5." });
        }

        await Review.create({
            name,
            location: location && location.trim() ? location : "Nigeria",
            rating: r,
            quote,
            status: "pending",
        });

        res.status(201).json({ ok: true });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: "Please check your name and review length." });
        }
        console.error(err);
        res.status(500).json({ error: "Could not save review try again." });
    }
});

/* ---------- Admin (moderation) ---------- */

router.get("/admin/all", protect, async (req, res) => {
    const filter = ["pending", "approved"].includes(req.query.status)
        ? { status: req.query.status }
        : {};
    res.json(await Review.find(filter).sort({ createdAt: -1 }));
});

// PATCH /api/reviews/admin/:id/approve
router.patch("/admin/:id/approve", protect, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const doc = await Review.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    doc ? res.json(doc) : res.status(404).json({ error: "Not found" });
});

// DELETE /api/reviews/admin/:id
router.delete("/admin/:id", protect, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const doc = await Review.findByIdAndDelete(req.params.id);
    doc ? res.json({ ok: true }) : res.status(404).json({ error: "Not found" });
});

module.exports = router;
