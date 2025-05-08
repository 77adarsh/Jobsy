import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js"; // Import error handler

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173" // Or your frontend's actual origin
}));

//  Routes
app.use('/api/auth', authRoutes);

//  Use custom error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));