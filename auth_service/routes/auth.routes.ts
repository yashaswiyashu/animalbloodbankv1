import express from "express";
import { register, login, logout, getUsersByRole , updateUser, deleteUser, getDoctors, getHospitals,getLabs } from "../controllers/auth.controller";
import { authorizeRoleFarmer, authorizeRoles, protect, protectFarmer } from "../middlewares/auth.middleware";
import { AuthRequest } from "../interfaces/user/user.reqType";
import { deleteFarmer, loginFarmer, registerFarmer, updateFarmer } from "../controllers/farmer.controller";
import upload from "../middlewares/upload";

const router = express.Router();

router.post("/register", upload.single("govt_id_image"), register);
router.post("/registerFarmer", registerFarmer);
router.post("/login", login);
router.post("/loginFarmer", loginFarmer);
router.get("/get-users/:role", protect, authorizeRoles("vendor"), getUsersByRole);
router.get("/get-doctors", protectFarmer, authorizeRoleFarmer("farmer"), getDoctors);
router.get("/get-hospitals", protectFarmer, authorizeRoleFarmer("farmer"), getHospitals);
router.get('/get-labs', getLabs);
router.get("/logout", logout);


export default router;
