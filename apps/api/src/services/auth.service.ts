import {AuthRepository} from "../repositories/auth.repository.ts";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import env from "../../env.ts";
import type {insertUserZodSchema} from "../db/models/user.model.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import {ElasticClient} from "./elasticClient.service.ts";
import {UserSearchService} from "./UserSearchService.ts";
import OTPService from "./otp.service.ts";
import VerificationService from "./verification.service.ts";
import emailService from "./email.service.ts";
import type {ForgotPasswordDTO, ResetPasswordDTO, VerifyOTPDTO} from "../dtos/forgot-password.dto.ts";
import type {EmailVerificationDTO, ResendVerificationDTO} from "../dtos/email-verification.dto.ts";
import { BlockRepository } from "../repositories/block.repository.ts";

const elasticClient = new ElasticClient();
const blockRepository = new BlockRepository();
const userSearchService = new UserSearchService(elasticClient, blockRepository);

export class AuthService {

    private readonly authRepository: AuthRepository;
    private otpService: OTPService | null = null;
    private verificationService: VerificationService | null = null;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    private async getOTPService(): Promise<OTPService> {
        if (!this.otpService) {
            this.otpService = await OTPService.getInstance();
        }
        return this.otpService;
    }

    private async getVerificationService(): Promise<VerificationService> {
        if (!this.verificationService) {
            this.verificationService = await VerificationService.getInstance();
        }
        return this.verificationService;
    }


    async register(user: insertUserZodSchema) {
        const userByEmail = await this.authRepository.findByEmail(user.email);
        const userByUsername = await this.authRepository.findByUsername(user.username);

        if (userByEmail || userByUsername) {
            throw new ValidationError("DUPLICATE_CREDENTIALS");
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.authRepository.createUser({
            ...user,
            password: hashedPassword,
            emailVerified: false,
        });

        if(newUser) {
            try {
                await userSearchService.indexUser(newUser);
            } catch (err) {
                console.error(`Failed to index new user ${newUser._id} in ES:`, err);
            }

            // Send email verification
            try {
                await this.sendEmailVerification(newUser.email, newUser._id.toString(), newUser.username);
            } catch (error) {
                console.error('Failed to send email verification:', error);
                // Don't fail registration if email sending fails, but log the error
            }
        }

        return {
            message: "User registered successfully. Please check your email to verify your account.",
            userId: newUser._id,
            email: newUser.email
        };
    }

    async login(inputUsername: string, inputPassword: string) {

        const user = await this.authRepository.findByUsername(inputUsername);

        if (!user) {
            throw new NotFoundError("NOT_FOUND_USER");
        }

        const {_id, password, username, email} = user;

        const comparePassword = await bcrypt.compare(inputPassword, password);
        if (!comparePassword) {
            throw new ValidationError("INVALID_CREDENTIALS");
        }
        const accessToken = jwt.sign({
                _id,
                username,
                email,
            }, env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
            });

        return {accessToken, userId: _id};
    }


    async logout() {
        return {message: "User logged out successfully"};
    }

    async forgotPassword(data: ForgotPasswordDTO) {
        const { email } = data;
        
        // Check if user exists
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            // For security, don't reveal if email exists or not
            return { message: "If the email exists, a password reset code has been sent." };
        }

        try {
            // Generate OTP
            const otpService = await this.getOTPService();
            const otp = await otpService.generatePasswordResetOTP(email, user._id.toString());
            
            // Send email
            const emailSent = await emailService.sendPasswordResetEmail(email, otp, user.username);
            
            if (!emailSent) {
                throw new ValidationError("EMAIL_SEND_FAILED", "Failed to send password reset email");
            }

            return { 
                message: "If the email exists, a password reset code has been sent.",
                expiresIn: 300 // 5 minutes
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            console.error('Error in forgot password:', error);
            throw new ValidationError("FORGOT_PASSWORD_FAILED", "Failed to process password reset request");
        }
    }

    async verifyOTP(data: VerifyOTPDTO) {
        const { email, otp } = data;
        
        try {
            const otpService = await this.getOTPService();
            const verification = await otpService.verifyPasswordResetOTP(email, otp);
            
            if (!verification.valid) {
                throw new ValidationError("INVALID_OTP", "Invalid or expired OTP");
            }

            return { 
                valid: true, 
                message: "OTP verified successfully",
                userId: verification.userId 
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            console.error('Error verifying OTP:', error);
            throw new ValidationError("OTP_VERIFICATION_FAILED", "Failed to verify OTP");
        }
    }

    async resetPassword(data: ResetPasswordDTO) {
        const { email, otp, newPassword } = data;
        
        try {
            // Verify OTP first
            const otpService = await this.getOTPService();
            const verification = await otpService.verifyPasswordResetOTP(email, otp);
            
            if (!verification.valid) {
                throw new ValidationError("INVALID_OTP", "Invalid or expired OTP");
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Update user password
            const updated = await this.authRepository.updatePassword(verification.userId!, hashedPassword);
            
            if (!updated) {
                throw new ValidationError("PASSWORD_UPDATE_FAILED", "Failed to update password");
            }

            // Clean up OTP data
            await otpService.cleanupOTP(email);

            return { 
                message: "Password has been reset successfully" 
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            console.error('Error resetting password:', error);
            throw new ValidationError("PASSWORD_RESET_FAILED", "Failed to reset password");
        }
    }

    async sendEmailVerification(email: string, userId: string, username: string) {
        try {
            const verificationService = await this.getVerificationService();
            const { otp, verificationLink, qrCode } = await verificationService.generateEmailVerificationOTP(email, userId);
            
            const emailSent = await emailService.sendEmailVerificationEmail(email, otp, username, verificationLink, qrCode);
            
            if (!emailSent) {
                throw new ValidationError("EMAIL_VERIFICATION_FAILED", "Failed to send email verification");
            }

            return {
                message: "Email verification sent successfully",
                expiresIn: 1800 // 30 minutes
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            console.error('Error sending email verification:', error);
            throw new ValidationError("EMAIL_VERIFICATION_FAILED", "Failed to send email verification");
        }
    }

    async verifyEmail(data: EmailVerificationDTO) {
        const { email, otp } = data;
        
        try {
            const verificationService = await this.getVerificationService();
            const verification = await verificationService.verifyEmailVerificationOTP(email, otp);
            
            if (!verification.valid) {
                throw new ValidationError("INVALID_OTP", "Invalid or expired verification code");
            }

            // Update user's email verification status
            const updated = await this.authRepository.verifyEmail(verification.userId!);
            
            if (!updated) {
                throw new ValidationError("EMAIL_VERIFICATION_FAILED", "Failed to verify email");
            }

            // Clean up verification data
            await verificationService.cleanupVerification(email);

            return { 
                message: "Email verified successfully",
                verified: true
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            console.error('Error verifying email:', error);
            throw new ValidationError("EMAIL_VERIFICATION_FAILED", "Failed to verify email");
        }
    }

    async resendEmailVerification(data: ResendVerificationDTO) {
        const { email } = data;
        
        try {
            // Check if user exists
            const user = await this.authRepository.findByEmail(email);
            if (!user) {
                throw new ValidationError("NOT_FOUND_USER", "User not found");
            }

            // Check if email is already verified
            if (user.emailVerified) {
                throw new ValidationError("EMAIL_ALREADY_VERIFIED", "Email is already verified");
            }

            // Send new verification email
            await this.sendEmailVerification(email, user._id.toString(), user.username);

            return {
                message: "Email verification sent successfully",
                expiresIn: 1800 // 30 minutes
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            console.error('Error resending email verification:', error);
            throw new ValidationError("EMAIL_VERIFICATION_FAILED", "Failed to resend email verification");
        }
    }

}