const Room = require("../models/Room");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "dandg-hotel/rooms",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

// Get all available rooms
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ available: true }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch rooms",
            error: error.message,
        });
    }
};

// Get single room
const getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        res.status(200).json({
            success: true,
            data: room,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch room",
            error: error.message,
        });
    }
};


// Create room
const createRoom = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            available,
            wifi,
            breakfast,
            parking,
            airConditioning,
            pool,
            roomService,
        } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one room image is required",
            });
        }

        const uploadResults = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.buffer))
        );

        const images = uploadResults.map((result) => result.secure_url);

        const room = await Room.create({
            name,
            description,
            images,
            price,
            available,
            wifi,
            breakfast,
            parking,
            airConditioning,
            pool,
            roomService,
        });

        res.status(201).json({
            success: true,
            message: "Room created successfully",
            data: room,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create room",
            error: error.message,
        });
    }
};

// Update room
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        const { existingImages, ...rest } = req.body;

        Object.assign(room, rest);

        // existingImages: JSON string array of image URLs the admin kept
        // (any old image not included here is treated as removed).
        let keptImages = [];

        if (existingImages) {
            try {
                keptImages = JSON.parse(existingImages);
            } catch {
                keptImages = room.images; // fallback: keep all if malformed
            }
        }

        let newImages = [];

        if (req.files && req.files.length > 0) {
            const uploadResults = await Promise.all(
                req.files.map((file) => uploadToCloudinary(file.buffer))
            );

            newImages = uploadResults.map((result) => result.secure_url);
        }

        const finalImages = [...keptImages, ...newImages];

        if (finalImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one room image is required",
            });
        }

        room.images = finalImages;

        const updatedRoom = await room.save();

        res.status(200).json({
            success: true,
            message: "Room updated successfully",
            data: updatedRoom,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update room",
            error: error.message,
        });
    }
};

// Delete room
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Room deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete room",
            error: error.message,
        });
    }
};
const getAllRoomsAdmin = async (req, res) => {
    try {
        const rooms = await Room.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch rooms",
            error: error.message,
        });
    }
};
module.exports = {
    getRooms,
    getRoom,
    getAllRoomsAdmin,
    createRoom,
    updateRoom,
    deleteRoom,
};