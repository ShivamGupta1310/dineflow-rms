import i18n from '@localization/i18n';
import { decryptJson, encryptJson } from '@services/api/encryption';
import { removeItem } from '@services/storage/appStorage';
import { store } from '@store/index';
import { logout } from '@store/slices/authSlice';
import { isInternetConnected } from '@utils';
import axios, {
  AxiosAdapter,
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Alert } from 'react-native';
import { APP_CONFIG } from '@config/env';
import { STRINGS } from '@constants/strings';
import Config from 'react-native-config';

declare module 'axios' {
  // Allow passing a custom flag on request config.
  // (Keeping it here avoids needing a separate `*.d.ts` include.)
  interface AxiosRequestConfig {
    isEncrypt?: boolean;
  }
  interface InternalAxiosRequestConfig {
    isEncrypt?: boolean;
  }
}

let lastNoInternetAlertAtMs = 0;
const NO_INTERNET_ALERT_THROTTLE_MS = 5000;
const axiosInstance: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.BASE_URL || STRINGS.BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    apikey: Config.API_KEY,
  },
});

const logRequestBodyDevOnly = (body: unknown) => {
  if (typeof __DEV__ === 'undefined' || !__DEV__) return;

  const sensitiveKeyPattern = /(pass(word)?|token|authorization|secret|apiKey|key)/i;

  let safeBody: unknown = body;
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const obj = body as Record<string, unknown>;
    safeBody = Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, sensitiveKeyPattern.test(k) ? '[REDACTED]' : v])
    );
  }

  console.log('[API body]', safeBody ?? body ?? null, '[APP_CONFIG]', APP_CONFIG);
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const hasInternet = await isInternetConnected();

    if (!hasInternet) {
      const now = Date.now();
      if (now - lastNoInternetAlertAtMs > NO_INTERNET_ALERT_THROTTLE_MS) {
        lastNoInternetAlertAtMs = now;
        Alert.alert(i18n.t('common.noInternet.title'), i18n.t('common.noInternet.message'));
      }

      throw new axios.CanceledError('No internet connection');
    }

    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = (config.method || 'get').toLowerCase();
    const isWriteMethod = method === 'post' || method === 'put' || method === 'patch';
    let bodyForLog: unknown = config.params;
    if (isWriteMethod) {
      // Encrypt only when caller passes `{ isEncrypt: true }` in request config.
      const shouldEncrypt = Boolean(config.isEncrypt);
      bodyForLog = config.data;

      if (shouldEncrypt) {
        const cipherText = encryptJson(config.data, APP_CONFIG.ENCRYPTION_KEY);
        config.data = { data: cipherText };
      }
    }
    console.log('[API_CONFIG]',config);
    logRequestBodyDevOnly(bodyForLog);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const isEncrypt = Boolean((response.config as InternalAxiosRequestConfig | undefined)?.isEncrypt);
    if (isEncrypt) {
      const responseData = response.data;

      // Support either:
      // - server returns encrypted string
      // - server returns `{ data: "<cipherText>" }`
      if (typeof responseData === 'string') {
        response.data = decryptJson(responseData, APP_CONFIG.ENCRYPTION_KEY);
      } else if (responseData && typeof responseData === 'object' && typeof responseData.data === 'string') {
        response.data = {
          ...(responseData as Record<string, unknown>),
          data: decryptJson(responseData.data as string, APP_CONFIG.ENCRYPTION_KEY),
        };
      }
    }
    console.log('[RESPONSE]',response);
    return response;
  },
  (error: AxiosError) => {
    console.log('[ERROR]',error);
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized
      Promise.all([removeItem('token'), removeItem('user')]).finally(() => {
        store.dispatch(logout());
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export type ApiRequestConfig<D = unknown> = AxiosRequestConfig<D> & { isEncrypt?: boolean };

type MockOptions = {
  status?: number;
  delayMs?: number;
};

// For local/dev testing: return a mocked axios response (optionally encrypted)
// while still running through interceptors.
export const createMockAdapter = (
  payload: unknown,
  options?: MockOptions
): AxiosAdapter => {
  const status = options?.status ?? 200;
  const delayMs = options?.delayMs ?? 0;

  return async (config) => {
    const internalConfig = config as InternalAxiosRequestConfig;
    const shouldEncrypt = Boolean((internalConfig as any)?.isEncrypt);

    const responseData = shouldEncrypt ? { data: encryptJson(payload, APP_CONFIG.ENCRYPTION_KEY) } : payload;

    if (delayMs > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }

    return Promise.resolve({
      data: responseData,
      status,
      statusText: 'OK',
      headers: {},
      config,
      request: null,
    });
  };
};

export const apiGet = <T = unknown>(url: string, config?: ApiRequestConfig) =>
  axiosInstance.get<T>(url, config);

export const apiPost = <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) =>
  axiosInstance.post<T>(url, data, config);

export const apiPut = <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) =>
  axiosInstance.put<T>(url, data, config);

export const apiPatch = <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) =>
  axiosInstance.patch<T>(url, data, config);

export const apiDelete = <T = unknown>(url: string, config?: ApiRequestConfig) =>
  axiosInstance.delete<T>(url, config);
