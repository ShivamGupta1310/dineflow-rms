import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_ENDPOINTS } from "@constants/api";
import i18n from "@localization/i18n";
import { apiPost } from "@services/api/apiClient";
import type { RootState } from "@store";
import { showToast } from "@utils/toastHelper";

export interface OwnerTable {
  table_id: number;
  table_number: string;
  capacity: number;
  status: string;
  occupied_at: string | null;
  total_order_amount: number;
  created_at: string;
}

export interface OwnerTablesResponse {
  success?: boolean;
  message?: string;
  tables?: OwnerTable[];
}

export interface TimeSlot {
  slot_id: number;
  slot_name: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  booked: number;
  available: number;
  is_available: boolean;
}

export interface AvailableTableResponseItem {
  table_id: number;
  table_number: string;
  capacity: number;
  is_available: boolean;
}

export interface FetchTimeSlotsPayload {
  p_owner_id: number;
  p_session_id: string;
  p_date: string;
}

export interface FetchAvailableTablesPayload {
  p_owner_id: number;
  p_slot_id: number;
  p_guest_count: number;
  p_date: string;
}

export interface ConfirmReservationWithTablePayload {
  p_reservation_id: number;
  p_table_id: number;
  p_slot_id: number;
}

export interface ConfirmReservationWithTableResponseItem {
  reservation_date: string;
  reservation_id: number;
  slot_id: number;
  status: string;
  table_id: number;
}

export type ConfirmReservationWithTableResponse =
  ConfirmReservationWithTableResponseItem[];

interface OwnerTablesState {
  tables: OwnerTable[];
  availableTables: AvailableTableResponseItem[];
  timeSlots: TimeSlot[];
  loading: boolean;
  loadingTimeSlots: boolean;
  loadingAvailableTables: boolean;
  loadingConfirmReservation: boolean;
  error: string | null;
  timeSlotsError: string | null;
  availableTablesError: string | null;
  confirmReservationError: string | null;
}

const initialState: OwnerTablesState = {
  tables: [],
  availableTables: [],
  timeSlots: [],
  loading: false,
  loadingTimeSlots: false,
  loadingAvailableTables: false,
  loadingConfirmReservation: false,
  error: null,
  timeSlotsError: null,
  availableTablesError: null,
  confirmReservationError: null,
};

const getOwnerTablesErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t("common.unknownError");
};

export interface FetchOwnerTablesParams {
  reservation_id?: number;
  guest_count?: number;
  time_slot?: string;
  date?: string;
}

export const fetchOwnerTables = createAsyncThunk<
  OwnerTable[],
  FetchOwnerTablesParams | void,
  { rejectValue: string; state: RootState }
>(
  "ownerTables/fetchOwnerTables",
  async (params, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);
      const sessionId = state.auth.sessionId;
      const payload = params
        ? {
            reservation_id: params.reservation_id,
            guest_count: params.guest_count,
            time_slot: params.time_slot,
            date: params.date,
          }
        : {
            owner_id: ownerId,
            session_id: sessionId,
          };

      if (!params && (!ownerId || !sessionId)) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const response = await apiPost<OwnerTablesResponse>(
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
      return rejectWithValue(getOwnerTablesErrorMessage(error));
    }
  },
);

export const fetchTimeSlots = createAsyncThunk<
  TimeSlot[],
  FetchTimeSlotsPayload,
  { rejectValue: string }
>("ownerTables/fetchTimeSlots", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiPost<TimeSlot[]>(
      API_ENDPOINTS.OWNER.GET_AVAILABLE_SLOTS,
      payload,
      {
        isEncrypt: false,
      },
    );

    if (Array.isArray(response.data)) {
      return response.data;
    }

    const data = response.data as any;
    if (data?.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    return rejectWithValue(getOwnerTablesErrorMessage(error));
  }
});

export const fetchAvailableTables = createAsyncThunk<
  AvailableTableResponseItem[],
  FetchAvailableTablesPayload,
  { rejectValue: string }
>("ownerTables/fetchAvailableTables", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiPost<AvailableTableResponseItem[]>(
      API_ENDPOINTS.OWNER.GET_AVAILABLE_TABLES,
      payload,
      {
        isEncrypt: false,
      },
    );

    let rawTables: AvailableTableResponseItem[] = [];
    if (Array.isArray(response.data)) {
      rawTables = response.data;
    } else {
      const data = response.data as any;
      if (data?.success && Array.isArray(data.tables)) {
        rawTables = data.tables;
      }
    }

    return rawTables;
  } catch (error) {
    return rejectWithValue(getOwnerTablesErrorMessage(error));
  }
});

export const confirmReservationWithTable = createAsyncThunk<
  ConfirmReservationWithTableResponse,
  ConfirmReservationWithTablePayload,
  { rejectValue: string }
>(
  "ownerTables/confirmReservationWithTable",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiPost<ConfirmReservationWithTableResponse>(
        API_ENDPOINTS.OWNER.RESERVE_TABLE,
        payload,
        {
          isEncrypt: false,
        },
      );

      if (response.status !== 200) {
        return rejectWithValue(String(i18n.t("common.unknownError")));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(getOwnerTablesErrorMessage(error));
    }
  },
);

const ownerTablesSlice = createSlice({
  name: "ownerTables",
  initialState,
  reducers: {
    clearTimeSlots: (state) => {
      state.timeSlots = [];
      state.loadingTimeSlots = false;
      state.timeSlotsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerTables.pending, (state) => {
        state.tables = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerTables.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tables = action.payload;
      })
      .addCase(fetchOwnerTables.rejected, (state, action) => {
        state.tables = [];
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
      })
      // fetchTimeSlots
      .addCase(fetchTimeSlots.pending, (state) => {
        state.timeSlots = [];
        state.loadingTimeSlots = true;
        state.timeSlotsError = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.loadingTimeSlots = false;
        state.timeSlotsError = null;
        state.timeSlots = action.payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.timeSlots = [];
        state.loadingTimeSlots = false;
        state.timeSlotsError =
          action.payload || String(i18n.t("common.unknownError"));
      })
      // fetchAvailableTables
      .addCase(fetchAvailableTables.pending, (state) => {
        state.availableTables = [];
        state.loadingAvailableTables = true;
        state.availableTablesError = null;
      })
      .addCase(fetchAvailableTables.fulfilled, (state, action) => {
        state.loadingAvailableTables = false;
        state.availableTablesError = null;
        state.availableTables = action.payload;
      })
      .addCase(fetchAvailableTables.rejected, (state, action) => {
        state.availableTables = [];
        state.loadingAvailableTables = false;
        state.availableTablesError =
          action.payload || String(i18n.t("common.unknownError"));
      })
      .addCase(confirmReservationWithTable.pending, (state) => {
        state.loadingConfirmReservation = true;
        state.confirmReservationError = null;
      })
      .addCase(confirmReservationWithTable.fulfilled, (state) => {
        state.loadingConfirmReservation = false;
        state.confirmReservationError = null;
      })
      .addCase(confirmReservationWithTable.rejected, (state, action) => {
        state.loadingConfirmReservation = false;
        state.confirmReservationError =
          action.payload || String(i18n.t("common.unknownError"));
      });
  },
});

export const { clearTimeSlots } = ownerTablesSlice.actions;
export default ownerTablesSlice.reducer;
