declare module 'react-native-config' {
  interface NativeConfig {
    APP_ENV: string;
    API_KEY: string;
    API_BASE_URL: string;
    ENABLE_LOGS: string;
    ENCRYPTION_KEY: string;
  }

  const Config: NativeConfig;
  export default Config;
}
