// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js"; // <--- ADD THIS LINE
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config(); // Make sure this is called early to load .env variables
connectDB();

const app = express();

app.use(express.json()); // To parse JSON request bodies
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN // Or your frontend's actual origin
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes); // <--- ADD THIS LINE

// Use custom error handler - should be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));