import { z } from "zod";

export const emailVerificationDTO = z.object({
  email: z.email("Invalid email format"),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must contain only numbers")
});

export const resendVerificationDTO = z.object({
  email: z.email("Invalid email format")
});

export type EmailVerificationDTO = z.infer<typeof emailVerificationDTO>;
export type ResendVerificationDTO = z.infer<typeof resendVerificationDTO>;
