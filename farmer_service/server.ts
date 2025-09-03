import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/dbConfig";
import cookieParser from "cookie-parser";
import animalRoutes from "./routes/farmer.routes";
import bookingRoutes from "./routes/appointment.route";
import feedbackRoutes from './routes/feedback.routes';
import bloodTypingRoutes from './routes/bloodTyping.route'
import path from 'path';
dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.CORS_URL,  // your frontend origin
  credentials: true,                // allow credentials (cookies, auth headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/animal", animalRoutes);
app.use("/api/appointment", bookingRoutes);
app.use('/api', feedbackRoutes);
app.use('/api/bloodtyping', bloodTypingRoutes);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));