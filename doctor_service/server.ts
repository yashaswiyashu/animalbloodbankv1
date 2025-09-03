import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/dbConfig";
import cookieParser from "cookie-parser";
import appointmentRoutes from "./routes/doctor.routes";
import feedbackRoutes from './routes/feedback.routes';
import bookingRoutes from "./routes/appointment.route";
import consultationFeeRoutes from './routes/consultationFee.routes';
import bloodRequestRoutes from './routes/bloodRequest.routes'

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
app.use("/api/doctor", appointmentRoutes);
app.use('/api', feedbackRoutes);
app.use("/api/appointment", bookingRoutes);
// app.use('/api/animals', animalRoutes);
app.use('/api/consultation-fee', consultationFeeRoutes);
app.use('/api/bloodrequest', bloodRequestRoutes);


const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));