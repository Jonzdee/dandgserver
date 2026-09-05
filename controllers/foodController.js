const Food = require("../models/Food");

const getFoods = async (req, res) => {
    try {
        const foods = await Food.find({ available: true }).sort({
            category: 1,
            name: 1,
        });

        res.status(200).json({
            success: true,
            count: foods.length,
            data: foods,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food items",
            error: error.message,
        });
    }
};

const getFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        res.status(200).json({
            success: true,
            data: food,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food item",
            error: error.message,
        });
    }
};

const getAllFoodsAdmin = async (req, res) => {
    try {
        const foods = await Food.find().sort({ category: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: foods.length,
            data: foods,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food items",
            error: error.message,
        });
    }
};

const createFood = async (req, res) => {
    try {
        const { name, category, price, available } = req.body;

        const food = await Food.create({ name, category, price, available });

        res.status(201).json({
            success: true,
            message: "Food item created successfully",
            data: food,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create food item",
            error: error.message,
        });
    }
};

const updateFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        Object.assign(food, req.body);

        const updatedFood = await food.save();

        res.status(200).json({
            success: true,
            message: "Food item updated successfully",
            data: updatedFood,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update food item",
            error: error.message,
        });
    }
};

const deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Food item deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete food item",
            error: error.message,
        });
    }
};

module.exports = {
    getFoods,
    getFood,
    getAllFoodsAdmin,
    createFood,
    updateFood,
    deleteFood,
};