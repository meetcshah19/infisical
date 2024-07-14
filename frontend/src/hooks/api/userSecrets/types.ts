export type UserSecret = {
  id: string;
  secretName: string;
  secretValue: string;
  secretType: "card" | "login_credentials" | "note";
  salt: string;
  iv: string;
  tag: string;
}

export type TUserSecretUpdateDTO = {
  id: string;
  secretName: string;
  secretValue: string;
  secretType: "card" | "login_credentials" | "note";
}

export type TDeleteUserSecretDTO = {
  id: string;
}

export enum UserSecretType {
  CARD = "card",
  LOGIN_CREDENTIALS = "login_credentials",
  NOTE = "note"
}
