import express from 'express';
import { getConsultationFee, setConsultationFee } from '../controllers/consultationFee';

const router = express.Router();

router.get('/:doctorId', getConsultationFee);
router.post('/', setConsultationFee);

export default router;
