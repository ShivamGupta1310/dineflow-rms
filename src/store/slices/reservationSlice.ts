import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_ENDPOINTS } from "@constants/api";
import i18n from "@localization/i18n";
import { apiPost } from "@services/api/apiClient";
import type { RootState } from "@store";
import { Date_Format, ReservationStatus } from "@utils/constants";
import { showToast } from "@utils/toastHelper";
import { formatDate } from "@utils";

export interface ReservationItem {
  id: number;
  notes?: string | null;
  status: ReservationStatus;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  total_guest: number;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
}

export interface ReservationMetaItem {
  id: number;
  key: string;
  name: string;
  description: string;
}

export interface ReservationResponse {
  success?: boolean;
  message?: string;
  data?: ReservationItem[];
}

export interface ReservationDetail {
  reservation_id: number;
  reservation_number: string;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  total_guest: number;
  status: ReservationStatus;
  confirmation_status: string;
  reservation_type: string;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  reservation_type_id?: number;
  reservation_source_id?: number;
}

export interface ReservationActivity {
  activity_type: string;
  activity_message: string;
  created_at: string;
}

export interface ReservationDetailResponse {
  success?: boolean;
  message?: string;
  reservation?: ReservationDetail;
  activities?: ReservationActivity[];
}

export interface ReservationMetaResponse {
  success?: boolean;
  message?: string;
  data?: {
    reservation_type?: ReservationMetaItem[];
    reservation_sources?: ReservationMetaItem[];
  };
}

export interface UpdateReservationPayload {
  p_reservation_id: number;
  p_status: ReservationStatus;
  p_staff_id: number;
}

export interface UpdateReservationResponse {
  success: boolean;
  message: string;
}

export interface CreateReservationInput {
  customerName: string;
  customerPhone: string;
  reservationDate: Date;
  reservationTime: number;
  totalGuest: number;
  notes?: string;
  reservationTypeId: number | null;
  reservationSourceId: number | null;
  reservationId?: number;
}

export interface CreateReservationResponse {
  success?: boolean;
  message?: string;
  data?: ReservationItem | ReservationItem[] | null;
}

interface ReservationState {
  reservations: ReservationItem[];
  reservationDetail: ReservationDetail | null;
  reservationActivities: ReservationActivity[];
  reservationMeta: {
    reservationTypes: ReservationMetaItem[];
    reservationSources: ReservationMetaItem[];
  };
  loading: boolean;
  detailLoading: boolean;
  metaLoading: boolean;
  listNeedsRefresh: boolean;
  createLoading: boolean;
  error: string | null;
  detailError: string | null;
  metaError: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  reservationDetail: null,
  reservationActivities: [],
  reservationMeta: {
    reservationTypes: [],
    reservationSources: [],
  },
  loading: false,
  detailLoading: false,
  metaLoading: false,
  listNeedsRefresh: false,
  createLoading: false,
  error: null,
  detailError: null,
  metaError: null,
};

const getReservationErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(i18n.t("common.unknownError"));
};

export const fetchReservations = createAsyncThunk<
  ReservationItem[],
  void,
  { rejectValue: string; state: RootState }
>("reservation/fetchReservations", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const ownerId =
      state.auth.ownerId ??
      Number((state.auth.user as { owner_id?: number } | null)?.owner_id);
    const sessionId = state.auth.sessionId;

    if (!ownerId || !sessionId) {
      return rejectWithValue(String(i18n.t("common.unknownError")));
    }

    const response = await apiPost<ReservationResponse>(
      API_ENDPOINTS.OWNER.RESERVATIONS,
      {
        p_owner_id: ownerId,
        p_session_id: sessionId,
      },
      {
        isEncrypt: false,
      },
    );

    if (!response.data.success) {
      showToast(
        "error",
        response.data.message || String(i18n.t("common.unknownError")),
      );
      return rejectWithValue(
        response.data.message || String(i18n.t("common.unknownError")),
      );
    }

    return response.data.data || [];
  } catch (error) {
    return rejectWithValue(getReservationErrorMessage(error));
  }
});

export const fetchReservationDetails = createAsyncThunk<
  {
    reservation: ReservationDetail;
    activities: ReservationActivity[];
  },
  number,
  { rejectValue: string; state: RootState }
>(
  "reservation/fetchReservationDetails",
  async (reservationId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);
      const sessionId = state.auth.sessionId;

      if (!ownerId || !sessionId || !reservationId) {
        return rejectWithValue(String(i18n.t("common.unknownError")));
      }

      const response = await apiPost<ReservationDetailResponse>(
        API_ENDPOINTS.OWNER.RESERVATION_DETAILS,
        {
          p_owner_id: ownerId,
          p_session_id: sessionId,
          p_reservation_id: reservationId,
        },
        {
          isEncrypt: false,
        },
      );

      if (!response.data.success || !response.data.reservation) {
        const message =
          response.data.message || String(i18n.t("common.unknownError"));
        showToast("error", message);

        return rejectWithValue(message);
      }

      return {
        reservation: response.data.reservation,
        activities: response.data.activities || [],
      };
    } catch (error) {
      return rejectWithValue(getReservationErrorMessage(error));
    }
  },
);

export const fetchReservationMeta = createAsyncThunk<
  {
    reservationTypes: ReservationMetaItem[];
    reservationSources: ReservationMetaItem[];
  },
  void,
  { rejectValue: string; state: RootState }
>("reservation/fetchReservationMeta", async (_, { rejectWithValue }) => {
  try {
    const response = await apiPost<ReservationMetaResponse>(
      API_ENDPOINTS.OWNER.RESERVATION_META,
    );
    if (!response.data.success || !response.data.data) {
      const message =
        response.data.message || String(i18n.t("common.unknownError"));
      showToast("error", message);
      return rejectWithValue(message);
    }

    return {
      reservationTypes: response.data.data.reservation_type || [],
      reservationSources: response.data.data.reservation_sources || [],
    };
  } catch (error) {
    showToast("error", i18n.t("common.unknownError"));
    return rejectWithValue(getReservationErrorMessage(error));
  }
});

export const updateReservationStatus = createAsyncThunk<
  UpdateReservationResponse,
  UpdateReservationPayload,
  { rejectValue: string }
>(
  "reservation/updateReservationStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiPost<UpdateReservationResponse>(
        API_ENDPOINTS.OWNER.UPDATE_RESERVATION_STATUS,
        payload,
        {
          isEncrypt: false,
        },
      );

      if (!response.data.success) {
        showToast(
          "error",
          response.data.message || String(i18n.t("common.unknownError")),
        );

        return rejectWithValue(
          response.data.message || String(i18n.t("common.unknownError")),
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(getReservationErrorMessage(error));
    }
  },
);

export const createReservation = createAsyncThunk<
  CreateReservationResponse,
  CreateReservationInput,
  { rejectValue: string; state: RootState }
>(
  "reservation/createReservation",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const reservationDate = payload.reservationDate
        ? formatDate(payload.reservationDate, Date_Format.YYYY_MM_DD, false)
        : null;
      const state = getState();
      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);
      const sessionId = state.auth.sessionId;
      const createdBy =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);

      if (!ownerId || !sessionId) {
        return rejectWithValue(String(i18n.t("common.unknownError")));
      }

      const body = {
        p_owner_id: ownerId,
        p_customer_name: payload.customerName,
        p_customer_phone: payload.customerPhone,
        p_reservation_date: reservationDate,
        p_slot_id: payload.reservationTime,
        p_total_guest: payload.totalGuest,
        p_notes: payload.notes ?? "",
        p_reservation_type_id: payload.reservationTypeId,
        p_reservation_source_id: payload.reservationSourceId,
        ...(payload.reservationId
          ? {
              p_reservation_id: payload.reservationId,
              p_updated_by: ownerId,
            }
          : { p_session_id: sessionId, p_created_by: createdBy }),
      };
      const response = await apiPost<CreateReservationResponse>(
        payload.reservationId
          ? API_ENDPOINTS.OWNER.UPDATE_RESERVATION
          : API_ENDPOINTS.OWNER.CREATE_RESERVATION,
        body,
        {
          isEncrypt: false,
        },
      );
      if (!response.data.success) {
        const message =
          response.data.message || String(i18n.t("common.unknownError"));
        showToast("error", message);
        return rejectWithValue(message);
      }

      return response.data;
    } catch (error) {
      showToast("error", String(i18n.t("common.unknownError")));
      return rejectWithValue(getReservationErrorMessage(error));
    }
  },
);

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    markReservationListForRefresh: (state) => {
      state.listNeedsRefresh = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reservations = [];
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.listNeedsRefresh = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || String(i18n.t("common.unknownError"));
        state.reservations = [];
      })
      .addCase(fetchReservationDetails.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.reservationDetail = null;
        state.reservationActivities = [];
      })
      .addCase(fetchReservationDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailError = null;
        state.reservationDetail = action.payload.reservation;
        state.reservationActivities = action.payload.activities;
      })
      .addCase(fetchReservationDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError =
          action.payload || String(i18n.t("common.unknownError"));
        state.reservationDetail = null;
        state.reservationActivities = [];
      })
      .addCase(fetchReservationMeta.pending, (state) => {
        state.metaLoading = true;
        state.metaError = null;
      })
      .addCase(fetchReservationMeta.fulfilled, (state, action) => {
        state.metaLoading = false;
        state.metaError = null;
        state.reservationMeta = {
          reservationTypes: action.payload.reservationTypes,
          reservationSources: action.payload.reservationSources,
        };
      })
      .addCase(fetchReservationMeta.rejected, (state, action) => {
        state.metaLoading = false;
        state.metaError =
          action.payload || String(i18n.t("common.unknownError"));
        state.reservationMeta = {
          reservationTypes: [],
          reservationSources: [],
        };
      })
      .addCase(updateReservationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.reservations = state.reservations.map((reservation) =>
          reservation.id === action.meta.arg.p_reservation_id
            ? { ...reservation, status: action.meta.arg.p_status }
            : reservation,
        );

        if (
          state.reservationDetail?.reservation_id ===
          action.meta.arg.p_reservation_id
        ) {
          state.reservationDetail = {
            ...state.reservationDetail,
            status: action.meta.arg.p_status,
          };
        }
      })
      .addCase(updateReservationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || String(i18n.t("common.unknownError"));
      })
      .addCase(createReservation.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state) => {
        state.createLoading = false;
        state.error = null;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || String(i18n.t("common.unknownError"));
      });
  },
});

export const { markReservationListForRefresh } = reservationSlice.actions;

export default reservationSlice.reducer;
