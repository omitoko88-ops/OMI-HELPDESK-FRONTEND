import { Documentation } from "@/interfaces/Documentation";
import { Version } from "@/interfaces/Version";
import { ApiError } from "@/lib/ApiError";
import { getVersions } from "@/service/getVersions";
import { useQuery } from "@tanstack/react-query";

export const useVersion = () => {
  return useQuery<Version[], ApiError>({
    queryKey: [`versions`],
    queryFn: async () => {
      const res = await getVersions();
      return res;
    },
  });
};
