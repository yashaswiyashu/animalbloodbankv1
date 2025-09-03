import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/dbConfig";
import cookieParser from "cookie-parser";
import enthusistHospital from './routes/hospital.enthusist.router';
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

// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/enthusist',enthusistHospital);
// app.use('/api/animals', animalRoutes);


const PORT = process.env.PORT || 5006;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));