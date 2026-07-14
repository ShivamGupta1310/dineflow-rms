import { apiPost } from "@services/api/apiClient";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import i18n from "@localization/i18n";
import { API_ENDPOINTS } from "@constants/api";
import { showToast } from "@utils/toastHelper";
import { PersistedAppRole } from "@appTypes";
import { OWNER_ROLE, CAPTAIN_ROLE } from "@utils/authSession";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  ownerId: number | null;
  waiterUser: Record<string, unknown> | null;
  sessionId: string | null;
  loading: boolean;
  error: string | null;
  waiterList: WaiterStaff[];
  waiterListLoading: boolean;
  waiterListError: string | null;
  selectedWaiter: WaiterStaff | null;
  role: PersistedAppRole | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  ownerId: null,
  waiterUser: null,
  sessionId: null,
  loading: false,
  error: null,
  waiterList: [],
  waiterListLoading: false,
  waiterListError: null,
  selectedWaiter: null,
  role: null,
};

type HydrateAuthPayload = Pick<
  AuthState,
  "isAuthenticated" | "user" | "token" | "sessionId"
>;

export interface LoginAsyncPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  data?: {
    token?: string;
    user?: { name?: string };
  };
}

export interface VerifyOtpAsyncPayload {
  owner_id: number;
  otp: string;
  device_id: string;
  device_name: string;
  device_type: string;
  app_version: string;
}

export interface VerifyOtpResponse {
  success?: boolean;
  message?: string;
  session_id?: string;
  user?: Record<string, unknown>;
}

export interface SendOwnerOtpPayload {
  phone_number: string;
  country_code: number;
}

export interface SendOwnerOtpResponse {
  success: boolean;
  owner_id?: number;
  otp?: string;
  message?: string;
}

export interface WaiterStaff {
  staff_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  employee_code: string;
  role: string;
  shift_type: string;
  is_active: boolean;
  created_at: string;
  avatar: string;
}

export interface FetchWaiterListResponse {
  success?: boolean;
  message?: string;
  owner_id: number;
  staffs?: WaiterStaff[];
}

export interface FetchWaiterListPayload {
  passcode: number;
  role: string;
}

export interface VerifyWaiterPasscodePayload {
  owner_id: number;
  staff_id: number;
  passcode: string;
  role: string;
  device_id: string;
  device_name: string;
  device_type: string;
  app_version: string;
}

export interface VerifyWaiterPasscodeResponse {
  success?: boolean;
  message?: string;
  session_id?: string;
  user?: Record<string, unknown>;
}
export interface LogoutSessionPayload {
  session_id: string;
}

export interface LogoutSessionResponse {
  success?: boolean;
  message?: string;
}

const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    const lowerCaseMessage = error.message.toLowerCase();
    if (lowerCaseMessage.includes("internet")) {
      return i18n.t("common.noInternet.message");
    }
    return error.message;
  }

  return i18n.t("auth.login.errors.generic");
};

export const sendOwnerOtp = createAsyncThunk<
  SendOwnerOtpResponse,
  SendOwnerOtpPayload,
  { rejectValue: string }
>("auth/sendOwnerOtp", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiPost<SendOwnerOtpResponse>(
      API_ENDPOINTS.AUTH.SEND_OWNER_OTP,
      payload,
    );
    const response = res.data;
    const isOwnerFound =
      response.success === true &&
      response.message?.toLowerCase().includes("success");

    if (!isOwnerFound) {
      const message = response.message || i18n.t("auth.login.ownerNotFound");
      showToast("error", `${response.message}`, "");
      return rejectWithValue(message);
    }

    showToast("success", `${response.message}`, "");
    return response;
  } catch (err) {
    const message = getAuthErrorMessage(err);
    showToast("error", i18n.t("auth.login.errors.otpFailed"), message);
    return rejectWithValue(message);
  }
});

export const loginOwner = createAsyncThunk<
  LoginResponse,
  LoginAsyncPayload,
  { rejectValue: string }
>("auth/loginOwner", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiPost<LoginResponse>(
      "v1/rpc/generate_owner_otp",
      payload,
      {
        isEncrypt: false,
      },
    );
    return res.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    showToast("error", "Login failed", message);
    return rejectWithValue(message);
  }
});

export const verifyOwnerOtp = createAsyncThunk<
  VerifyOtpResponse,
  VerifyOtpAsyncPayload,
  { rejectValue: string }
>("auth/verifyOwnerOtp", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiPost<VerifyOtpResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OWNER_OTP,
      payload,
    );

    const response = res.data;
    const isOtpVerified =
      response.success === true &&
      Boolean(response.session_id) &&
      response.message?.toLowerCase().includes("success");

    if (!isOtpVerified) {
      const message =
        response.message || i18n.t("auth.verifyOtp.expiredOtpMsg");
      return rejectWithValue(message);
    }

    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : i18n.t("common.unknownError");
    return rejectWithValue(message);
  }
});

export const fetchWaiterList = createAsyncThunk<
  FetchWaiterListResponse,
  FetchWaiterListPayload,
  { rejectValue: string }
>("auth/fetchWaiterList", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiPost<FetchWaiterListResponse>(
      API_ENDPOINTS.AUTH.GET_STAFFS,
      payload,
    );
    const response = res.data;

    if (!response.success) {
      return rejectWithValue(response.message || i18n.t("common.unknownError"));
    }

    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : i18n.t("common.unknownError");
    return rejectWithValue(message);
  }
});

export const verifyWaiterPasscode = createAsyncThunk<
  VerifyWaiterPasscodeResponse,
  VerifyWaiterPasscodePayload,
  { rejectValue: string }
>("auth/verifyWaiterPasscode", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiPost<VerifyWaiterPasscodeResponse>(
      API_ENDPOINTS.AUTH.VERIFY_WAITER_PASSCODE,
      payload,
    );
    const response = res.data;

    if (!response.success) {
      return rejectWithValue(response.message || i18n.t("common.unknownError"));
    }

    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : i18n.t("common.unknownError");
    return rejectWithValue(message);
  }
});

export const logoutSession = createAsyncThunk<
  LogoutSessionResponse,
  LogoutSessionPayload,
  { rejectValue: string }
>("auth/logoutSession", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiPost<LogoutSessionResponse>(
      API_ENDPOINTS.AUTH.LOGOUT,
      payload,
    );
    const response = res.data;

    if (response.success !== true) {
      return rejectWithValue(response.message || i18n.t("common.unknownError"));
    }

    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : i18n.t("common.unknownError");
    return rejectWithValue(message);
  }
});

const resetSessionState = (state: AuthState) => {
  state.isAuthenticated = false;
  state.user = null;
  state.token = null;
  state.sessionId = null;
  state.error = null;
  state.waiterList = [];
  state.waiterListLoading = false;
  state.waiterListError = null;
  state.selectedWaiter = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setRole: (state, action: { payload: PersistedAppRole | null }) => {
      state.role = action.payload;
    },
    hydrateAuth: (state, action: PayloadAction<HydrateAuthPayload>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.sessionId = action.payload.sessionId;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: any; token: string }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.sessionId = null;
      state.error = null;
    },
    setOwnerId: (state, action: PayloadAction<number | null>) => {
      state.ownerId = action.payload;
    },
    setWaiterUser: (
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) => {
      state.waiterUser = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.ownerId = null;
      state.waiterUser = null;
      state.sessionId = null;
      state.error = null;
      state.waiterList = [];
      state.waiterListLoading = false;
      state.waiterListError = null;
      state.selectedWaiter = null;
      resetSessionState(state);
    },
    clearOwnerSession: (state) => {
      resetSessionState(state);
      state.role = null;
      state.ownerId = null;
    },
    clearCaptainSession: (state) => {
      resetSessionState(state);
    },
    setSelectedWaiter: (state, action: PayloadAction<WaiterStaff | null>) => {
      state.selectedWaiter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOwnerOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOwnerOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.ownerId = action.payload.owner_id ?? null;
      })
      .addCase(sendOwnerOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || i18n.t("auth.login.errors.otpFailed");
      })
      .addCase(loginOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginOwner.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.data?.token;
        const user = action.payload.data?.user;

        if (token) {
          state.isAuthenticated = true;
          state.token = token;
          state.user = user || null;
        }
      })
      .addCase(loginOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      });
    builder
      .addCase(verifyOwnerOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOwnerOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.sessionId = action.payload.session_id || null;
        state.error = null;
        state.role = OWNER_ROLE;
      })
      .addCase(verifyOwnerOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || i18n.t("auth.verifyOtp.otpVerificationFail");
        state.isAuthenticated = false;
        state.sessionId = null;
      })
      .addCase(fetchWaiterList.pending, (state) => {
        state.waiterListLoading = true;
        state.waiterListError = null;
      })
      .addCase(fetchWaiterList.fulfilled, (state, action) => {
        state.waiterListLoading = false;
        state.ownerId = action.payload.owner_id;
        state.waiterList = action.payload.staffs || [];
        state.waiterListError = null;
      })
      .addCase(fetchWaiterList.rejected, (state, action) => {
        state.waiterListLoading = false;
        state.waiterList = [];
        state.waiterListError = action.payload || i18n.t("common.unknownError");
      });
    builder
      .addCase(verifyWaiterPasscode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyWaiterPasscode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.waiterUser = action.payload.user || null;
        state.role = CAPTAIN_ROLE;
        state.sessionId = action.payload.session_id || null;
      })
      .addCase(verifyWaiterPasscode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
        state.isAuthenticated = false;
      });
  },
});

export const {
  setAuthenticated,
  hydrateAuth,
  loginSuccess,
  logout,
  setSelectedWaiter,
  setOwnerId,
  setWaiterUser,
  setRole,
  clearOwnerSession,
  clearCaptainSession,
} = authSlice.actions;

export default authSlice.reducer;
