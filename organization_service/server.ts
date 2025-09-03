import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/dbConfig";
import cookieParser from "cookie-parser";
import organisationHospitals from './routes/organisation.hospital.routes';
import messageRoutes from './routes/description.organisation.routes';
import imageRoutes from './routes/organisation.image.route';
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
app.use("/api/hospitals",organisationHospitals);
app.use('/api/description', messageRoutes);
app.use("/api", imageRoutes);


const PORT = process.env.PORT || 5004;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));