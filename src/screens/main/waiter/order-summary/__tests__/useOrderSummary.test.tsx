import { act, renderHook } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "@constants";
import { useOrderSummary } from "../useOrderSummary";
import {
  createOrderSummaryTable,
  createOrderSummaryState,
  type TestTable,
} from "../__mocks__/mockData";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockReset = jest.fn();
let mockCreateWaiterOrder: jest.Mock;
let mockSetTableOrderSession: jest.Mock;
let mockUpdateTableOrderSessionDraft: jest.Mock;
let mockAddItemToCart: jest.Mock;
let mockRemoveItemFromCart: jest.Mock;

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "auth.login.errors.mobileRequired": "Please enter your mobile number",
        "auth.login.errors.mobileInvalid": "Please enter a valid mobile number",
      };

      return translations[key] ?? key;
    },
  }),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("@store/slices/waiterOrderSlice", () => ({
  __esModule: true,
  createWaiterOrder: (() => {
    mockCreateWaiterOrder = jest.fn((payload: unknown) => ({
      type: "waiterOrder/createWaiterOrder/pending",
      payload,
    }));

    Object.assign(mockCreateWaiterOrder, {
      fulfilled: {
        match: (action: { type?: string }) =>
          action.type === "waiterOrder/createWaiterOrder/fulfilled",
      },
    });

    return mockCreateWaiterOrder;
  })(),
  setTableOrderSession: (() => {
    mockSetTableOrderSession = jest.fn((payload: unknown) => ({
      type: "waiterOrder/setTableOrderSession",
      payload,
    }));

    return mockSetTableOrderSession;
  })(),
  updateTableOrderSessionDraft: (() => {
    mockUpdateTableOrderSessionDraft = jest.fn((payload: unknown) => ({
      type: "waiterOrder/updateTableOrderSessionDraft",
      payload,
    }));

    return mockUpdateTableOrderSessionDraft;
  })(),
  addItemToCart: (() => {
    mockAddItemToCart = jest.fn((payload: unknown) => ({
      type: "waiterOrder/addItemToCart",
      payload,
    }));

    return mockAddItemToCart;
  })(),
  removeItemFromCart: (() => {
    mockRemoveItemFromCart = jest.fn((payload: unknown) => ({
      type: "waiterOrder/removeItemFromCart",
      payload,
    }));

    return mockRemoveItemFromCart;
  })(),
}));

const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;
const mockedUseDispatch = useDispatch as jest.MockedFunction<
  typeof useDispatch
>;
const mockedUseSelector = useSelector as jest.MockedFunction<
  typeof useSelector
>;
let currentState: any;

const upsertTableSession = (payload: Record<string, unknown>) => {
  const currentSession = currentState.waiterOrder.tableSession;

  currentState.waiterOrder.tableSession = {
    tableSessionId: currentSession?.tableSessionId ?? 0,
    customerName: payload.customerName ?? currentSession?.customerName ?? "",
    customerMobile:
      payload.customerMobile ?? currentSession?.customerMobile ?? "",
    notes: payload.notes ?? currentSession?.notes ?? "",
    updatedCustomerName:
      payload.updatedCustomerName ??
      currentSession?.updatedCustomerName ??
      false,
    updatedCustomerMobileNumber:
      payload.updatedCustomerMobileNumber ??
      currentSession?.updatedCustomerMobileNumber ??
      false,
  };
};

const applySetTableOrderSession = (payload: {
  table: TestTable | null;
  session: {
    tableSessionId?: number;
    customerName?: string;
    customerMobile?: string;
    notes?: string;
  } | null;
}) => {
  currentState.waiterOrder.selectedTable = payload.table;

  const customerName = payload.table?.customer_name?.trim() ?? "";
  const customerMobile = payload.table?.customer_mobile?.trim() ?? "";

  if (customerName || customerMobile) {
    upsertTableSession({
      customerName,
      customerMobile,
      notes: payload.session?.notes,
      tableSessionId: payload.session?.tableSessionId,
      updatedCustomerName: false,
      updatedCustomerMobileNumber: false,
    });
    return;
  }

  if (payload.table?.status === "available") {
    const currentSession =
      payload.session ?? currentState.waiterOrder.tableSession;

    currentState.waiterOrder.tableSession = {
      tableSessionId: currentSession?.tableSessionId ?? 0,
      customerName: currentSession?.updatedCustomerName
        ? currentSession?.customerName ?? ""
        : "",
      customerMobile: currentSession?.updatedCustomerMobileNumber
        ? currentSession?.customerMobile ?? ""
        : "",
      notes: currentSession?.notes ?? "",
      updatedCustomerName: currentSession?.updatedCustomerName ?? false,
      updatedCustomerMobileNumber:
        currentSession?.updatedCustomerMobileNumber ?? false,
    };
    return;
  }

  currentState.waiterOrder.tableSession =
    payload.session ?? currentState.waiterOrder.tableSession;
};

describe("useOrderSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseNavigation.mockReturnValue({
      goBack: jest.fn(),
      navigate: mockNavigate,
      reset: mockReset,
    } as any);
    mockedUseDispatch.mockReturnValue(mockDispatch as any);
    currentState = createOrderSummaryState();
    mockedUseSelector.mockImplementation((selector: any) =>
      selector(currentState),
    );
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "waiterOrder/createWaiterOrder/pending") {
        return {
          type: "waiterOrder/createWaiterOrder/fulfilled",
          payload: { success: true, order_id: 39, order_number: "ORD-39" },
        };
      }

      if (action?.type === "waiterOrder/updateTableOrderSessionDraft") {
        upsertTableSession(action.payload);
        return action;
      }

      if (action?.type === "waiterOrder/setTableOrderSession") {
        applySetTableOrderSession(action.payload);
        return action;
      }

      return action;
    });
  });

  it("prefills customer details from the table session and enables confirm when valid", () => {
    const { result } = renderHook(() => useOrderSummary());

    expect(result.current.fullName).toBe("Rjz Stvz");
    expect(result.current.mobileNumber).toBe("7694378525");
    expect(result.current.notes).toBe("");
    expect(result.current.isConfirmOrderDisabled).toBe(false);
  });

  it("persists edited customer details when the screen is opened again", () => {
    const { result, rerender, unmount } = renderHook(() => useOrderSummary());

    act(() => {
      result.current.setFullName("Ava Patel");
      result.current.handleMobileChange("98ab76543210");
    });

    rerender({});

    expect(result.current.fullName).toBe("Ava Patel");
    expect(result.current.mobileNumber).toBe("9876543210");

    unmount();

    const reopened = renderHook(() => useOrderSummary());

    expect(reopened.result.current.fullName).toBe("Ava Patel");
    expect(reopened.result.current.mobileNumber).toBe("9876543210");
  });

  it("prioritizes customer details from the selected table when tables change", () => {
    const { result, rerender } = renderHook(() => useOrderSummary());

    act(() => {
      result.current.handleSelectTable(
        createOrderSummaryTable({
          table_id: 5,
          table_number: "Table 5",
          customer_name: "Table Guest",
          customer_mobile: "9998887776",
        }) as any,
      );
    });

    rerender({});

    expect(result.current.selectedTable?.table_number).toBe("Table 5");
    expect(result.current.fullName).toBe("Table Guest");
    expect(result.current.mobileNumber).toBe("9998887776");
  });

  it("preserves notes when a reserved or occupied table updates customer details", () => {
    const { result, rerender } = renderHook(() => useOrderSummary());

    act(() => {
      result.current.setNotes("Keep this note");
    });

    rerender({});

    act(() => {
      result.current.handleSelectTable(
        createOrderSummaryTable({
          table_id: 6,
          table_number: "Table 6",
          status: "reserved",
          customer_name: "Reserved Guest",
          customer_mobile: "8887776665",
        }) as any,
      );
    });

    rerender({});

    expect(result.current.fullName).toBe("Reserved Guest");
    expect(result.current.mobileNumber).toBe("8887776665");
    expect(result.current.notes).toBe("Keep this note");
  });

  it("preserves customer details when an available table is selected after user updates them", () => {
    const { result, rerender } = renderHook(() => useOrderSummary());

    act(() => {
      result.current.setFullName("Updated Guest");
      result.current.handleMobileChange("9876543210");
      result.current.setNotes("Keep this note");
    });

    rerender({});

    act(() => {
      result.current.handleSelectTable(
        createOrderSummaryTable({
          table_id: 8,
          table_number: "Table 8",
          status: "available",
        }) as any,
      );
    });

    rerender({});

    expect(result.current.selectedTable?.table_number).toBe("Table 8");
    expect(result.current.fullName).toBe("Updated Guest");
    expect(result.current.mobileNumber).toBe("9876543210");
    expect(result.current.notes).toBe("Keep this note");
  });

  it("reuses waiter cart actions for quantity updates", () => {
    const { result } = renderHook(() => useOrderSummary());
    const item = currentState.waiterOrder.orderItems[0];

    act(() => {
      result.current.handleAddItem(item);
      result.current.handleRemoveItem(item);
    });

    expect(mockAddItemToCart).toHaveBeenCalledWith(item);
    expect(mockRemoveItemFromCart).toHaveBeenCalledWith(item);
  });

  it("keeps customer details cleared when the user cleared them before selecting an available table", () => {
    const { result, rerender } = renderHook(() => useOrderSummary());

    act(() => {
      result.current.setFullName("");
      result.current.handleMobileChange("");
      result.current.setNotes("Keep this note");
    });

    rerender({});

    act(() => {
      result.current.handleSelectTable(
        createOrderSummaryTable({
          table_id: 9,
          table_number: "Table 9",
          status: "available",
        }) as any,
      );
    });

    rerender({});

    expect(result.current.fullName).toBe("");
    expect(result.current.mobileNumber).toBe("");
    expect(result.current.notes).toBe("Keep this note");
  });

  it("disables confirm when required inputs are missing or mobile is invalid", () => {
    const { result, rerender } = renderHook(() => useOrderSummary());

    act(() => {
      result.current.setFullName("");
    });

    rerender({});

    expect(result.current.isConfirmOrderDisabled).toBe(true);

    act(() => {
      result.current.setFullName("Rjz Stvz");
      result.current.handleMobileChange("123abc");
    });

    rerender({});

    expect(result.current.mobileNumber).toBe("123");
    expect(result.current.isConfirmOrderDisabled).toBe(true);
  });

  it("shows mobile validation and does not submit when the mobile number is invalid", async () => {
    const { result, rerender } = renderHook(() => useOrderSummary());

    act(() => {
      result.current.handleMobileChange("123");
    });

    rerender({});

    await act(async () => {
      await result.current.handleConfirmedOrder();
    });

    expect(result.current.mobileErrorText).toBe(
      "Please enter a valid mobile number",
    );
    expect(mockCreateWaiterOrder).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.ORDER_CONFIRMED);
    expect(mockReset).not.toHaveBeenCalled();
  });

  it("disables confirm when order items are empty", () => {
    currentState.waiterOrder.orderItems = [];
    const { result } = renderHook(() => useOrderSummary());

    expect(result.current.isConfirmOrderDisabled).toBe(true);
  });

  it("submits create order payload and resets to the confirmed screen on success", async () => {
    const { result } = renderHook(() => useOrderSummary());

    await act(async () => {
      await result.current.handleConfirmedOrder();
    });

    expect(mockCreateWaiterOrder).toHaveBeenCalledWith({
      tableId: 2,
      customerName: "Rjz Stvz",
      customerMobile: "7694378525",
      notes: "",
      items: [
        {
          menu_item_id: 194,
          quantity: 3,
        },
        {
          menu_item_id: 211,
          quantity: 5,
        },
      ],
    });
    expect(mockReset).toHaveBeenCalledWith({
      index: 1,
      routes: [
        {
          name: ROUTES.MAIN_TABS,
          params: {
            screen: ROUTES.TABLES,
          },
        },
        {
          name: ROUTES.ORDER_CONFIRMED,
          params: expect.objectContaining({
            orderId: 39,
            orderNumber: "ORD-39",
            tableNumber: "Table 2",
            fullName: "Rjz Stvz",
            mobileNumber: "7694378525",
            orderItems: currentState.waiterOrder.orderItems,
            placedAt: expect.any(String),
          }),
        },
      ],
    });
  });
});
