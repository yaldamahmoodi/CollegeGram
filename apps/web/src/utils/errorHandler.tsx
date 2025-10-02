// utils/errorHandler.ts
import { HTTP_ERRORS, DEFAULT_ERROR } from "@/const/httpErrors";

export function getErrorMessageByCode(error: any): string {
  if (error?.status && HTTP_ERRORS[error.status]) {
    return HTTP_ERRORS[error.status];
  }

  if (error?.message) return error.message;

  return DEFAULT_ERROR;
}
