import { z } from "zod";

export const forgotPasswordDTO = z.object({
  email: z.email("Invalid email format")
});

export const resetPasswordDTO = z.object({
  email: z.email("Invalid email format"),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must contain only numbers"),
  newPassword: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character")
});

export const verifyOTPDTO = z.object({
  email: z.email("Invalid email format"),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must contain only numbers")
});

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordDTO>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordDTO>;
export type VerifyOTPDTO = z.infer<typeof verifyOTPDTO>;
