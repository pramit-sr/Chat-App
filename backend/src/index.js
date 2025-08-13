import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}))
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);

// Test endpoint to check if server is running
app.get("/api/test", (req, res) => {
    res.json({ message: "Server is running", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
    console.log("Environment check:", {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Missing",
        MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Missing",
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing"
    });
    connectDB();
} )