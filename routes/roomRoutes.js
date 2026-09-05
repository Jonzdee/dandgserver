const express = require("express");

const {
    getRooms,
    getRoom,
    getAllRoomsAdmin,
    createRoom,
    updateRoom,
    deleteRoom,
} = require("../controllers/roomController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// Admin
router.get("/admin/all", protect, getAllRoomsAdmin);

// Public routes
router.get("/", getRooms);

router.get("/:id", getRoom);

// Admin routes
router.post("/", protect, upload.array("images"), createRoom);
router.put("/:id", protect, upload.array("images"), updateRoom);

router.delete("/:id", protect, deleteRoom);

module.exports = router;