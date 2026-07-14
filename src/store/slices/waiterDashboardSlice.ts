import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import i18n from "@localization/i18n";
import { apiPost } from "@services/api/apiClient";
import type { RootState } from "@store";
import { API_ENDPOINTS } from "@constants/api";
import {
  WaiterDashboardApiResponse,
  WaiterDashboardData,
  WaiterDashboardRequest,
  WaiterDashboardState,
} from "@appTypes";

const initialState: WaiterDashboardState = {
  data: null,
  loading: false,
  error: null,
};

const getWaiterDashboardErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t("common.unknownError");
};

export const fetchWaiterDashboard = createAsyncThunk<
  WaiterDashboardData,
  void,
  { rejectValue: string; state: RootState }
>(
  "waiterDashboard/fetchWaiterDashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);

      const staffId =
        (state.auth.user as { staff_id?: number } | null)?.staff_id ?? 0;

      const sessionId = state.auth.sessionId;

      if (!ownerId || !staffId || !sessionId) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const payload: WaiterDashboardRequest = {
        owner_id: ownerId,
        staff_id: staffId,
        session_id: sessionId,
      };

      const response = await apiPost<WaiterDashboardApiResponse>(
        API_ENDPOINTS.WAITER.DASHBOARD,
        payload,
      );

      if (!response.data.success || !response.data.data) {
        return rejectWithValue(
          response.data.message ?? i18n.t("common.unknownError"),
        );
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(getWaiterDashboardErrorMessage(error));
    }
  },
);

const waiterDashboardSlice = createSlice({
  name: "waiterDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWaiterDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchWaiterDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchWaiterDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? i18n.t("common.unknownError");
        state.data = null;
      });
  },
});

export default waiterDashboardSlice.reducer;
