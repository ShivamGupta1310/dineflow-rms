import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { API_ENDPOINTS } from "@constants/api";
import i18n from "@localization/i18n";
import { apiPost } from "@services/api/apiClient";
import type { RootState } from "@store";
import { showToast } from "@utils/toastHelper";
import { TableGridItemStatus, TableOrderStatus } from "@utils/constants";

import type {
  CreateWaiterOrderItemPayload,
  CreateWaiterOrderPayload,
  CreateWaiterOrderResponse,
  GenerateBillPayload,
  GenerateBillResponse,
  TableSession,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResponse,
  WaiterOrderState,
} from "@appTypes/waiterOrder.types";
import type { MenuItem, BillSummaryResponse } from "@appTypes";
import { fetchWaiterTables, type WaiterTable } from "./waiterTablesSlice";
import { TableGridItemData } from "@components/TableGridItem";
import { t } from "i18next";
import { markOrderItemsServed } from "@utils";

const createTableSessionDraft = (
  currentSession: TableSession | null,
  updates: Partial<TableSession>,
): TableSession => ({
  tableSessionId: updates.tableSessionId ?? currentSession?.tableSessionId ?? 0,
  customerName: updates.customerName ?? currentSession?.customerName ?? "",
  customerMobile:
    updates.customerMobile ?? currentSession?.customerMobile ?? "",
  notes: updates.notes ?? currentSession?.notes ?? "",
  updatedCustomerMobileNumber:
    updates.updatedCustomerMobileNumber ??
    currentSession?.updatedCustomerMobileNumber ??
    false,
  updatedCustomerName:
    updates.updatedCustomerName ?? currentSession?.updatedCustomerName ?? false,
});

const getTableCustomerDetails = (table: WaiterTable | null) => {
  const customerName = table?.customer_name?.trim() ?? "";
  const customerMobile = table?.customer_mobile?.trim() ?? "";

  if (!customerName && !customerMobile) {
    return null;
  }

  return {
    customerName,
    customerMobile,
  };
};

const isAvailableTable = (table: WaiterTable | null) =>
  table?.status?.toLowerCase() === TableGridItemStatus.AVAILABLE;

const isTableCustomerSyncEnabled = (table: WaiterTable | null) => {
  const normalizedStatus = table?.status?.toLowerCase();

  return (
    normalizedStatus === TableGridItemStatus.RESERVED ||
    normalizedStatus === TableGridItemStatus.OCCUPIED
  );
};

const getWaiterOrderErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t("common.unknownError");
};

const initialState: WaiterOrderState = {
  // Active table for the current order flow
  selectedTable: null,

  // Customer & session details for the current order flow
  tableSession: null,

  //Config details for calculating bill data
  billMetadata: null,

  // Existing items already placed for this table
  orders: [],

  // New items added in the current Menu session
  orderItems: [],

  loading: false,
  error: null,
};

export const fetchTableOrderDetails = createAsyncThunk<
  BillSummaryResponse,
  { tableId: number; table: TableGridItemData },
  { rejectValue: string; state: RootState }
>(
  "waiterOrder/fetchTableOrderDetails",
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
        API_ENDPOINTS.WAITER.GET_TABLE_ORDERS,
        {
          p_owner_id: ownerId,
          p_table_id: tableId,
        },
        {
          isEncrypt: false,
        },
      );

      if (!response.data.success) {
        showToast(
          "error",
          response.data.message || i18n.t("common.unknownError"),
        );

        return rejectWithValue(
          response.data.message || i18n.t("common.unknownError"),
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(getWaiterOrderErrorMessage(error));
    }
  },
);

export const createWaiterOrder = createAsyncThunk<
  CreateWaiterOrderResponse,
  {
    tableId: number;
    customerName: string;
    customerMobile: string;
    notes: string;
    items: CreateWaiterOrderItemPayload[];
  },
  { rejectValue: string; state: RootState }
>(
  "waiterOrder/createWaiterOrder",
  async (
    { tableId, customerName, customerMobile, notes, items },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState();

      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);

      const createdBy =
        Number((state.auth.user as { staff_id?: number } | null)?.staff_id) ||
        0;

      const sessionId = state.auth.sessionId;

      if (!ownerId || !createdBy || !sessionId) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const payload: CreateWaiterOrderPayload = {
        p_owner_id: ownerId,
        p_created_by: createdBy,
        p_session_id: sessionId,
        p_table_id: tableId,
        p_customer_name: customerName,
        p_customer_mobile: customerMobile,
        p_notes: notes,
        p_items: items,
      };
      const response = await apiPost<CreateWaiterOrderResponse>(
        API_ENDPOINTS.WAITER.CREATE_ORDER,
        payload,
        {
          isEncrypt: false,
        },
      );

      if (!response.data.success) {
        const message = response.data.message || i18n.t("common.unknownError");
        showToast("error", message);
        return rejectWithValue(message);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(getWaiterOrderErrorMessage(error));
    }
  },
);

export const generateBill = createAsyncThunk<
  GenerateBillResponse,
  {
    customerName: string;
    customerMobile: string;
  },
  { rejectValue: string; state: RootState }
>(
  "waiterOrder/generateBill",
  async (
    {
      customerName,
      customerMobile,
    }: {
      customerName: string;
      customerMobile: string;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState();

      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);

      const generatedBy =
        Number((state.auth.user as { staff_id?: number } | null)?.staff_id) ||
        0;

      const generatedByRole =
        (state.auth.user as { role?: string } | null)?.role ?? "";

      const tableSessionId = state.waiterOrder.tableSession?.tableSessionId;

      //Static as of now, later it will be updated
      const taxPercentage = 5;
      const discountAmount = 0;

      if (
        !ownerId ||
        !generatedBy ||
        !generatedByRole ||
        !tableSessionId ||
        !customerName ||
        !customerMobile
      ) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const payload: GenerateBillPayload = {
        p_owner_id: ownerId,
        p_table_session_id: tableSessionId,
        p_generated_by: generatedBy,
        p_generated_by_role: generatedByRole,
        p_discount_amount: discountAmount,
        p_tax_percentage: taxPercentage,
        p_customer_name: customerName,
        p_mobile_number: customerMobile,
      };

      const response = await apiPost<GenerateBillResponse>(
        API_ENDPOINTS.WAITER.GENERATE_BILL,
        payload,
        {
          isEncrypt: false,
        },
      );
      if (!response.data.success) {
        const message = response.data.message || i18n.t("common.unknownError");

        showToast("error", message);

        return rejectWithValue(message);
      }

      return response.data;
    } catch (error) {
      showToast(
        "error",
        t("waiter.generateBill.billGenerationFailed"),
        t("common.unknownError"),
      );
      return rejectWithValue(getWaiterOrderErrorMessage(error));
    }
  },
);

export const updateWaiterOrderStatus = createAsyncThunk<
  { success: true; orderId: number },
  { orderId: number },
  { rejectValue: string; state: RootState }
>(
  "waiterOrder/updateWaiterOrderStatus",
  async ({ orderId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const ownerId =
        state.auth.ownerId ??
        Number((state.auth.user as { owner_id?: number } | null)?.owner_id);

      const staffId =
        Number((state.auth.user as { staff_id?: number } | null)?.staff_id) ||
        0;

      const sessionId = state.auth.sessionId;

      if (!ownerId || !staffId || !sessionId) {
        return rejectWithValue(i18n.t("common.unknownError"));
      }

      const payload: UpdateOrderStatusPayload = {
        p_owner_id: ownerId,
        p_session_id: sessionId,
        p_order_id: orderId,
        p_staff_id: staffId,
        p_order_status: TableOrderStatus.SERVED,
      };
      const response = await apiPost<UpdateOrderStatusResponse>(
        API_ENDPOINTS.WAITER.UPDATE_ORDER_STATUS,
        payload,
        {
          isEncrypt: false,
        },
      );
      if (!response.data.success) {
        const message = response.data.message || i18n.t("common.unknownError");
        showToast("error", message);
        return rejectWithValue(message);
      }

      return {
        success: true,
        orderId,
      };
    } catch (error) {
      showToast(
        "error",
        t("waiter.order.statusUpdated"),
        t("common.unknownError"),
      );
      return rejectWithValue(getWaiterOrderErrorMessage(error));
    }
  },
);

const waiterOrderSlice = createSlice({
  name: "waiterOrder",

  initialState,

  reducers: {
    setTableOrderSession(
      state,
      action: PayloadAction<{
        table: WaiterTable | null;
        session: TableSession | null;
      }>,
    ) {
      state.selectedTable = action.payload.table;

      const nextSessionBase = action.payload.session ?? state.tableSession;
      const tableCustomerDetails = isTableCustomerSyncEnabled(
        action.payload.table,
      )
        ? getTableCustomerDetails(action.payload.table)
        : null;

      if (tableCustomerDetails) {
        state.tableSession = createTableSessionDraft(nextSessionBase, {
          ...tableCustomerDetails,
          updatedCustomerName: false,
          updatedCustomerMobileNumber: false,
        });
        return;
      }

      if (isAvailableTable(action.payload.table)) {
        state.tableSession = createTableSessionDraft(nextSessionBase, {
          customerName: nextSessionBase?.updatedCustomerName
            ? nextSessionBase?.customerName
            : "",
          customerMobile: nextSessionBase?.updatedCustomerMobileNumber
            ? nextSessionBase?.customerMobile
            : "",
        });
        return;
      }

      state.tableSession = nextSessionBase;
    },

    setSelectedTableData(state, action: PayloadAction<WaiterTable | null>) {
      state.selectedTable = action.payload;
    },

    updateTableOrderSessionDraft(
      state,
      action: PayloadAction<Partial<Omit<TableSession, "tableSessionId">>>,
    ) {
      state.tableSession = createTableSessionDraft(
        state.tableSession,
        action.payload,
      );
    },

    addItemToCart(state, action: PayloadAction<MenuItem>) {
      const existingItem = state.orderItems.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.orderItems.push({
        ...action.payload,
        quantity: 1,
      });
    },

    removeItemFromCart(state, action: PayloadAction<MenuItem>) {
      const existingItem = state.orderItems.find(
        (item) => item.id === action.payload.id,
      );

      if (!existingItem) {
        return;
      }

      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        state.orderItems = state.orderItems.filter(
          (item) => item.id !== action.payload.id,
        );
      }
    },

    clearOrderItems(state) {
      state.orderItems = [];
    },

    clearTableOrders(state) {
      state.orders = [];
    },

    clearOrder(state) {
      state.selectedTable = null;
      state.tableSession = null;
      state.billMetadata = null;
      state.orderItems = [];
      state.orders = [];

      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTableOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orders = [];
        state.tableSession = null;
        state.billMetadata = null;
      })
      .addCase(fetchTableOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedTable = action.meta.arg.table;
        state.orders = action.payload.orders ?? [];
        state.tableSession = {
          tableSessionId: action.payload.table_session_id,
          customerName: action.payload.customer_name,
          customerMobile: action.payload.customer_mobile,
          notes: "",
        };
        state.billMetadata = {
          totalGuest: action.payload.total_guest,
          sessionDate: action.payload.session_date,
          sessionStartedAt: action.payload.session_started_at,
          cgstPercentage: action.payload.cgst_percentage,
          sgstPercentage: action.payload.sgst_percentage,
          billDetails: action.payload.bill_details,
        };
      })
      .addCase(fetchTableOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.tableSession = null;
        state.billMetadata = null;
        state.error = action.payload || i18n.t("common.unknownError");
      })
      .addCase(fetchWaiterTables.fulfilled, (state, action) => {
        if (!state.selectedTable) {
          return;
        }

        const refreshedSelectedTable = action.payload.find(
          (table) => table.table_id === state.selectedTable?.table_id,
        );

        if (!refreshedSelectedTable) {
          return;
        }

        state.selectedTable = refreshedSelectedTable;

        const tableCustomerDetails = isTableCustomerSyncEnabled(
          refreshedSelectedTable,
        )
          ? getTableCustomerDetails(refreshedSelectedTable)
          : null;

        if (tableCustomerDetails) {
          state.tableSession = createTableSessionDraft(state.tableSession, {
            ...tableCustomerDetails,
            updatedCustomerName: false,
            updatedCustomerMobileNumber: false,
          });
          return;
        }

        if (isAvailableTable(refreshedSelectedTable)) {
          state.tableSession = createTableSessionDraft(state.tableSession, {
            customerName: state.tableSession?.updatedCustomerName
              ? state.tableSession?.customerName
              : "",
            customerMobile: state.tableSession?.updatedCustomerMobileNumber
              ? state.tableSession?.customerMobile
              : "",
          });
        }
      })
      .addCase(createWaiterOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWaiterOrder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createWaiterOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
      })
      .addCase(generateBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateBill.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(generateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || i18n.t("common.unknownError");
      })
      .addCase(updateWaiterOrderStatus.fulfilled, (state, action) => {
        state.orders = markOrderItemsServed(
          state.orders,
          action.payload.orderId,
        );
      })
      .addCase(updateWaiterOrderStatus.rejected, (state, action) => {
        state.error = action.payload || i18n.t("common.unknownError");
      });
  },
});

export const {
  setTableOrderSession,
  setSelectedTableData,
  updateTableOrderSessionDraft,
  addItemToCart,
  removeItemFromCart,
  clearOrderItems,
  clearTableOrders,
  clearOrder,
} = waiterOrderSlice.actions;

export default waiterOrderSlice.reducer;
