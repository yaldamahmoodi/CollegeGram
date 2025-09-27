import { HTTP_ERRORS, DEFAULT_ERROR } from "@/const/httpErrors";

export function getErrorMessage(status?: number, fallback?: string): string {
  if (!status) return fallback || DEFAULT_ERROR;
  return HTTP_ERRORS[status] || fallback || DEFAULT_ERROR;
}
