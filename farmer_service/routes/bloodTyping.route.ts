import express from 'express';
import { createRequest, getLabRequests } from '../controllers/bloodTyping.controller';

const router = express.Router();

router.post('/request', createRequest);
router.get('/lab/:labId', getLabRequests);

export default router;
