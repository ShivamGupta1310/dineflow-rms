import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_ENDPOINTS } from "@constants/api";
import i18n from "@localization/i18n";
import { apiPost } from "@services/api/apiClient";
import type { RootState } from "@store";
import { showToast } from "@utils/toastHelper";

export interface WaiterTable {
  table_id: number;
  table_number: string;
  capacity: number;
  status: string;
  customer_name: string | null;
  customer_mobile: string | null;
  occupied_at: string | null;
  total_order_amount: number;
  created_at: string;
  total_order_amount_with_tax: string;
}

export interface WaiterTablesResponse {
  success?: boolean;
  message?: string;
  tables?: WaiterTable[];
}

interface WaiterTablesState {
  tables: WaiterTable[];
  loading: boolean;
  error: string | null;
}

const initialState: WaiterTablesState = {
  tables: [],
  loading: false,
  error: null,
};

const getWaiterTablesErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t("common.unknownError");
};

export const fetchWaiterTables = createAsyncThunk<
  WaiterTable[],
  void,
  { rejectValue: string; state: RootState }
>(
  "waiterTables/fetchWaiterTables",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);
      const sessionId = state.auth.sessionId;
      const payload = {
        owner_id: ownerId,
        session_id: sessionId,
      };

      if (!ownerId || !sessionId) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const response = await apiPost<WaiterTablesResponse>(
        API_ENDPOINTS.COMMON.ACTIVE_TABLES,
        payload,
        {
          isEncrypt: false,
        },
      );

      if (!response.data.success) {
        showToast(
          "error",
          response?.data?.message || i18n.t("common.unknownError"),
        );
        return rejectWithValue(
          response.data.message || i18n.t("common.unknownError"),
        );
      }

      return response?.data?.tables || [];
    } catch (error) {
      return rejectWithValue(getWaiterTablesErrorMessage(error));
    }
  },
);

const waiterTablesSlice = createSlice({
  name: "waiterTables",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWaiterTables.pending, (state) => {
        state.tables = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWaiterTables.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tables = action.payload;
      })
      .addCase(fetchWaiterTables.rejected, (state, action) => {
        state.tables = [];
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
      });
  },
});

export default waiterTablesSlice.reducer;
