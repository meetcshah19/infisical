export type UserSecret = {
  id: string;
  secretName: string;
  secretValue: string;
  secretType: "card" | "login_credentials" | "note";
  iv: string;
  tag: string;
}

export type TDeleteUserSecretDTO = {
  id: string;
}
