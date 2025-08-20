import { Documentation } from "@/interfaces/Documentation";
import { ApiError } from "@/lib/ApiError";
import { getSpecificDocument } from "@/service/getSpecificDocument";
import { useQuery } from "@tanstack/react-query";

export const useSpecificDocs = (slug: string, version: string) => {
  return useQuery<Documentation, ApiError>({
    queryKey: ["documentation", slug, version],
    queryFn: () => getSpecificDocument(slug, version),
    enabled: !!version,
  });
};
