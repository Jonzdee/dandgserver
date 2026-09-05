const Drink = require("../models/Drink");

const getDrinks = async (req, res) => {
    try {
        const drinks = await Drink.find({ available: true }).sort({
            category: 1,
            name: 1,
        });

        res.status(200).json({
            success: true,
            count: drinks.length,
            data: drinks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch drink items",
            error: error.message,
        });
    }
};

const getDrink = async (req, res) => {
    try {
        const drink = await Drink.findById(req.params.id);

        if (!drink) {
            return res.status(404).json({
                success: false,
                message: "Drink item not found",
            });
        }

        res.status(200).json({
            success: true,
            data: drink,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch drink item",
            error: error.message,
        });
    }
};

const getAllDrinksAdmin = async (req, res) => {
    try {
        const drinks = await Drink.find().sort({ category: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: drinks.length,
            data: drinks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch drink items",
            error: error.message,
        });
    }
};

const createDrink = async (req, res) => {
    try {
        const { name, category, price, available } = req.body;

        const drink = await Drink.create({ name, category, price, available });

        res.status(201).json({
            success: true,
            message: "Drink item created successfully",
            data: drink,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create drink item",
            error: error.message,
        });
    }
};

const updateDrink = async (req, res) => {
    try {
        const drink = await Drink.findById(req.params.id);

        if (!drink) {
            return res.status(404).json({
                success: false,
                message: "Drink item not found",
            });
        }

        Object.assign(drink, req.body);

        const updatedDrink = await drink.save();

        res.status(200).json({
            success: true,
            message: "Drink item updated successfully",
            data: updatedDrink,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update drink item",
            error: error.message,
        });
    }
};

const deleteDrink = async (req, res) => {
    try {
        const drink = await Drink.findByIdAndDelete(req.params.id);

        if (!drink) {
            return res.status(404).json({
                success: false,
                message: "Drink item not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Drink item deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete drink item",
            error: error.message,
        });
    }
};

module.exports = {
    getDrinks,
    getDrink,
    getAllDrinksAdmin,
    createDrink,
    updateDrink,
    deleteDrink,
};