import { Router } from 'express';
import { submitFeedback, getFeedbackByPraniAadhar } from '../controllers/feedback.controller';
import { upload } from '../middlewares/upload.middleware';
import { authorizeRoles, protect} from "../middlewares/auth.middleware";

const router = Router();

router.post('/feedback', upload.single('file'),protect,authorizeRoles("doctor"), submitFeedback);
router.get('/feedback/:praniAadharNumber',protect, authorizeRoles("doctor"), getFeedbackByPraniAadhar);

export default router;
