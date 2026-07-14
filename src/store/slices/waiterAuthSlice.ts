import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@constants/api";
import i18n from "@localization/i18n";
import { apiPost } from "@services/api/apiClient";
import {
  GetStaffByRolePayload,
  GetStaffByRoleResponse,
  UnlinkRestaurantPayload,
  UnlinkRestaurantResponse,
  WaiterAuthState,
} from "@appTypes";

const initialState: WaiterAuthState = {
  loading: false,
  error: null,
  success: false,
  role: null,
};

export const getStaffByRole = createAsyncThunk<
  GetStaffByRoleResponse,
  GetStaffByRolePayload,
  { rejectValue: string }
>("waiterAuth/getStaffByRole", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiPost<GetStaffByRoleResponse>(
      API_ENDPOINTS.AUTH.GET_STAFF_BY_ROLE,
      payload,
    );

    if (!res.data.success) {
      const message =
        res.data.message || i18n.t("auth.onBoarding.verificationFailedMessage");
      return rejectWithValue(message);
    }

    return res.data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : i18n.t("auth.onBoarding.verificationErrorMessage");
    return rejectWithValue(message);
  }
});

export const unlinkRestaurant = createAsyncThunk<
  UnlinkRestaurantResponse,
  UnlinkRestaurantPayload,
  { rejectValue: string }
>("waiterAuth/unlinkRestaurant", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiPost<UnlinkRestaurantResponse>(
      API_ENDPOINTS.AUTH.UNLINK_RESTAURANT,
      payload,
    );
    if (!res.data.success) {
      return rejectWithValue(res.data.message || i18n.t("common.unknownError"));
    }

    return res.data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : i18n.t("common.unknownError");
    return rejectWithValue(message);
  }
});

const waiterAuthSlice = createSlice({
  name: "waiterAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStaffByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getStaffByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
      })
      .addCase(getStaffByRole.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || i18n.t("auth.onBoarding.verificationErrorMessage");
        state.success = false;
      })
      .addCase(unlinkRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlinkRestaurant.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(unlinkRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
      });
  },
});

export default waiterAuthSlice.reducer;
