// utils/errorHandler.ts
import { HTTP_ERRORS, DEFAULT_ERROR } from "@/const/httpErrors";

type MaybeAxios = { response?: { status?: number; data?: { code?: string; message?: string } } } | { status?: number; message?: string } | unknown;

export function getErrorMessageByCode(error: MaybeAxios): string {
  const status = (error as any)?.response?.status ?? (error as any)?.status;
  if (status && HTTP_ERRORS[status]) {
    return HTTP_ERRORS[status];
  }

  const message = (error as any)?.response?.data?.message ?? (error as any)?.message;
  if (message) return message as string;

  return DEFAULT_ERROR;
}
