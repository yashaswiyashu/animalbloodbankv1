// routes/messageRoutes.ts
import express from 'express';
import { createMessage, getMessages, updateMessage, deleteMessage } from '../controllers/description.organisation';
import { authorizeRoles, protect} from "../middlewares/auth.middleware";

const router = express.Router();

router.post('/', protect, authorizeRoles("organisation"), createMessage);
router.get('/',protect, authorizeRoles("organisation", "Animal Enthusiasts"), getMessages);
router.put('/:id', protect, authorizeRoles("organisation"), updateMessage);
router.delete('/:id', protect, authorizeRoles("organisation"), deleteMessage);

export default router;
