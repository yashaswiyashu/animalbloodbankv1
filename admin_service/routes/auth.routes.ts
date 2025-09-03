import express from "express";
import { register, login, logout, getUsersByRole , updateUser, deleteUser, getDoctors } from "../controllers/auth.controller";
import { authorizeRoleFarmer, authorizeRoles, protect, protectFarmer } from "../middlewares/auth.middleware";
import { AuthRequest } from "../interfaces/user/user.reqType";
import { deleteFarmer, loginFarmer, registerFarmer, updateFarmer } from "../controllers/farmer.controller";
import upload from "../middlewares/upload";

const router = express.Router();

router.post("/register", upload.single("govt_id_image"), register);
router.post("/registerFarmer", registerFarmer);
router.post("/login", login);
router.post("/loginFarmer", loginFarmer);
router.put('/user/:userId', protect, authorizeRoles("admin"), updateUser);
router.put('/farmer/:farmerId', protect, authorizeRoles("admin"), updateFarmer);
router.delete('/user/:userId', protect, authorizeRoles("admin"), deleteUser);
router.delete('/farmer/:farmerId', protect, authorizeRoles("admin"), deleteFarmer);
router.get("/get-users/:role", protect, authorizeRoles("admin"), getUsersByRole);

export default router;
