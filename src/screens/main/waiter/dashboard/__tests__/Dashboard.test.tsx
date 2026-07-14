import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import GlobalProvider from "../../../../../contexts/global.provider";
import DashboardScreen from "../index";
import { clearAppSession } from "@utils/authSession";
import { fetchWaiterDashboard } from "@store/slices/waiterDashboardSlice";
import { fetchWaiterTables } from "@store/slices/waiterTablesSlice";
import { mockState } from "../__mocks__/mockData";

const mockDispatch = jest.fn();
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
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock("react-i18next", () => ({
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      const translations: Record<string, string> = {
        "waiter.dashboard.header.greeting": "Hey, {{name}}",
        "waiter.dashboard.header.role": "Waiter",
        "waiter.dashboard.todayReservation": "Today's Reservation",
        "waiter.dashboard.activeOrders": "Active Orders",
        "waiter.dashboard.pendingOrders": "Pending Orders",
        "waiter.dashboard.activeTables": "Active Tables",
        "waiter.dashboard.viewAll": "View All",
        "auth.logout": "Logout",
        "auth.logoutConfirmation.title": "Confirmation",
        "auth.logoutConfirmation.subtitle": "Are you sure you want to logout?",
        "common.no": "No",
        "common.yes": "Yes",
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

jest.mock("@store/slices/waiterDashboardSlice", () => ({
  fetchWaiterDashboard: jest.fn(),
}));

jest.mock("@store/slices/waiterTablesSlice", () => ({
  fetchWaiterTables: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => {
    const { View } = require("react-native");

    return <View>{children}</View>;
  },
  useSafeAreaInsets: () => ({
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock("@components", () => {
  const reactModule = require("react");
  const { Text, View } = require("react-native");

  return {
    AppLoader: () =>
      reactModule.createElement(Text, { testID: "mock-app-loader" }, "Loader"),
    Header: ({ leftSlot, title, subtitle, rightSlot }: any) =>
      reactModule.createElement(
        View,
        { testID: "mock-header" },
        leftSlot,
        reactModule.createElement(Text, null, title),
        reactModule.createElement(Text, null, subtitle),
        rightSlot,
      ),
    RNText: ({ children, ...props }: any) => {
      return <Text {...props}>{children}</Text>;
    },
    RNView: ({ children, ...props }: any) => {
      return <View {...props}>{children}</View>;
    },
    OrderListSheet: ({
      visible,
      handleAddItemClick,
      handleGenerateBillClick,
    }: any) => {
      const { Pressable } = require("react-native");

      if (!visible) return null;

      return (
        <View testID="mock-order-sheet">
          <Pressable testID="add-item-button" onPress={handleAddItemClick}>
            <Text>Add Item</Text>
          </Pressable>

          <Pressable
            testID="generate-bill-button"
            onPress={handleGenerateBillClick}
          >
            <Text>Generate Bill</Text>
          </Pressable>
        </View>
      );
    },
  };
});

jest.mock("react-native-svg", () => {
  const reactModule = require("react");
  const { Text } = require("react-native");

  return {
    SvgXml: ({ xml, ...props }: any) =>
      reactModule.createElement(
        Text,
        { ...props, testID: "mock-svg-xml" },
        xml,
      ),
  };
});

jest.mock("@assets", () => {
  const reactModule = require("react");
  const { Text } = require("react-native");

  return {
    SVGS: {
      BlueCalendarIcon: () =>
        reactModule.createElement(
          Text,
          { testID: "mock-blue-calendar-icon" },
          "BlueCalendarIcon",
        ),
      LogoutIcon: () =>
        reactModule.createElement(
          Text,
          { testID: "mock-logout-icon" },
          "LogoutIcon",
        ),
    },
    EatingSVG: jest.fn(() => "<svg />"),
    IMAGES: {
      userAvatar: 1,
    },
  };
});

const mockedUseDispatch = useDispatch as jest.MockedFunction<
  typeof useDispatch
>;
const mockedUseSelector = useSelector as jest.MockedFunction<
  typeof useSelector
>;
const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<
  typeof useFocusEffect
>;
const mockedClearAppSession = clearAppSession as jest.MockedFunction<
  typeof clearAppSession
>;
const mockedFetchWaiterDashboard = fetchWaiterDashboard as jest.MockedFunction<
  typeof fetchWaiterDashboard
>;
const mockedFetchWaiterTables = fetchWaiterTables as jest.MockedFunction<
  typeof fetchWaiterTables
>;

const mockHandleTablePress = jest.fn();
const mockNavigateToMenuScreen = jest.fn();
const mockNavigateToGenerateBillScreen = jest.fn();
const mockSetOrderSheetVisible = jest.fn();

jest.mock("../../useWaiterOrderSheet", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    orders: [],
    orderLoading: false,
    orderSheetVisible: false,
    selectedTable: null,
    selectedOrder: null,
    setOrderSheetVisible: mockSetOrderSheetVisible,
    handleTableSelection: mockHandleTablePress,
    navigateToMenuScreen: mockNavigateToMenuScreen,
    navigateToGenerateBillScreen: mockNavigateToGenerateBillScreen,
  })),
  canOpenWaiterOrderSheet: jest.requireActual("../../useWaiterOrderSheet")
    .canOpenWaiterOrderSheet,
}));

describe("WaiterDashboardScreen", () => {
  const renderScreen = () =>
    render(
      <GlobalProvider>
        <DashboardScreen />
      </GlobalProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseSelector.mockImplementation((selector) => selector(mockState));
    mockedUseFocusEffect.mockImplementation((effect) => {
      effect();
    });
    mockedClearAppSession.mockResolvedValue(undefined);
    mockedFetchWaiterDashboard.mockImplementation(
      mockFetchWaiterDashboard as unknown as typeof fetchWaiterDashboard,
    );
    mockedFetchWaiterTables.mockImplementation(
      mockFetchWaiterTables as unknown as typeof fetchWaiterTables,
    );
    mockDispatch.mockImplementation((action) => action);
  });

  it("renders waiter dashboard data and fetches dashboard tables on mount", async () => {
    const { getAllByTestId, getByTestId, getByText, queryByText } =
      renderScreen();

    expect(getByText("Hey, Priya")).toBeTruthy();
    expect(getByText("Waiter")).toBeTruthy();
    expect(getByText("Today's Reservation")).toBeTruthy();
    expect(getByText("6")).toBeTruthy();
    expect(getByText("Active Orders")).toBeTruthy();
    expect(getByText("12")).toBeTruthy();
    expect(getByText("Pending Orders")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
    expect(getByText("Active Tables")).toBeTruthy();
    expect(getByText("View All")).toBeTruthy();
    expect(getByText("T-06")).toBeTruthy();
    expect(getByText("T-01")).toBeTruthy();
    expect(getByText("T-02")).toBeTruthy();
    expect(getByText("T-03")).toBeTruthy();
    expect(getByText("T-04")).toBeTruthy();
    expect(getByText("T-05")).toBeTruthy();
    expect(getByTestId("mock-blue-calendar-icon")).toBeTruthy();
    expect(getAllByTestId("mock-logout-icon")).toHaveLength(1);
    expect(queryByText("Loader")).toBeNull();

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

  it("passes selected table to waiter order sheet", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("active-table-card-5"));

    expect(mockHandleTablePress).toHaveBeenCalledWith(
      expect.objectContaining({
        table_id: 5,
        table_number: "T-05",
      }),
    );
  });

  it("shows the loader when either dashboard slice is loading", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockState,
        waiterDashboard: {
          ...mockState.waiterDashboard,
          loading: true,
        },
      }),
    );

    const { getByTestId } = renderScreen();

    expect(getByTestId("mock-app-loader")).toBeTruthy();
  });

  it("clears the app session after logout is confirmed", async () => {
    const { findByTestId, getByText } = renderScreen();

    fireEvent.press(getByText("Logout"));
    expect(getByText("Confirmation")).toBeTruthy();
    expect(getByText("Are you sure you want to logout?")).toBeTruthy();

    fireEvent.press(await findByTestId("custom-alert-ok"));

    await waitFor(() => {
      expect(mockedClearAppSession).toHaveBeenCalledTimes(1);
    });
  });

  it("renders an empty state when there are no active tables", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockState,
        waiterTables: {
          ...mockState.waiterTables,
          tables: [],
        },
      }),
    );

    const { getByText, queryByText } = renderScreen();

    expect(getByText("Active Tables")).toBeTruthy();
    expect(getByText("View All")).toBeTruthy();
    expect(queryByText("T-01")).toBeNull();
    expect(queryByText("T-02")).toBeNull();
    expect(queryByText("T-03")).toBeNull();
    expect(queryByText("T-04")).toBeNull();
    expect(queryByText("T-05")).toBeNull();
  });

  it("passes add item action to waiter order sheet", () => {
    const useWaiterOrderSheet = require("../../useWaiterOrderSheet").default;

    useWaiterOrderSheet.mockReturnValue({
      orders: [],
      orderLoading: false,
      orderSheetVisible: true,
      selectedTable: null,
      selectedOrder: null,
      setOrderSheetVisible: mockSetOrderSheetVisible,
      handleTableSelection: mockHandleTablePress,
      navigateToMenuScreen: mockNavigateToMenuScreen,
      navigateToGenerateBillScreen: mockNavigateToGenerateBillScreen,
    });

    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("add-item-button"));

    expect(mockNavigateToMenuScreen).toHaveBeenCalled();
  });
  it("passes generate bill action to waiter order sheet", () => {
    const useWaiterOrderSheet = require("../../useWaiterOrderSheet").default;

    useWaiterOrderSheet.mockReturnValue({
      orders: [],
      orderLoading: false,
      orderSheetVisible: true,
      selectedTable: null,
      selectedOrder: null,
      setOrderSheetVisible: mockSetOrderSheetVisible,
      handleTableSelection: mockHandleTablePress,
      navigateToMenuScreen: mockNavigateToMenuScreen,
      navigateToGenerateBillScreen: mockNavigateToGenerateBillScreen,
    });

    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("generate-bill-button"));

    expect(mockNavigateToGenerateBillScreen).toHaveBeenCalled();
  });
});
