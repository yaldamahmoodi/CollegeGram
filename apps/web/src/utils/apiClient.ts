import { ApiError } from "./ApiError";
import { getErrorMessage } from "./errorMessage";
import { toast } from "./toastManager";

export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new ApiError({
        message: getErrorMessage(response.status, data?.message),
        status: response.status,
        details: data,
      });
      toast.error(error.message);
      throw error;
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      toast.error(err.message);
      throw err;
    }

    const fallbackError = new ApiError({
      message: getErrorMessage(undefined, err.message),
    });
    toast.error(fallbackError.message);
    throw fallbackError;
  }
}
