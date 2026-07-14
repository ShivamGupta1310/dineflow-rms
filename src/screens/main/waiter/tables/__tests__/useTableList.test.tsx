import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { GlobalContext } from "../../../../../contexts/global.provider";
import useTableList from "../useTableList";
import { showToast } from "@utils/toastHelper";
import { mockState } from "../__mocks__/mockData";
import { fetchWaiterTables } from "@store/slices/waiterTablesSlice";
import {
  setSelectedTableData,
  setTableOrderSession,
} from "@store/slices/waiterOrderSlice";
import useWaiterOrderSheet from "../../useWaiterOrderSheet";
import { ROUTES } from "@constants";

const mockNavigate = jest.fn();
const mockDispatch = jest.fn(() => Promise.resolve({}));
const mockFetchWaiterTables = jest.fn(() => ({
  type: "waiterTables/fetchWaiterTables",
}));
const mockedFetchWaiterTables = fetchWaiterTables as jest.MockedFunction<
  typeof fetchWaiterTables
>;
const mockedSetSelectedTableData = setSelectedTableData as jest.MockedFunction<
  typeof setSelectedTableData
>;
const mockedSetTableOrderSession = setTableOrderSession as jest.MockedFunction<
  typeof setTableOrderSession
>;

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(() => ({
    navigate: mockNavigate,
  })),
  useFocusEffect: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@store/slices/waiterTablesSlice", () => ({
  fetchWaiterTables: jest.fn(),
}));

jest.mock("@store/slices/waiterOrderSlice", () => {
  const actual = jest.requireActual("@store/slices/waiterOrderSlice");

  const fetchThunk = jest.fn() as jest.Mock & {
    fulfilled: {
      match: jest.Mock;
    };
  };

  fetchThunk.fulfilled = {
    match: jest.fn(
      (action: { type?: string }) =>
        action?.type === "waiterOrder/fetchTableOrderDetails/fulfilled",
    ),
  };

  return {
    ...actual,
    fetchTableOrderDetails: fetchThunk,
    setSelectedTableData: jest.fn((payload) => ({
      type: "waiterOrder/setSelectedTableData",
      payload,
    })),
    setTableOrderSession: jest.fn((payload) => ({
      type: "waiterOrder/setTableOrderSession",
      payload,
    })),
  };
});

const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;
const mockedUseDispatch = useDispatch as jest.MockedFunction<
  typeof useDispatch
>;
const mockedUseSelector = useSelector as jest.MockedFunction<
  typeof useSelector
>;
const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<
  typeof useFocusEffect
>;
const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;

const mockHandleTableSelection = jest.fn();
const mockSetOrderSheetVisible = jest.fn();
const mockNavigateToMenuScreen = jest.fn();
const mockNavigateToGenerateBillScreen = jest.fn();

jest.mock("../../useWaiterOrderSheet", () => jest.fn());

describe("useTableList", () => {
  const wrapper =
    (isRTL = false) =>
    ({ children }: { children: React.ReactNode }) =>
      (
        <GlobalContext.Provider
          value={
            {
              language: "en",
              setLanguage: jest.fn(),
              isRTL,
              setIsRTL: jest.fn(),
            } as any
          }
        >
          {children}
        </GlobalContext.Provider>
      );

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(mockDispatch as any);
    mockedUseSelector.mockImplementation((selector) =>
      selector(mockState as any),
    );
    let focusEffectTriggered = false;
    mockedUseFocusEffect.mockImplementation((effect) => {
      if (!focusEffectTriggered) {
        focusEffectTriggered = true;
        effect();
      }
    });
    mockedFetchWaiterTables.mockImplementation(mockFetchWaiterTables as any);
    mockedUseNavigation.mockReturnValue({ navigate: mockNavigate } as any);
    mockedSetSelectedTableData.mockImplementation((payload: any) => ({
      type: "waiterOrder/setSelectedTableData",
      payload,
    }));
    mockedSetTableOrderSession.mockImplementation((payload: any) => ({
      type: "waiterOrder/setTableOrderSession",
      payload,
    }));

    (useWaiterOrderSheet as jest.Mock).mockReturnValue({
      orders: [],
      orderLoading: false,
      orderSheetVisible: false,
      selectedOrder: null,
      selectedTable: null,
      setOrderSheetVisible: mockSetOrderSheetVisible,
      handleTableSelection: mockHandleTableSelection,
      navigateToMenuScreen: mockNavigateToMenuScreen,
      navigateToGenerateBillScreen: mockNavigateToGenerateBillScreen,
    });
  });

  it("returns the default table state and tab data", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    expect(result.current.isRTL).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.selectedStatus).toBe("all");
    expect(result.current.refreshing).toBe(false);
    expect(result.current.tables).toHaveLength(4);
    expect(result.current.tabs).toHaveLength(5);
    expect(result.current.tabs[0]).toMatchObject({
      id: "1",
      title: "waiter.tables.all",
      status: "all",
      count: 4,
    });
    expect(result.current.tabs[1]).toMatchObject({
      id: "2",
      title: "waiter.tables.available",
      status: "available",
      count: 2,
      dotColor: expect.any(String),
    });
    expect(result.current.tabs[2]).toMatchObject({
      id: "3",
      title: "waiter.tables.occupied",
      status: "occupied",
      count: 1,
    });
    expect(result.current.tabs[4]).toMatchObject({
      id: "5",
      title: "waiter.tables.readyToPay",
      status: "ready to pay",
      count: 1,
    });
    expect(result.current.statusGuideCards).toHaveLength(4);
    expect(result.current.statusGuideCards[0]).toMatchObject({
      id: "available",
      title: "waiter.tables.available",
      description: "waiter.tables.availableDesc",
      testID: "status-guide-card-available",
    });
    expect(result.current.statusGuideCards[3]).toMatchObject({
      id: "ready-to-pay",
      title: "waiter.tables.readyToPay",
      description: "waiter.tables.readyToPayDesc",
      testID: "status-guide-card-ready-to-pay",
    });
  });

  it("falls back to non-RTL when no global context is provided", () => {
    const { result } = renderHook(() => useTableList());

    expect(result.current.isRTL).toBe(false);
  });

  it("reads RTL from context and updates selected status", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(true),
    });

    expect(result.current.isRTL).toBe(true);

    act(() => {
      result.current.setSelectedStatus("occupied");
    });

    expect(result.current.selectedStatus).toBe("occupied");
  });

  it("shows coming soon toasts for search actions", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    result.current.handleSearchClick();

    expect(mockedShowToast).toHaveBeenCalledTimes(1);
    expect(mockedShowToast).toHaveBeenNthCalledWith(
      1,
      "info",
      "common.comingSoon",
    );
  });

  it("dispatches table fetch on refresh", async () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(mockedFetchWaiterTables).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "waiterTables/fetchWaiterTables",
    });
  });
  it("delegates non-available tables to waiter order sheet", async () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    await act(async () => {
      await result.current.handleTablePress(
        mockState.waiterTables.tables[3] as any,
      );
    });

    expect(mockHandleTableSelection).toHaveBeenCalledWith(
      mockState.waiterTables.tables[3],
    );
    expect(result.current.selectedTable).toBeNull();
    expect(result.current.orderSheetVisible).toBe(false);
  });

  it("ignores non active tables for order sheet selection", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });
    result.current.getStatusTitle("ready to pay");
    result.current.handleTablePress(mockState.waiterTables.tables[0] as any);

    expect(mockHandleTableSelection).toHaveBeenCalledWith(
      mockState.waiterTables.tables[0],
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("toggles refreshing state while refreshing", async () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    expect(result.current.refreshing).toBe(false);

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(result.current.refreshing).toBe(false);
  });

  it("shows loading when fetching table order details", () => {
    (useWaiterOrderSheet as jest.Mock).mockReturnValue({
      orders: [],
      orderLoading: true,
      orderSheetVisible: false,
      selectedOrder: null,
      selectedTable: null,
      setOrderSheetVisible: mockSetOrderSheetVisible,
      handleTableSelection: mockHandleTableSelection,
      navigateToMenuScreen: mockNavigateToMenuScreen,
      navigateToGenerateBillScreen: mockNavigateToGenerateBillScreen,
    });

    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    expect(result.current.loading).toBe(true);
  });

  it("navigates to menu for available table", async () => {
    const table = mockState.waiterTables.tables[1];

    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    await act(async () => {
      await result.current.handleTablePress(table as any);
    });

    expect(setSelectedTableData).toHaveBeenCalledWith(table);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "waiterOrder/setSelectedTableData",
      payload: table,
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TABLE_MENU);

    expect(mockHandleTableSelection).not.toHaveBeenCalled();
  });

  it("seeds reserved table customer details before navigating to menu", async () => {
    const table = {
      ...mockState.waiterTables.tables[1],
      status: "reserved",
      customer_name: "Reserved Guest",
      customer_mobile: "9876543210",
    };

    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    await act(async () => {
      await result.current.handleTablePress(table as any);
    });

    expect(setTableOrderSession).toHaveBeenCalledWith({
      table,
      session: null,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "waiterOrder/setTableOrderSession",
      payload: {
        table,
        session: null,
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TABLE_MENU);
    expect(mockHandleTableSelection).not.toHaveBeenCalled();
  });
});
