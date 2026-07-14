import { MenuCategory, MenuConfigResponse, MenuFilter, MenuItemsResponse, WaiterMenuState } from "@appTypes";
import { API_ENDPOINTS } from "@constants/api";
import i18n from "@localization/i18n";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiPost } from "@services/api/apiClient";
import { RootState } from "@store";

const initialState: WaiterMenuState = {
  filters: [],
  categories: [],
  items: [],

  selectedFilter: null,
  selectedCategory: null,

  loading: false,
  error: null,
};

export const fetchMenuConfig = createAsyncThunk(
  "waiterMenu/fetchMenuConfig",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const response = await apiPost<MenuConfigResponse>(
        API_ENDPOINTS.WAITER.GET_MENU_CONFIG,
        {
          p_owner_id: state.auth.ownerId,
          p_session_id: state.auth.sessionId,
        },
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message ?? i18n.t("common.unknownError"),);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message ?? i18n.t("common.unknownError"),);
    }
  },
);

export const fetchMenuItems = createAsyncThunk(
  "waiterMenu/fetchMenuItems",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth,
        waiterMenu,
      } = getState() as RootState;

      const response =
        await apiPost<MenuItemsResponse>(
          API_ENDPOINTS.WAITER.GET_MENU_ITEMS,
          {
            p_owner_id: auth.ownerId,
            p_session_id: auth.sessionId,
            p_category_id: waiterMenu.selectedCategory?.id,
            p_filter_id: waiterMenu.selectedFilter?.id,
          },
        );
      if (!response.data.success) {
        return rejectWithValue(response.data.message ?? i18n.t("common.unknownError"),);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message ?? i18n.t("common.unknownError"),);
    }
  },
);

const waiterMenuSlice = createSlice({
  name: "waiterMenu",
  initialState,

  reducers: {
    setSelectedFilter(state, action: PayloadAction<MenuFilter>) {
      state.selectedFilter = action.payload;
    },

    setSelectedCategory(state, action: PayloadAction<MenuCategory>) {
      state.selectedCategory = action.payload;
    },

    clearItemsList(state) {
      state.items = [];
    },

    clearMenuConfigSelection(state) {
      state.selectedFilter = null;
      state.selectedCategory = null;
    },

    clearMenuState(state) {
      state.filters = [];
      state.categories = [];

      state.selectedFilter = null;
      state.selectedCategory = null;

      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMenuConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMenuConfig.fulfilled, (state, action) => {
        state.loading = false;

        state.filters = action.payload.filters;
        state.categories = action.payload.categories;

        state.selectedFilter =
          action.payload.filters.length > 0
            ? action.payload.filters[0]
            : null;

        state.selectedCategory =
          action.payload.categories.length > 0
            ? action.payload.categories[0]
            : null;
      })

      .addCase(fetchMenuConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMenuItems.pending, state => {
        state.loading = true;
      })

      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })

      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      },
      )
  },
});

export const {
  setSelectedFilter,
  setSelectedCategory,
  clearMenuState,
  clearItemsList,
  clearMenuConfigSelection
} = waiterMenuSlice.actions;

export default waiterMenuSlice.reducer;