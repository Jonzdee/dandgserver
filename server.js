const dotenv = require("dotenv");
dotenv.config();



const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const foodRoutes = require("./routes/foodRoutes");
const drinkRoutes = require("./routes/drinkRoutes");
const reviewRoutes = require("./routes/reviewRoutes");


connectDB();

const app = express();

// Security
app.use(helmet());

// CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://www.dandghotel.com",
];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
// Parse JSON
app.set("trust proxy", 1);      // right after `const app = express();`
app.use(express.json({ limit: "10kb" }));   // replaces your current express.json()

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "D&G Hotel Server is running",
    });
});
app.use("/api/admin", adminRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/reviews", reviewRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});