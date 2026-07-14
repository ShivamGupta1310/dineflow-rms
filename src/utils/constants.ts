export enum StorageKeysType {
  GLOBAL_CONTEXT = "global-context",
  OWNER_LOGIN = "owner-login",
  OWNER_ACCESS_CODE = "owner_accesscode",
  RESTAURANT_ACCESS_CODE = "restaurant_accesscode",
  TOKEN = "token",
  USER = "user",
}

export const User_Role = {
  CAPTAIN: "Captain",
};

export const StorageKeys = {
  GLOBAL_CONTEXT: StorageKeysType.GLOBAL_CONTEXT,
  OWNER_LOGIN: StorageKeysType.OWNER_LOGIN,
  OWNER_ACCESS_CODE: StorageKeysType.OWNER_ACCESS_CODE,
  RESTAURANT_ACCESS_CODE: StorageKeysType.RESTAURANT_ACCESS_CODE,
  TOKEN: StorageKeysType.TOKEN,
  USER: StorageKeysType.USER,
};

export const Date_Format = {
  DD_MM_YY: "DD/MM/YY",
  TIME_12_HOUR: "hh:mm A",
  DD_MM_YY_HH_MM_A: "DD/MM/YY [at] h:mm A",
  Do_MMM_YY: "Do MMM YY",
  YYYY_MM_DD: "YYYY-MM-DD",
  HH_mm_ss: "HH:mm:ss",
  DD_MMM_YYYY: "DD MMM YYYY",
  DD_MMMM_YYYY: "DD MMMM, YYYY",
  HH_mm: "HH:mm",
  hh_mm: "hh:mm",
} as const;

export const Common_Values = {
  EMPTY_PLACEHOLDER: "--",
  SELECT_ALL_ID: "all",
  COUNTRY_CODE: 91,
} as const;

export enum TableGridItemStatus {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  RESERVED = "reserved",
  READY_TO_PAY = "ready to pay",
}

export enum ReservationStatus {
  Pending = "pending",
  NeedConfirmation = "need_confirmation",
  Confirmed = "confirmed",
  Reserved = "reserved",
  Cancelled = "cancelled",
}

export const PAYMENT_METHODS = {
  CASH: "CASH",
} as const;

export const Locales = {
  EN_US: "en-US",
  EN_GB: "en-GB",
  EN_IN: "en-IN",
} as const;
export const LRI = "\u2066";
export const PDI = "\u2069";

export const STATUS_ALL = "all";

export enum TableOrderStatus {
  ORDER_PLACED = "order_placed",
  PREPARING = "preparing",
  READY = "ready",
  SERVED = "served",
}
