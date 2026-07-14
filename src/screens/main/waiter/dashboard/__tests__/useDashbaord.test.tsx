import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { GlobalContext } from "../../../../../contexts/global.provider";
import { clearAppSession } from "@utils/authSession";
import { showToast } from "@utils/toastHelper";
import { fetchWaiterDashboard } from "@store/slices/waiterDashboardSlice";
import { fetchWaiterTables } from "@store/slices/waiterTablesSlice";
import {
  setSelectedTableData,
  setTableOrderSession,
} from "@store/slices/waiterOrderSlice";
import { IMAGES } from "@assets";
import { ROUTES } from "@constants";

import { useDashbaord } from "../useDashbaord";
import { mockState } from "../__mocks__/mockData";
import useWaiterOrderSheet from "../../useWaiterOrderSheet";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockHandleTableSelection = jest.fn();
const mockSetOrderSheetVisible = jest.fn();
const mockNavigateToMenuScreen = jest.fn();
const mockNavigateToGenerateBillScreen = jest.fn();

const mockFetchWaiterDashboard = jest.fn(() => ({
  type: "waiterDashboard/fetchWaiterDashboard",
}));
const mockFetchWaiterTables = jest.fn(() => ({
  type: "waiterTables/fetchWaiterTables",
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      const translations: Record<string, string> = {
        "waiter.dashboard.header.greeting": "Hey, {{name}}",
        "waiter.dashboard.header.role": "Waiter",
        "auth.logout": "Logout",
        "auth.logoutConfirmation.title": "Confirmation",
        "auth.logoutConfirmation.subtitle": "Are you sure you want to logout?",
        "common.unknownError": "Unknown error",
      };

      const value = translations[key] ?? key;

      if (options?.name) {
        return value.replace("{{name}}", options.name);
      }

      return value;
    },
  }),
}));

jest.mock("@utils/authSession", () => ({
  clearAppSession: jest.fn(),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("@store/slices/waiterDashboardSlice", () => ({
  fetchWaiterDashboard: jest.fn(),
}));

jest.mock("@store/slices/waiterTablesSlice", () => ({
  fetchWaiterTables: jest.fn(),
}));

jest.mock("@store/slices/waiterOrderSlice", () => ({
  setSelectedTableData: jest.fn((payload) => ({
    type: "waiterOrder/setSelectedTableData",
    payload,
  })),
  setTableOrderSession: jest.fn((payload) => ({
    type: "waiterOrder/setTableOrderSession",
    payload,
  })),
}));

jest.mock("@assets", () => ({
  IMAGES: {
    userAvatar: 1,
  },
}));

jest.mock("../../useWaiterOrderSheet", () => jest.fn());

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
const mockedClearAppSession = clearAppSession as jest.MockedFunction<
  typeof clearAppSession
>;
const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;
const mockedFetchWaiterDashboard = fetchWaiterDashboard as jest.MockedFunction<
  typeof fetchWaiterDashboard
>;
const mockedFetchWaiterTables = fetchWaiterTables as jest.MockedFunction<
  typeof fetchWaiterTables
>;
const mockedSetSelectedTableData =
  setSelectedTableData as jest.MockedFunction<typeof setSelectedTableData>;
const mockedSetTableOrderSession =
  setTableOrderSession as jest.MockedFunction<typeof setTableOrderSession>;

describe("useDashbaord", () => {
  const mockShowAlert = jest.fn();
  const mockHideAlert = jest.fn();
  const mockContextValue = {
    language: "en" as const,
    setLanguage: jest.fn(),
    isRTL: false,
    setIsRTL: jest.fn(),
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GlobalContext.Provider value={mockContextValue as any}>
      {children}
    </GlobalContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseSelector.mockImplementation((selector) => selector(mockState));
    mockedUseNavigation.mockReturnValue({
      navigate: mockNavigate,
      goBack: jest.fn(),
    } as any);
    mockedUseFocusEffect.mockImplementation((effect) => {
      effect();
    });
    mockedClearAppSession.mockResolvedValue(undefined);
    mockedFetchWaiterDashboard.mockImplementation(
      mockFetchWaiterDashboard as typeof fetchWaiterDashboard,
    );
    mockedFetchWaiterTables.mockImplementation(
      mockFetchWaiterTables as typeof fetchWaiterTables,
    );
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
    mockDispatch.mockImplementation((action) => action);
  });

  it("derives waiter dashboard data and dispatches refresh actions on focus", async () => {
    const { result } = renderHook(() => useDashbaord(), { wrapper });

    expect(result.current.headerTitle).toBe("Hey, Priya");
    expect(result.current.headerSubtitle).toBe("Waiter");
    expect(result.current.avatarSource).toEqual({
      uri: "https://example.com/waiter-avatar.png",
    });
    expect(result.current.dashboardData).toEqual(mockState.waiterDashboard.data);
    expect(result.current.activeTables).toHaveLength(6);
    expect(result.current.activeTables.map((item) => item.table_number)).toEqual([
      "T-06",
      "T-01",
      "T-05",
      "T-02",
      "T-04",
      "T-03",
    ]);

    await waitFor(() => {
      expect(mockedFetchWaiterDashboard).toHaveBeenCalledTimes(1);
      expect(mockedFetchWaiterTables).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "waiterDashboard/fetchWaiterDashboard",
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "waiterTables/fetchWaiterTables",
      });
    });
  });

  it("clears the app session after logout confirmation", async () => {
    const { result } = renderHook(
      () => useDashbaord({ showAlert: mockShowAlert, hideAlert: mockHideAlert }),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.handleLogout();
    });

    expect(mockShowAlert).toHaveBeenCalledWith({
      title: "Confirmation",
      subtitle: "Are you sure you want to logout?",
      onOk: expect.any(Function),
      onCancel: mockHideAlert,
    });

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk();
    });

    expect(mockedClearAppSession).toHaveBeenCalledTimes(1);
  });

  it("shows a toast when logout session clearing fails", async () => {
    mockedClearAppSession.mockRejectedValueOnce(new Error("Session expired"));

    const { result } = renderHook(
      () => useDashbaord({ showAlert: mockShowAlert, hideAlert: mockHideAlert }),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.handleLogout();
    });

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "Logout",
      "Session expired",
    );
  });

  it("falls back to placeholder values for non-captain users and empty tables", async () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockState,
        auth: {
          ...mockState.auth,
          user: {
            ...mockState.auth.user,
            role: "Cook",
            avatar: undefined,
          },
        },
        waiterTables: {
          ...mockState.waiterTables,
          tables: [],
        },
      }),
    );

    const { result } = renderHook(() => useDashbaord(), { wrapper });

    expect(result.current.headerSubtitle).toBe("--");
    expect(result.current.avatarSource).toBe(IMAGES.userAvatar);
    expect(result.current.activeTables).toEqual([]);
  });

  it("does not clear the session when logout is confirmed while data is loading", async () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockState,
        waiterDashboard: {
          ...mockState.waiterDashboard,
          loading: true,
        },
      }),
    );

    const { result } = renderHook(
      () => useDashbaord({ showAlert: mockShowAlert, hideAlert: mockHideAlert }),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.handleLogout();
    });

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk();
    });

    expect(mockedClearAppSession).not.toHaveBeenCalled();
  });

  it("navigates to menu for available tables from dashboard", async () => {
    const table = mockState.waiterTables.tables[1];

    const { result } = renderHook(() => useDashbaord(), { wrapper });

    await act(async () => {
      await result.current.handleTablePress(table as any);
    });

    expect(mockedSetSelectedTableData).toHaveBeenCalledWith(table);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "waiterOrder/setSelectedTableData",
      payload: table,
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TABLE_MENU);
    expect(mockHandleTableSelection).not.toHaveBeenCalled();
  });

  it("navigates reserved tables to menu with seeded table session data", async () => {
    const table = {
      ...mockState.waiterTables.tables[2],
      customer_name: "Rahul Sharma",
      customer_mobile: "9586245284",
    };

    const { result } = renderHook(() => useDashbaord(), { wrapper });

    await act(async () => {
      await result.current.handleTablePress(table as any);
    });

    expect(mockedSetTableOrderSession).toHaveBeenCalledWith({
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
