import express from 'express';
import paymentRoutes from './routes/payment.route';
import paymentRefund from './routes/payment.route';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_URL, // Adjust this to your frontend URL
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use("/api/v1", paymentRoutes);
app.use('/api/payment', paymentRefund); 
export default app;
