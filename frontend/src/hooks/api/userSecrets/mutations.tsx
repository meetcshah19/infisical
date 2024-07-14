import { apiRequest } from "@app/config/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TDeleteUserSecretDTO, TUserSecretUpdateDTO, UserSecret } from "./types";
import crypto from "crypto";
import Aes256Gcm from "@app/components/utilities/cryptography/aes-256-gcm";
import argon2 from "argon2-browser";

export const encrypt = async (secretValue: string) => {
  const PRIVATE_KEY = localStorage.getItem("PRIVATE_KEY");
  if (!PRIVATE_KEY) {
    throw new Error("Private Key missing");
  }
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = await argon2.hash({
    pass: PRIVATE_KEY,
    salt,
    type: argon2.ArgonType.Argon2id,
    mem: 65536,
    time: 3,
    parallelism: 1,
    hashLen: 32
  });
  const { ciphertext, iv, tag } = Aes256Gcm.encrypt({ text: secretValue, secret: Buffer.from(hash.hash) });
  return { ciphertext, iv, tag, salt };
}

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
    }: {
      secretName: string;
      secretValue: string;
      secretType: "card" | "login_credentials" | "note";
    }
    ) => {
      const { ciphertext, iv, tag, salt } = await encrypt(secretValue);
      const data = await apiRequest.post("/api/v3/user-secrets", {
        secretName,
        secretValue: ciphertext,
        secretType,
        iv,
        tag,
        salt
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("user-secrets");
    }
  });
}

export const useUpdateUserSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, TUserSecretUpdateDTO>({
    mutationFn: async ({
      id,
      secretName,
      secretValue,
      secretType
    }) => {
      const { ciphertext, iv, tag, salt } = await encrypt(secretValue);
      console.log("ciphertext", ciphertext);
      console.log("secretValue",secretValue);
      console.log("secretType", secretType);
      const data = await apiRequest.put(`/api/v3/user-secrets/${id}`, { secretName, secretValue: ciphertext, secretType, iv, tag, salt });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("user-secrets");
    }
  });
}
