const express = require("express");

const {
    getDrinks,
    getDrink,
    getAllDrinksAdmin,
    createDrink,
    updateDrink,
    deleteDrink,
} = require("../controllers/drinkController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Admin
router.get("/admin/all", protect, getAllDrinksAdmin);

// Public routes
router.get("/", getDrinks);
router.get("/:id", getDrink);

// Admin routes
router.post("/", protect, createDrink);
router.put("/:id", protect, updateDrink);
router.delete("/:id", protect, deleteDrink);

module.exports = router;