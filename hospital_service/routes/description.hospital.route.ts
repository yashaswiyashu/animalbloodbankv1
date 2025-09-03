// routes/messageRoutes.ts
import express from 'express';
import { createMessage, getMessages, updateMessage, deleteMessage } from '../controllers/hospital.description';
import { authorizeRoles, protect} from "../middlewares/auth.middleware";

const router = express.Router();

router.post('/hospital', protect, authorizeRoles("hospital"), createMessage);
router.get('/hospital', getMessages);
router.put('/hospital/:id', protect, authorizeRoles("hospital"), updateMessage);
router.delete('/hospital/:id', protect, authorizeRoles("hospital"), deleteMessage);

export default router;
