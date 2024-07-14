import { apiRequest } from "@app/config/request";
import { UserSecret } from "./types";
import { useQuery } from "@tanstack/react-query";

const fetchUserSecrets = async () => {
  const { data } = await apiRequest.get<{ userSecrets: UserSecret[] }>(
    `/api/v3/user-secrets`);
  return data;
};

export const useGetUserSecrets = () => {
  return useQuery({
    queryKey: ["userSecrets"],
    queryFn: () => fetchUserSecrets(),
  });
};
