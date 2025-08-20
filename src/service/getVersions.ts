import { ApiResponse } from "@/interfaces/ApiResponse";
import { Documentation } from "@/interfaces/Documentation";
import { Version } from "@/interfaces/Version";
import { api } from "@/lib/axios";
import { handleApiResponse, parsingApiResponse } from "@/lib/handleApiResponse";

export const getVersions = async (): Promise<Version[]> => {
  try {
    const res = await api.get<ApiResponse<Version[]>>(
      `/documentations/versions`
    );
    handleApiResponse(res.data, "Gagal get version, silakan coba lagi");
    console.log("berhasil1");
    if (!res.data.data) {
      throw new Error("Belum ada list version yang ditemukan");
    }
    console.log("berhasil");
    return res.data.data;
  } catch (error) {
    console.log("error");
    throw parsingApiResponse(error, "Gagal get version, silakan coba lagi");
  }
};
