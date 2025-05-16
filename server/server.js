import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import uploadRoutes from "./routes/cvUploadRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // <--- ADD THIS LINE to handle form data
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN // Or your frontend's actual origin
}));

// Serve static files from the uploads directory - ADD THIS SECTION
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/uploads', uploadRoutes); // <--- ADD THIS LINE

// Use custom error handler - should be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));