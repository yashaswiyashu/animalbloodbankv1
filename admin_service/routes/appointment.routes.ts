// routes/appointmentRoutes.js
import express from "express";
import { getAllAppointments, getAllAppointmentsBooked, getAllAppointmentsCompleted } from "../controllers/appointment.controller";

const router = express.Router();

router.get("/appointments-admin", getAllAppointments);
router.get("/appointments-completed", getAllAppointmentsCompleted);
router.get("/appointments-booked", getAllAppointmentsBooked);
export default router;
