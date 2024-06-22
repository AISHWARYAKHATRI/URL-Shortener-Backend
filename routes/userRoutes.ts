import express from "express";
import { loginUser, registerUser } from "../controllers/userController";
import { sendOtp, verifyOtp } from "../controllers/otpController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/email/otp", sendOtp);
router.post("/otp/verify", verifyOtp);

export default router;
