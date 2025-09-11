import type { ErrorCode } from "./catalogue.errors.ts";
import { APIError } from "./api.errors.ts";

export class ValidationError extends APIError {
  constructor(
    message: ErrorCode,
    details?: { path: string; message: string }[] | string | null
  ) {
    super(message, 400, details);
  }
}
