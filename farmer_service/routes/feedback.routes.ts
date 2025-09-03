import { Router } from 'express';
import { getFeedbackByPraniAadhar } from '../controllers/feedback.controller';
import { protectFarmer, authorizeRoleFarmer} from "../middlewares/auth.middleware";
import { protect,authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/feedback/:praniAadharNumber',protectFarmer, authorizeRoleFarmer("farmer"), getFeedbackByPraniAadhar);
// router.get('/feedback/:praniAadharNumber',protect, authorizeRoles("doctor"), getFeedbackByPraniAadhar);

export default router;
