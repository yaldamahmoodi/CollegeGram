import RedisService from './redis.service.ts';
import { ValidationError } from '../utils/errors/validation.errors.ts';

interface OTPData {
  email: string;
  userId: string;
  timestamp: number;
}

class OTPService {
  private redisService: RedisService;
  private static instance: OTPService;
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_SECONDS = 300; // 5 minutes
  private readonly MAX_ATTEMPTS = 3;
  private readonly ATTEMPT_WINDOW_SECONDS = 900; // 15 minutes

  private constructor() {
   
  }

  static async getInstance(): Promise<OTPService> {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService();
      await OTPService.instance.initialize();
    }
    return OTPService.instance;
  }

  private async initialize(): Promise<void> {
    this.redisService = await RedisService.getInstance();
  }

  /**
   * Generate a random OTP
   */
  private generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < this.OTP_LENGTH; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  /**
   * Generate and store OTP for password reset
   */
  async generatePasswordResetOTP(email: string, userId: string): Promise<string> {
    try {
      // Check if there's already an active OTP for this email
      const existingOTPKey = `otp:password_reset:${email}`;
      const existingOTP = await this.redisService.get(existingOTPKey);
      
      if (existingOTP) {
        // Check if the existing OTP is still valid
        const otpData: OTPData = JSON.parse(existingOTP);
        const timeElapsed = Date.now() - otpData.timestamp;
        const timeRemaining = this.OTP_EXPIRY_SECONDS * 1000 - timeElapsed;
        
        if (timeRemaining > 0) {
          throw new ValidationError("OTP_ALREADY_SENT", `Please wait ${Math.ceil(timeRemaining / 1000)} seconds before requesting a new OTP`);
        }
      }

      // Check rate limiting
      await this.checkRateLimit(email);

      // Generate new OTP
      const otp = this.generateOTP();
      const otpData: OTPData = {
        email,
        userId,
        timestamp: Date.now()
      };

      // Store OTP data and value in Redis
      await Promise.all([
        this.redisService.set(existingOTPKey, JSON.stringify(otpData), this.OTP_EXPIRY_SECONDS),
        this.storeOTPValue(email, otp)
      ]);

      // Store attempt count for rate limiting
      const attemptKey = `otp:attempts:${email}`;
      const currentAttempts = await this.redisService.get(attemptKey);
      const attempts = currentAttempts ? parseInt(currentAttempts) + 1 : 1;
      await this.redisService.set(attemptKey, attempts.toString(), this.ATTEMPT_WINDOW_SECONDS);

      return otp;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Error generating OTP:', error);
      throw new ValidationError("OTP_GENERATION_FAILED", "Failed to generate OTP");
    }
  }

  /**
   * Verify OTP for password reset
   */
  async verifyPasswordResetOTP(email: string, otp: string): Promise<{ valid: boolean; userId?: string }> {
    try {
      const otpKey = `otp:password_reset:${email}`;
      const storedOTPData = await this.redisService.get(otpKey);

      if (!storedOTPData) {
        return { valid: false };
      }

      const otpData: OTPData = JSON.parse(storedOTPData);
      const timeElapsed = Date.now() - otpData.timestamp;
      const isExpired = timeElapsed > this.OTP_EXPIRY_SECONDS * 1000;

      if (isExpired) {
        // Clean up expired OTP
        await this.redisService.del(otpKey);
        return { valid: false };
      }

      // For security, we don't store the actual OTP, we store a hash
      // In a real implementation, you would hash the OTP before storing
      // For this demo, we'll use a simple approach
      const expectedOTP = await this.getStoredOTP(email);
      
      if (otp === expectedOTP) {
        // OTP is valid, return user ID and mark as used
        await this.redisService.del(otpKey);
        return { valid: true, userId: otpData.userId };
      }

      return { valid: false };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { valid: false };
    }
  }

  /**
   * Get the stored OTP (in a real implementation, this would be hashed)
   * For demo purposes, we'll store it in a separate key
   */
  private async getStoredOTP(email: string): Promise<string> {
    const otpValueKey = `otp:value:${email}`;
    const storedOTP = await this.redisService.get(otpValueKey);
    return storedOTP || '';
  }

  /**
   * Store the actual OTP value (in production, this should be hashed)
   */
  private async storeOTPValue(email: string, otp: string): Promise<void> {
    const otpValueKey = `otp:value:${email}`;
    await this.redisService.set(otpValueKey, otp, this.OTP_EXPIRY_SECONDS);
  }

  /**
   * Check rate limiting for OTP requests
   */
  private async checkRateLimit(email: string): Promise<void> {
    const attemptKey = `otp:attempts:${email}`;
    const currentAttempts = await this.redisService.get(attemptKey);
    
    if (currentAttempts && parseInt(currentAttempts) >= this.MAX_ATTEMPTS) {
      throw new ValidationError("RATE_LIMIT_EXCEEDED", "Too many OTP requests. Please try again later.");
    }
  }

  /**
   * Clean up OTP data (call this after successful password reset)
   */
  async cleanupOTP(email: string): Promise<void> {
    try {
      const otpKey = `otp:password_reset:${email}`;
      const otpValueKey = `otp:value:${email}`;
      const attemptKey = `otp:attempts:${email}`;
      
      await Promise.all([
        this.redisService.del(otpKey),
        this.redisService.del(otpValueKey),
        this.redisService.del(attemptKey)
      ]);
    } catch (error) {
      console.error('Error cleaning up OTP:', error);
    }
  }

  /**
   * Get remaining time for OTP expiry
   */
  async getOTPExpiryTime(email: string): Promise<number> {
    try {
      const otpKey = `otp:password_reset:${email}`;
      const storedOTPData = await this.redisService.get(otpKey);
      
      if (!storedOTPData) {
        return 0;
      }

      const otpData: OTPData = JSON.parse(storedOTPData);
      const timeElapsed = Date.now() - otpData.timestamp;
      const timeRemaining = this.OTP_EXPIRY_SECONDS * 1000 - timeElapsed;
      
      return Math.max(0, Math.ceil(timeRemaining / 1000));
    } catch (error) {
      console.error('Error getting OTP expiry time:', error);
      return 0;
    }
  }
}

export default OTPService;
