import { ApiResponse } from "@/interfaces/ApiResponse";
import { Documentation } from "@/interfaces/Documentation";
import { api } from "@/lib/axios";
import { handleApiResponse, parsingApiResponse } from "@/lib/handleApiResponse";

export const getSpecificDocument = async (
  slug: string,
  version: string
): Promise<Documentation> => {
  try {
    const res = await api.post<ApiResponse<Documentation>>(`/specific-doc`, {
      slug: slug,
      version: version,
    });
    handleApiResponse(res.data, "Gagal get category, silakan coba lagi");
    if (!res.data.data) {
      throw new Error("Dokumen tidak ditemukan");
    }
    return res.data.data;
  } catch (error) {
    throw parsingApiResponse(error, "Gagal get category, silakan coba lagi");
  }
};
