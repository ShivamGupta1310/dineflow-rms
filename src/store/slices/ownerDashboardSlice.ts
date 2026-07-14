import moment from "moment";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_ENDPOINTS } from "@constants/api";
import i18n from "@localization/i18n";
import { apiPost } from "@services/api/apiClient";
import type { RootState } from "@store";
import { Date_Format } from "@utils/constants";

type DashboardTrend = "UP" | "DOWN";

export interface OwnerDashboardResponse {
  success?: boolean;
  message?: string;
  data?: OwnerDashboardData;
}

export interface GraphItem {
  label: string | number;
  date: string;
  amount: number;
}

export interface ChartData {
  total: number;
  currency: string;
  graph: GraphItem[];
}

export interface SalesRevenue {
  amount: number;
  change_percentage: number;
  trend: DashboardTrend;
  weekly_chart: ChartData;
  monthly_chart: ChartData;
}

export interface OwnerDashboardData {
  start_date: string;
  end_date: string;
  sales: {
    amount: number;
    change_percentage: number;
    trend: DashboardTrend;
  };
  orders: {
    count: number;
    change_percentage: number;
    trend: DashboardTrend;
  };
  reservations: {
    count: number;
    change_percentage: number;
    trend: DashboardTrend;
  };
  tables: {
    available: number;
    occupied: number;
    total: number;
  };
  active_staff: number;
  currency: string;
  sales_revenue?: SalesRevenue;
}

interface OwnerDashboardState {
  data: OwnerDashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: OwnerDashboardState = {
  data: null,
  loading: false,
  error: null,
};

const getOwnerDashboardErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t("common.unknownError");
};

export const fetchOwnerDashboard = createAsyncThunk<
  OwnerDashboardData,
  void,
  { rejectValue: string; state: RootState }
>(
  "ownerDashboard/fetchOwnerDashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);
      const sessionId = state.auth.sessionId;
      const today = moment().format(Date_Format.YYYY_MM_DD);
      const payload = {
        owner_id: ownerId,
        start_date: today,
        end_date: today,
        session_id: sessionId,
      };
      if (!ownerId || !sessionId) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const response = await apiPost<OwnerDashboardResponse>(
        API_ENDPOINTS.OWNER.DASHBOARD,
        payload,
        {
          isEncrypt: false,
        },
      );
      console.log('response===>',JSON.stringify(response));
      

      if (!response.data.success || !response.data.data) {
        return rejectWithValue(
          response.data.message || i18n.t("common.unknownError"),
        );
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(getOwnerDashboardErrorMessage(error));
    }
  },
);

const ownerDashboardSlice = createSlice({
  name: "ownerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchOwnerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchOwnerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
        state.data = null;
      });
  },
});

export default ownerDashboardSlice.reducer;
