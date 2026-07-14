import Config from "react-native-config";

export type AppEnvironment = "development" | "staging" | "production";

export const APP_CONFIG = {
  ENVIRONMENT: (Config.APP_ENV as AppEnvironment) || "development",

  BASE_URL: Config.API_BASE_URL || "",

  API_KEY: Config.API_KEY || "",

  ENABLE_LOGS: Config.ENABLE_LOGS === "true",

  ENCRYPTION_KEY: Config.ENCRYPTION_KEY || "",

  REQUEST_TIMEOUT: 10000,
} as const;
