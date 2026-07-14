import { act, renderHook } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { useBillGeneration } from "../useBillGeneration";
import {
  mockRootState,
  mockCalculatedBillSummary,
  mockOrderItems,
} from "../__mocks__/mockData";

import { calculateBillSummary, groupBillSummaryItems } from "@utils";
import { clearOrder, generateBill } from "@store/slices/waiterOrderSlice";

const mockDispatch = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      if (params?.orderNumber) {
        return `${key} ${params.orderNumber}`;
      }

      return key;
    },
  }),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("@utils", () => ({
  ...jest.requireActual("@utils"),
  calculateBillSummary: jest.fn(),
  groupBillSummaryItems: jest.fn(),
}));
jest.mock("@store/slices/waiterOrderSlice", () => {
  const mockClearOrder = jest.fn(() => ({
    type: "waiterOrder/clearOrder",
  }));

  const mockGenerateBill = Object.assign(jest.fn(), {
    fulfilled: {
      match: jest.fn(
        (action: { type?: string }) =>
          action?.type === "waiterOrder/generateBill/fulfilled",
      ),
    },
  });

  return {
    clearOrder: mockClearOrder,
    generateBill: mockGenerateBill,
  };
});
const mockedClearOrder = clearOrder as jest.MockedFunction<typeof clearOrder>;
const mockedDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;

const mockedSelector = useSelector as jest.MockedFunction<typeof useSelector>;

const mockedNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;

const mockedCalculateBillSummary = calculateBillSummary as jest.MockedFunction<
  typeof calculateBillSummary
>;

const mockedGroupBillSummaryItems =
  groupBillSummaryItems as jest.MockedFunction<typeof groupBillSummaryItems>;

const mockedGenerateBill = generateBill as jest.MockedFunction<
  typeof generateBill
> & {
  fulfilled: {
    match: jest.Mock;
  };
};

describe("useBillGeneration", () => {
  const mockShowSuccessScreen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedDispatch.mockReturnValue(mockDispatch as any);

    mockedSelector.mockImplementation((selector: any) =>
      selector(mockRootState),
    );

    mockedNavigation.mockReturnValue({
      goBack: mockGoBack,
      reset: mockReset,
    } as any);

    mockedGroupBillSummaryItems.mockReturnValue(mockOrderItems);

    mockedCalculateBillSummary.mockReturnValue(mockCalculatedBillSummary);

    mockDispatch.mockImplementation((action) => action);
  });

  it("returns initial values", () => {
    const { result } = renderHook(() =>
      useBillGeneration({
        showSuccessScreen: mockShowSuccessScreen,
      }),
    );

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toBeNull();

    expect(result.current.fullName).toBe("John Doe");

    expect(result.current.mobileNumber).toBe("9876543210");

    expect(result.current.orderNumbers).toBe("#1001, #1002");

    expect(result.current.tableId).toBe(12);

    expect(result.current.orderItems).toEqual(mockOrderItems);

    expect(result.current.calculatedBillSummary).toEqual(
      mockCalculatedBillSummary,
    );
  });

  it("updates full name", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleFullNameChange("John Doe");
    });

    expect(result.current.fullName).toBe("John Doe");
  });

  it("updates mobile number", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleMobileChange("98765abc43210");
    });

    expect(result.current.mobileNumber).toBe("9876543210");
  });

  it("disables generate bill for empty full name", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleFullNameChange("");
    });

    expect(result.current.isGenerateBillDisabled).toBe(true);
  });

  it("disables generate bill for invalid mobile", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleMobileChange("123");
    });

    expect(result.current.isGenerateBillDisabled).toBe(true);
  });

  it("enables generate bill for valid values", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleFullNameChange("John");

      result.current.handleMobileChange("9999999999");
    });

    expect(result.current.isGenerateBillDisabled).toBe(false);
  });

  it("returns grouped order items", () => {
    renderHook(() => useBillGeneration());

    expect(mockedGroupBillSummaryItems).toHaveBeenCalledWith(
      mockRootState.waiterOrder.orders,
    );
  });

  it("returns calculated bill summary", () => {
    renderHook(() => useBillGeneration());

    expect(mockedCalculateBillSummary).toHaveBeenCalledWith(
      mockRootState.waiterOrder.orders,
      2.5,
      2.5,
    );
  });

  it("returns null bill summary when metadata is missing", () => {
    mockedSelector.mockImplementation((selector: any) =>
      selector({
        ...mockRootState,
        waiterOrder: {
          ...mockRootState.waiterOrder,
          billMetadata: null,
        },
      }),
    );

    const { result } = renderHook(() => useBillGeneration());

    expect(result.current.calculatedBillSummary).toBeNull();
  });
  it("navigates back", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleBack();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("shows coming soon toast on add discount", () => {
    const { showToast } = require("@utils/toastHelper");

    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleAddDiscount();
    });

    expect(showToast).toHaveBeenCalledWith("info", "common.comingSoon");
  });

  it("returns mobile required error", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleMobileChange("");
    });

    expect(result.current.mobileErrorText).toBeNull();

    act(() => {
      result.current.handleFullNameChange("John");
      result.current.handleMobileChange("");
    });

    expect(result.current.isGenerateBillDisabled).toBe(true);
  });

  it("dispatches generate bill", async () => {
    mockedGenerateBill.mockImplementation(((payload: any) => ({
      type: "waiterOrder/generateBill/pending",
      payload,
    })) as any);

    mockDispatch.mockImplementation((action) => {
      if (action.type === "waiterOrder/generateBill/pending") {
        return Promise.resolve({
          type: "waiterOrder/generateBill/fulfilled",
          payload: {
            bill_number: "BILL-1001",
          },
        });
      }

      return action;
    });

    const { result } = renderHook(() =>
      useBillGeneration({
        showSuccessScreen: mockShowSuccessScreen,
      }),
    );

    await act(async () => {
      await result.current.handleGenerateBill();
    });

    expect(mockedGenerateBill).toHaveBeenCalledWith({
      customerName: "John Doe",
      customerMobile: "9876543210",
    });
  });

  it("shows success screen after bill generation", async () => {
    mockedGenerateBill.mockImplementation(((payload: any) => ({
      type: "waiterOrder/generateBill/pending",
      payload,
    })) as any);

    mockDispatch.mockImplementation((action) => {
      if (action.type === "waiterOrder/generateBill/pending") {
        return Promise.resolve({
          type: "waiterOrder/generateBill/fulfilled",
          payload: {
            bill_number: "BILL-1001",
          },
        });
      }

      return action;
    });

    const { result } = renderHook(() =>
      useBillGeneration({
        showSuccessScreen: mockShowSuccessScreen,
      }),
    );

    await act(async () => {
      await result.current.handleGenerateBill();
    });

    expect(mockShowSuccessScreen).toHaveBeenCalledTimes(1);

    expect(mockShowSuccessScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "waiter.generateBill.billGenerated",
        buttonText: "waiter.generateBill.okay",
        isSuccessIconVisible: false,
        onPress: expect.any(Function),
      }),
    );
  });

  it("does not show success screen when generate bill fails", async () => {
    mockedGenerateBill.mockImplementation(((payload: any) => ({
      type: "waiterOrder/generateBill/pending",
      payload,
    })) as any);

    mockDispatch.mockImplementation((action) => {
      if (action.type === "waiterOrder/generateBill/pending") {
        return Promise.resolve({
          type: "waiterOrder/generateBill/rejected",
        });
      }

      return action;
    });

    const { result } = renderHook(() =>
      useBillGeneration({
        showSuccessScreen: mockShowSuccessScreen,
      }),
    );

    await act(async () => {
      await result.current.handleGenerateBill();
    });

    expect(mockShowSuccessScreen).not.toHaveBeenCalled();
  });
  it("clears order and resets navigation after success action", () => {
    mockedClearOrder.mockReturnValue({
      type: "waiterOrder/clearOrder",
    } as any);

    const { result } = renderHook(() =>
      useBillGeneration({
        showSuccessScreen: mockShowSuccessScreen,
      }),
    );

    let successConfig: any;

    mockedGenerateBill.mockImplementation(((payload: any) => ({
      type: "waiterOrder/generateBill/pending",
      payload,
    })) as any);

    mockDispatch.mockImplementation((action) => {
      if (action.type === "waiterOrder/generateBill/pending") {
        return Promise.resolve({
          type: "waiterOrder/generateBill/fulfilled",
          payload: {
            bill_number: "BILL-1001",
          },
        });
      }

      return action;
    });

    return act(async () => {
      await result.current.handleGenerateBill();

      successConfig = mockShowSuccessScreen.mock.calls[0][0];

      successConfig.onPress();
    }).then(() => {
      expect(mockedClearOrder).toHaveBeenCalledTimes(1);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "waiterOrder/clearOrder",
      });

      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: {
              routes: [{ name: "Tables" }],
            },
          },
        ],
      });
    });
  });

  it("returns loading from selector", () => {
    mockedSelector.mockImplementation((selector: any) =>
      selector({
        ...mockRootState,
        waiterOrder: {
          ...mockRootState.waiterOrder,
          loading: true,
        },
      }),
    );

    const { result } = renderHook(() => useBillGeneration());

    expect(result.current.loading).toBe(true);
  });

  it("returns error from selector", () => {
    mockedSelector.mockImplementation((selector: any) =>
      selector({
        ...mockRootState,
        waiterOrder: {
          ...mockRootState.waiterOrder,
          error: "Something went wrong",
        },
      }),
    );

    const { result } = renderHook(() => useBillGeneration());

    expect(result.current.error).toBe("Something went wrong");
  });

  it("falls back to noop success screen when controller is missing", async () => {
    mockedGenerateBill.mockImplementation(((payload: any) => ({
      type: "waiterOrder/generateBill/pending",
      payload,
    })) as any);

    mockDispatch.mockImplementation((action) => {
      if (action.type === "waiterOrder/generateBill/pending") {
        return Promise.resolve({
          type: "waiterOrder/generateBill/fulfilled",
          payload: {
            bill_number: "BILL-1001",
          },
        });
      }

      return action;
    });

    const { result } = renderHook(() => useBillGeneration());

    await act(async () => {
      await result.current.handleGenerateBill();
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("returns placeholder when there are no order numbers", () => {
    mockedSelector.mockImplementation((selector: any) =>
      selector({
        ...mockRootState,
        waiterOrder: {
          ...mockRootState.waiterOrder,
          orders: [],
        },
      }),
    );

    const { result } = renderHook(() => useBillGeneration());

    expect(result.current.orderNumbers).toBe("--");
  });

  it("filters non digit characters from mobile", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleMobileChange("98a76b54@321");
    });

    expect(result.current.mobileNumber).toBe("987654321");
  });

  it("keeps valid generate bill state", () => {
    const { result } = renderHook(() => useBillGeneration());

    act(() => {
      result.current.handleFullNameChange("John Patel");

      result.current.handleMobileChange("9999999999");
    });

    expect(result.current.isGenerateBillDisabled).toBe(false);
  });
});
