const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        images: {
            type: [String],
            required: true,
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "At least one image is required",
            },
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },

        available: {
            type: Boolean,
            default: true,
        },

        wifi: {
            type: Boolean,
            default: false,
        },

        breakfast: {
            type: Boolean,
            default: false,
        },

        parking: {
            type: Boolean,
            default: false,
        },

        airConditioning: {
            type: Boolean,
            default: false,
        },

        pool: {
            type: Boolean,
            default: false,
        },

        roomService: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;