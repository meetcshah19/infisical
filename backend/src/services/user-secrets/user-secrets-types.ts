export const USER_SECRET = {
  CARD : "card",
  LOGIN_CREDENTIALS : "login_credentials",
  NOTE : "note"
} as const;

// better way to use typescript enums
export type USER_SECRET_TYPE = typeof USER_SECRET[keyof typeof USER_SECRET];

export const USER_SECRET_VALUES = Object.values(USER_SECRET) as [USER_SECRET_TYPE, ...USER_SECRET_TYPE[]]