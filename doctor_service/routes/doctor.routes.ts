import express from "express";
import { authorizeRoles, protect } from "../middlewares/auth.middleware";
import { createAvailableSlot, getAvailableSlotsForDate, getAvailableSlotsForDoctor, removeAvailableSlot } from "../controllers/doc.slots.controller";

const router = express.Router();

router.post("/create-slot", protect, authorizeRoles("doctor"), createAvailableSlot);
router.get("/slots/:doctorId", getAvailableSlotsForDoctor);
router.get("/slots/:doctorId/:start_date", getAvailableSlotsForDate);
router.post('/remove-slot', protect, authorizeRoles("doctor"), removeAvailableSlot);




export default router;

