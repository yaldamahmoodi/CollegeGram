// utils/ApiError.ts
export interface ApiErrorOptions {
  message: string;
  status?: number;
  details?: unknown;
}

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor({ message, status, details }: ApiErrorOptions) {
    super(message || "خطای ناشناخته‌ای رخ داده است.");
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
