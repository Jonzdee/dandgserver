const express = require("express");

const {
    getFoods,
    getFood,
    getAllFoodsAdmin,
    createFood,
    updateFood,
    deleteFood,
} = require("../controllers/foodController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Admin
router.get("/admin/all", protect, getAllFoodsAdmin);

// Public routes
router.get("/", getFoods);
router.get("/:id", getFood);

// Admin routes
router.post("/", protect, createFood);
router.put("/:id", protect, updateFood);
router.delete("/:id", protect, deleteFood);

module.exports = router;