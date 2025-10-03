import RedisService from './redis.service.ts';
import { ValidationError } from '../utils/errors/validation.errors.ts';
import QRCode from 'qrcode';
import crypto from 'crypto';
import env from '../../env.ts';

interface VerificationData {
  email: string;
  userId: string;
  timestamp: number;
  type: 'email_verification' | 'password_reset';
}

class VerificationService {
  private redisService: RedisService;
  private static instance: VerificationService;
  private readonly VERIFICATION_EXPIRY_SECONDS = 1800; // 30 minutes
  private readonly MAX_ATTEMPTS = 5;
  private readonly ATTEMPT_WINDOW_SECONDS = 3600; // 1 hour

  private constructor() {
    // Initialize will be called in getInstance
  }

  static async getInstance(): Promise<VerificationService> {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
      await VerificationService.instance.initialize();
    }
    return VerificationService.instance;
  }

  private async initialize(): Promise<void> {
    this.redisService = await RedisService.getInstance();
  }

  /**
   * Generate a secure OTP
   */
  private generateOTP(): string {
    const randomNum = crypto.randomInt(100000, 999999);
    return randomNum.toString();
  }

  /**
   * Generate verification link with OTP
   */
  private generateVerificationLink(email: string, otp: string, type: string): string {
    // Handle CORS_ORIGIN which might be comma-separated
    const corsOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());
    const baseUrl = corsOrigins[0] || 'http://localhost:3000';
    return `${baseUrl}/verify-email?email=${encodeURIComponent(email)}&otp=${otp}&type=${type}`;
  }

  /**
   * Generate QR code for verification link
   */
  async generateQRCode(verificationLink: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(verificationLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new ValidationError("QR_CODE_GENERATION_FAILED", "Failed to generate QR code");
    }
  }

  /**
   * Generate and store email verification OTP
   */
  async generateEmailVerificationOTP(email: string, userId: string): Promise<{
    otp: string;
    verificationLink: string;
    qrCode: string;
  }> {
    try {
      // Check if there's already an active verification for this email
      const existingKey = `verification:email:${email}`;
      const existingVerification = await this.redisService.get(existingKey);
      
      if (existingVerification) {
        // Check if the existing verification is still valid
        const verificationData: VerificationData = JSON.parse(existingVerification);
        const timeElapsed = Date.now() - verificationData.timestamp;
        const timeRemaining = this.VERIFICATION_EXPIRY_SECONDS * 1000 - timeElapsed;
        
        if (timeRemaining > 0) {
          throw new ValidationError("OTP_ALREADY_SENT", `Please wait ${Math.ceil(timeRemaining / 1000)} seconds before requesting a new verification code`);
        }
      }

      // Check rate limiting (basic implementation)
      const attemptKey = `verification:attempts:${email}`;
      const currentAttempts = await this.redisService.get(attemptKey);
      
      if (currentAttempts && parseInt(currentAttempts) >= this.MAX_ATTEMPTS) {
        throw new ValidationError("RATE_LIMIT_EXCEEDED", "Too many verification requests. Please try again later.");
      }

      // Generate new OTP
      const otp = this.generateOTP();
      const verificationData: VerificationData = {
        email,
        userId,
        timestamp: Date.now(),
        type: 'email_verification'
      };

      // Generate verification link
      const verificationLink = this.generateVerificationLink(email, otp, 'email_verification');

      // Generate QR code
      const qrCode = await this.generateQRCode(verificationLink);

      // Store verification data and OTP value in Redis
      await Promise.all([
        this.redisService.set(existingKey, JSON.stringify(verificationData), this.VERIFICATION_EXPIRY_SECONDS),
        this.storeOTPValue(email, otp)
      ]);

      // Store attempt count for rate limiting
      const attempts = currentAttempts ? parseInt(currentAttempts) + 1 : 1;
      await this.redisService.set(attemptKey, attempts.toString(), this.ATTEMPT_WINDOW_SECONDS);

      return {
        otp,
        verificationLink,
        qrCode
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Error generating email verification OTP:', error);
      throw new ValidationError("OTP_GENERATION_FAILED", "Failed to generate verification code");
    }
  }

  /**
   * Verify email verification OTP
   */
  async verifyEmailVerificationOTP(email: string, otp: string): Promise<{ valid: boolean; userId?: string }> {
    try {
      const verificationKey = `verification:email:${email}`;
      const storedVerificationData = await this.redisService.get(verificationKey);

      if (!storedVerificationData) {
        return { valid: false };
      }

      const verificationData: VerificationData = JSON.parse(storedVerificationData);
      const timeElapsed = Date.now() - verificationData.timestamp;
      const isExpired = timeElapsed > this.VERIFICATION_EXPIRY_SECONDS * 1000;

      if (isExpired) {
        // Clean up expired verification
        await this.redisService.del(verificationKey);
        return { valid: false };
      }

      // Get stored OTP
      const expectedOTP = await this.getStoredOTP(email);
      
      if (otp === expectedOTP) {
        // OTP is valid, return user ID and mark as used
        await this.redisService.del(verificationKey);
        await this.redisService.del(`verification:value:${email}`);
        return { valid: true, userId: verificationData.userId };
      }

      return { valid: false };
    } catch (error) {
      console.error('Error verifying email verification OTP:', error);
      return { valid: false };
    }
  }

  /**
   * Get the stored OTP
   */
  private async getStoredOTP(email: string): Promise<string> {
    const otpValueKey = `verification:value:${email}`;
    const storedOTP = await this.redisService.get(otpValueKey);
    return storedOTP || '';
  }

  /**
   * Store the actual OTP value
   */
  private async storeOTPValue(email: string, otp: string): Promise<void> {
    const otpValueKey = `verification:value:${email}`;
    await this.redisService.set(otpValueKey, otp, this.VERIFICATION_EXPIRY_SECONDS);
  }


  /**
   * Clean up verification data
   */
  async cleanupVerification(email: string): Promise<void> {
    try {
      const verificationKey = `verification:email:${email}`;
      const otpValueKey = `verification:value:${email}`;
      const attemptKey = `verification:attempts:${email}`;
      
      await Promise.all([
        this.redisService.del(verificationKey),
        this.redisService.del(otpValueKey),
        this.redisService.del(attemptKey)
      ]);
    } catch (error) {
      console.error('Error cleaning up verification:', error);
    }
  }

  /**
   * Get remaining time for verification expiry
   */
  async getVerificationExpiryTime(email: string): Promise<number> {
    try {
      const verificationKey = `verification:email:${email}`;
      const storedVerificationData = await this.redisService.get(verificationKey);
      
      if (!storedVerificationData) {
        return 0;
      }

      const verificationData: VerificationData = JSON.parse(storedVerificationData);
      const timeElapsed = Date.now() - verificationData.timestamp;
      const timeRemaining = this.VERIFICATION_EXPIRY_SECONDS * 1000 - timeElapsed;
      
      return Math.max(0, Math.ceil(timeRemaining / 1000));
    } catch (error) {
      console.error('Error getting verification expiry time:', error);
      return 0;
    }
  }
}

export default VerificationService;
