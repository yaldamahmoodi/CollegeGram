import type { ErrorCode } from "./catalogue.errors.js";

export class APIError extends Error {
  status: number;
  code: ErrorCode;
  details?: string | { path: string; message: string }[] | null;

  constructor(code: ErrorCode, status: number, details?:  string | { path: string; message: string }[] | null) {
    super(code);
    this.code = code;
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
