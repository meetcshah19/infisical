import { apiRequest } from "@app/config/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TDeleteUserSecretDTO, UserSecret } from "./types";

export const useDeleteUserSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, TDeleteUserSecretDTO>({
    mutationFn: async ({ id }) => {
      const { data } = await apiRequest.delete(`/api/v3/user-secrets/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("user-secrets");
    }
  });
};

export const useCreateUserSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, UserSecret>({
    mutationFn: async ({
      secretName,
      secretValue,
      secretType
    }) => {
      const data = await apiRequest.post(`/api/v3/user-secrets`, { secretName, secretValue, secretType });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("user-secrets");
    }
  });
}

export const useUpdateUserSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, UserSecret>({
    mutationFn: async ({
      id,
      secretName,
      secretValue,
      secretType
    }) => {
      const data = await apiRequest.put(`/api/v3/user-secrets/${id}`, { secretName, secretValue, secretType });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("user-secrets");
    }
  });
}
