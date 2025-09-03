import express from "express";
import { getAllPayments, getTotalPayments } from "../controllers/payment.controller";

const router = express.Router();

router.get("/payments-admin", getAllPayments);
router.get("/total-revenue", getTotalPayments);

export default router;
