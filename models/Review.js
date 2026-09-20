const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
        location: { type: String, trim: true, maxlength: 60, default: "Nigeria" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        quote: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
        status: { type: String, enum: ["pending", "approved"], default: "pending", index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);