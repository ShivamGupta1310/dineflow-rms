import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import i18n from "@localization/i18n";
import { apiPost } from "@services/api/apiClient";
import type { RootState } from "@store";
import { API_ENDPOINTS } from "@constants/api";
import { BillSummaryResponse } from "@appTypes";

export interface MarkBillPaidRequest {
  p_owner_id: number;
  p_bill_id: number;
  p_payment_method: string;
}

export interface MarkBillPaidResponse {
  success?: boolean;
  message?: string;
  bill_id?: number;
  paid_at?: string;
}

interface OwnerBillSummaryState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OwnerBillSummaryState = {
  loading: false,
  error: null,
  success: false,
};

const getOwnerBillSummaryErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return i18n.t("common.unknownError");
};

export const fetchBillSummary = createAsyncThunk<
  BillSummaryResponse,
  { tableId: number },
  { rejectValue: string; state: RootState }
>(
  "ownerBillSummary/fetchBillSummary",
  async ({ tableId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);

      if (!ownerId) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const response = await apiPost<BillSummaryResponse>(
        API_ENDPOINTS.OWNER.GET_TABLE_ORDERS,
        {
          p_owner_id: ownerId,
          p_table_id: tableId,
        },
        {
          isEncrypt: false,
        },
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || i18n.t("owner.billSummary.unableToLoadBillSummary"),
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(getOwnerBillSummaryErrorMessage(error));
    }
  },
);

export const markBillPaid = createAsyncThunk<
  MarkBillPaidResponse,
  { billId: number; paymentMethod: string },
  { rejectValue: string; state: RootState }
>(
  "ownerBillSummary/markBillPaid",
  async ({ billId, paymentMethod }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);

      if (!ownerId) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const payload: MarkBillPaidRequest = {
        p_owner_id: ownerId,
        p_bill_id: billId,
        p_payment_method: paymentMethod,
      };

      const response = await apiPost<MarkBillPaidResponse>(
        API_ENDPOINTS.OWNER.MARK_BILL_PAID,
        payload,
        {
          isEncrypt: false,
        },
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || i18n.t("common.unknownError"),
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(getOwnerBillSummaryErrorMessage(error));
    }
  },
);

const ownerBillSummarySlice = createSlice({
  name: "ownerBillSummary",
  initialState,
  reducers: {
    resetMarkAsPaidState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillSummary.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBillSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
      })
      .addCase(markBillPaid.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(markBillPaid.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(markBillPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
        state.success = false;
      });
  },
});

export const { resetMarkAsPaidState } = ownerBillSummarySlice.actions;
export default ownerBillSummarySlice.reducer;
