import express from 'express';
import { getRazorpayKey, paymentVerification, processPayment, refundPayment } from '../controllers/payment.controller';
import { protectFarmer } from '../middlewares/auth.middleware';
import { authorizeRoleFarmer } from '../../animal_enth_service/middlewares/auth.middleware';
const router = express.Router();

router.route("/razorpay/payment").post(protectFarmer, authorizeRoleFarmer("farmer"), processPayment);
router.route("/razorpay/getkey").get( protectFarmer, authorizeRoleFarmer("farmer"), getRazorpayKey);
router.route("/razorpay/paymentVerification").post(protectFarmer, authorizeRoleFarmer("farmer"), paymentVerification);
router.post("/refund", refundPayment);
export default router;