import { ApiResponse } from "@/interfaces/ApiResponse";
import { Documentation } from "@/interfaces/Documentation";
import { useQuery } from "@tanstack/react-query";

export const useSpecificDocs = ($slug: string) => {
  return useQuery<Documentation>({
    queryKey: [`documentation-${$slug}`],
    queryFn: fetchSpecificDocument,
  });
};
