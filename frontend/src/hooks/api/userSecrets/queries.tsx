import { useQuery } from "@tanstack/react-query";

import { decryptAssymmetric } from "@app/components/utilities/cryptography/crypto";
import { apiRequest } from "@app/config/request";

import { UserSecret } from "./types";
import argon2 from "argon2-browser";

import Aes256Gcm from "@app/components/utilities/cryptography/aes-256-gcm";

const decrypt = async (ciphertext: string, salt: string, iv: string, tag: string) => {
  const PRIVATE_KEY = localStorage.getItem("PRIVATE_KEY");
  if (!PRIVATE_KEY) {
    throw new Error("Private Key missing");
  }
  const hash = await argon2.hash({
    pass: PRIVATE_KEY,
    salt,
    type: argon2.ArgonType.Argon2id,
    mem: 65536,
    time: 3,
    parallelism: 1,
    hashLen: 32
  });

  return Aes256Gcm.decrypt({ ciphertext, secret: Buffer.from(hash.hash), iv, tag });
}

const fetchUserSecrets = async () => {
  const { data } = await apiRequest.get<{ userSecrets: UserSecret[] }>(
    "/api/v3/user-secrets");
  const privateKey = localStorage.getItem("PRIVATE_KEY");
  if (!privateKey) {
    throw new Error("Private key not found");
  }
  console.log("data", data);
  for (const userSecret of data) {
    userSecret.secretValue = await decrypt(userSecret.secretValue, userSecret.salt, userSecret.iv, userSecret.tag);
    console.log("userSecret.secretValue", userSecret.secretValue);
  }
  return data;
};

export const useGetUserSecrets = () => {
  return useQuery({
    queryKey: ["userSecrets"],
    queryFn: () => fetchUserSecrets(),
  });
};
