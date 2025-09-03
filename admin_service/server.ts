import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/dbConfig";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import animalRoutes from "./routes/farmer.routes";
import appointmentRoute from "./routes/appointment.routes";
import paymentRoute from "./routes/payment.routes";
import donorRoute from "./routes/donor.routes";
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
app.use("/api/auth", authRoutes);
app.use("/api/animal", animalRoutes);
app.use("/api/appointments", appointmentRoute)
app.use('/api/payments', paymentRoute);
app.use('/api/donor', donorRoute);


const PORT = process.env.PORT || 5007;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));