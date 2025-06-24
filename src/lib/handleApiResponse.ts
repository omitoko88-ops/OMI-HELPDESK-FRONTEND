import { ApiResponse } from "@/interfaces/ApiResponse";
import axios from "axios";

export function parsingApiResponse(
  error: unknown,
  defaultMessage = "Terjadi kesalahan yang tidak diketahui"
): never {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    if (responseData && responseData.meta) {
      handleApiResponse(responseData, defaultMessage); // ini akan throw jika gagal
    }
  }

  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error(defaultMessage);
}

/**
 * Melempar error jika response.meta.success === false.
 */
export function handleApiResponse<T>(
  response: ApiResponse<T>,
  defaultMessage = "Terjadi kesalahan"
): ApiResponse<T> {
  if (!response.meta.success) {
    if (typeof response.meta.message === "string") {
      throw new Error(response.meta.message);
    }
    throw new Error(defaultMessage);
  }

  return response;
}
