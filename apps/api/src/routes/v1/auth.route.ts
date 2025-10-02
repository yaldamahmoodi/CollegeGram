import {Router} from "express";
import {bodyParser} from "../../middlewares/parsers.middleware.ts";
import {insertUserSchema} from "../../db/models/user.model.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts"
import {loginDTO} from "../../dtos/login.dto.ts";
import {forgotPasswordDTO, verifyOTPDTO, resetPasswordDTO} from "../../dtos/forgot-password.dto.ts";
import {emailVerificationDTO, resendVerificationDTO} from "../../dtos/email-verification.dto.ts";
import {initiator} from "../../initiator.ts";


const router = Router();
const authController = initiator.getAuthController();

router.post("/register", bodyParser(insertUserSchema), authController.register);
router.post("/login", bodyParser(loginDTO), authController.login);
router.post("/logout", authController.logout);

// Forgot Password Flow
router.post("/forgot-password", bodyParser(forgotPasswordDTO), authController.forgotPassword);
router.post("/verify-otp", bodyParser(verifyOTPDTO), authController.verifyOTP);
router.post("/reset-password", bodyParser(resetPasswordDTO), authController.resetPassword);

// Email Verification Flow
router.post("/verify-email", bodyParser(emailVerificationDTO), authController.verifyEmail);
router.post("/resend-verification", bodyParser(resendVerificationDTO), authController.resendEmailVerification);

router.use(errorHandler);

export default router;


