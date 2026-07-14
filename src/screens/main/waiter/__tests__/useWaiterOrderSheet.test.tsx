import { act, renderHook } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "@constants";
import useWaiterOrderSheet, {
  canOpenWaiterOrderSheet,
} from "../useWaiterOrderSheet";
import { fetchTableOrderDetails } from "@store/slices/waiterOrderSlice";
import {
  createWaiterOrderSheetTable,
  waiterOrderSheetMockState,
  waiterOrderSheetSessionPayload,
} from "../__mocks__/mockData";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockFetchTableOrderDetails = jest.fn((payload: unknown) => ({
  type: "waiterOrder/fetchTableOrderDetails/pending",
  payload,
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("@store/slices/waiterOrderSlice", () => {
  const fetchThunk = Object.assign(jest.fn(), {
    fulfilled: {
      match: jest.fn(
        (action: { type?: string }) =>
          action?.type === "waiterOrder/fetchTableOrderDetails/fulfilled",
      ),
    },
  });

  return {
    fetchTableOrderDetails: fetchThunk,
  };
});

const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;
const mockedUseDispatch = useDispatch as jest.MockedFunction<
  typeof useDispatch
>;
const mockedUseSelector = useSelector as jest.MockedFunction<
  typeof useSelector
>;
const mockedFetchTableOrderDetails =
  fetchTableOrderDetails as jest.MockedFunction<
    typeof fetchTableOrderDetails
  > & {
    fulfilled: { match: jest.Mock };
  };

describe("useWaiterOrderSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseNavigation.mockReturnValue({
      navigate: mockNavigate,
    } as any);
    mockedUseDispatch.mockReturnValue(mockDispatch as any);
    mockedUseSelector.mockImplementation((selector: any) =>
      selector(waiterOrderSheetMockState),
    );
    mockedFetchTableOrderDetails.mockImplementation(
      mockFetchTableOrderDetails as any,
    );
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "waiterOrder/fetchTableOrderDetails/pending") {
        return Promise.resolve({
          type: "waiterOrder/fetchTableOrderDetails/fulfilled",
          payload: waiterOrderSheetSessionPayload,
        });
      }

      return action;
    });
  });

  it("opens only occupied tables", () => {
    expect(canOpenWaiterOrderSheet("occupied")).toBe(true);
    expect(canOpenWaiterOrderSheet("reserved")).toBe(false);
    expect(canOpenWaiterOrderSheet("available")).toBe(false);
    expect(canOpenWaiterOrderSheet(null)).toBe(false);
  });

  it("returns the waiter order sheet state", () => {
    const { result } = renderHook(() => useWaiterOrderSheet());

    expect(result.current.orders).toEqual(
      waiterOrderSheetMockState.waiterOrder.orders,
    );
    expect(result.current.orderLoading).toBe(false);
    expect(result.current.orderSheetVisible).toBe(false);
    expect(result.current.selectedOrder).toEqual(
      waiterOrderSheetMockState.waiterOrder.orders[0],
    );
  });

  it("does not open the order sheet for available tables", async () => {
    const { result } = renderHook(() => useWaiterOrderSheet());

    await act(async () => {
      await result.current.handleTableSelection(
        createWaiterOrderSheetTable({
          status: "available",
          customer_name: null,
          customer_mobile: null,
        }) as any,
      );
    });

    expect(mockedFetchTableOrderDetails).not.toHaveBeenCalled();
    expect(result.current.orderSheetVisible).toBe(false);
  });

  it("loads table orders and opens the sheet for occupied tables", async () => {
    const { result } = renderHook(() => useWaiterOrderSheet());
    const selectedTable = createWaiterOrderSheetTable();

    await act(async () => {
      await result.current.handleTableSelection(selectedTable as any);
    });

    expect(mockedFetchTableOrderDetails).toHaveBeenCalledWith({
      tableId: 5,
      table: selectedTable,
    });
    expect(result.current.orderSheetVisible).toBe(true);
    expect(mockedFetchTableOrderDetails).toHaveBeenCalledWith({
      tableId: 5,
      table: selectedTable,
    });
  });

  it("does not open the sheet when order details fetch is not fulfilled", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "waiterOrder/fetchTableOrderDetails/pending") {
        return Promise.resolve({
          type: "waiterOrder/fetchTableOrderDetails/rejected",
        });
      }

      return action;
    });

    const { result } = renderHook(() => useWaiterOrderSheet());

    await act(async () => {
      await result.current.handleTableSelection(
        createWaiterOrderSheetTable() as any,
      );
    });

    expect(result.current.orderSheetVisible).toBe(false);
  });

  it("navigates to menu screen", async () => {
    const { result } = renderHook(() => useWaiterOrderSheet());

    act(() => {
      result.current.navigateToMenuScreen();
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TABLE_MENU);
    expect(result.current.orderSheetVisible).toBe(false);
  });

  it("clears the selected table when the sheet is closed", async () => {
    const { result } = renderHook(() => useWaiterOrderSheet());

    await act(async () => {
      await result.current.handleTableSelection(
        createWaiterOrderSheetTable() as any,
      );
    });

    act(() => {
      result.current.setOrderSheetVisible(false);
    });

    expect(result.current.orderSheetVisible).toBe(false);
    expect(result.current.selectedTable).toBeUndefined();
  });
  it("navigates to generate bill screen", () => {
    const { result } = renderHook(() => useWaiterOrderSheet());

    act(() => {
      result.current.navigateToGenerateBillScreen();
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.BILL_GENERATION);
    expect(result.current.orderSheetVisible).toBe(false);
  });
});
