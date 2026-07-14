import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import GlobalProvider from "../../../../../contexts/global.provider";
import DashboardScreen from "../index";
import { clearAppSession } from "@utils/authSession";
import { fetchOwnerDashboard } from "@store/slices/ownerDashboardSlice";
import { fetchOwnerTables } from "@store/slices/ownerTablesSlice";
import { ROUTES } from "@constants/routes";
import { mockState } from "../__mocks__/dashboardMockData";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockFetchOwnerDashboard = jest.fn(() => ({
  type: "ownerDashboard/fetchOwnerDashboard",
}));
const mockFetchOwnerTables = jest.fn(() => ({
  type: "ownerTables/fetchOwnerTables",
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "owner.dashboard.header.greeting": "Hey,",
        "owner.dashboard.header.role": "Restaurant Owner",
        "owner.dashboard.summary.salesTitle": "Today's Sales",
        "owner.dashboard.summary.periodThisWeek": "This Week",
        "owner.dashboard.activeTables.title": "Active Tables",
        "owner.dashboard.activeTables.viewAll": "View All",
        "owner.dashboard.activeTables.empty": "No active tables right now",
        "owner.dashboard.activeTables.unknownTime": "--:--",
        "owner.dashboard.stats.reservedTable": "Reserved\nTable",
        "owner.dashboard.stats.availableTables": "Available\nTables",
        "owner.dashboard.stats.totalOrders": "Total\nOrders",
        "auth.logoutConfirmation.title": "Logout",
        "auth.logoutConfirmation.subtitle": "Are you sure you want to logout?",
        "common.yes": "Yes",
        "common.no": "No",
      };

      return translations[key] ?? key;
    },
  }),
}));

jest.mock("@utils/authSession", () => ({
  clearAppSession: jest.fn(),
}));

jest.mock("@store/slices/ownerDashboardSlice", () => ({
  fetchOwnerDashboard: jest.fn(),
}));

jest.mock("@store/slices/ownerTablesSlice", () => ({
  fetchOwnerTables: jest.fn(),
}));

jest.mock("../CustomChart", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    CustomChart: () => React.createElement(Text, {}, "CustomChart"),
  };
});

jest.mock("../GiftedChartComponent", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    GiftedChartComponent: () => React.createElement(Text, {}, "GiftedChartComponent"),
  };
});

jest.mock("@assets", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SVGS: {
      ProfitIcon: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-profit-icon" },
          "Profit",
        ),
      LossIcon: () =>
        ReactModule.createElement(Text, { testID: "mock-loss-icon" }, "Loss"),
      CalendarIcon: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-calendar-icon" },
          "Calendar",
        ),
      ProfileIcon: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-active-table-profile-icon" },
          "Profile",
        ),
      QRCodeWhiteLogo: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-qr-code-logo" },
          "QRCode",
        ),
    },
    TableSVG: () =>
      ReactModule.createElement(Text, { testID: "mock-table-svg" }, "TableSVG"),
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
const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;
const mockedClearAppSession = clearAppSession as jest.MockedFunction<
  typeof clearAppSession
>;
const mockedFetchOwnerDashboard = fetchOwnerDashboard as jest.MockedFunction<
  typeof fetchOwnerDashboard
>;
const mockedFetchOwnerTables = fetchOwnerTables as jest.MockedFunction<
  typeof fetchOwnerTables
>;

describe("DashboardScreen", () => {
  const renderScreen = () =>
    render(
      <GlobalProvider>
        <DashboardScreen />
      </GlobalProvider>,
    );

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-06-17T00:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseSelector.mockImplementation((selector) => selector(mockState));
    mockedUseNavigation.mockReturnValue({ navigate: mockNavigate } as any);
    mockedUseFocusEffect.mockImplementation((effect) => {
      effect();
    });
    mockedClearAppSession.mockResolvedValue(undefined);
    mockedFetchOwnerDashboard.mockImplementation(
      mockFetchOwnerDashboard as typeof fetchOwnerDashboard,
    );
    mockedFetchOwnerTables.mockImplementation(
      mockFetchOwnerTables as typeof fetchOwnerTables,
    );
    mockDispatch.mockImplementation((action) => action);
  });

  it("renders owner dashboard data and fetches dashboard tables on mount", async () => {
    const {
      getAllByTestId,
      getByTestId,
      getByText,
      queryAllByTestId,
      getAllByText,
    } = renderScreen();

    expect(getByText("Hey, Priya")).toBeTruthy();
    expect(getByText("Restaurant Owner")).toBeTruthy();
    expect(getByText(moment().format("MMMM YYYY"))).toBeTruthy();
    expect(getByTestId("owner-header-profile-button")).toBeTruthy();
    expect(getByTestId("owner-header-profile-image")).toBeTruthy();
    expect(getByTestId("mock-calendar-icon")).toBeTruthy();
    expect(getByText("Today's Sales")).toBeTruthy();
    expect(getByText("₹1,23,456")).toBeTruthy();
    expect(getByText("12%")).toBeTruthy();
    expect(getByText("This Week")).toBeTruthy();
    expect(getByText("Reserved Table")).toBeTruthy();
    expect(getByText("18")).toBeTruthy();
    expect(getByText("3%")).toBeTruthy();
    expect(getByText("Available Tables")).toBeTruthy();
    expect(getByText("Total Orders")).toBeTruthy();
    expect(getByText("54")).toBeTruthy();
    expect(getByText("8%")).toBeTruthy();
    expect(getAllByTestId("mock-profit-icon")).toHaveLength(2);
    expect(queryAllByTestId("mock-loss-icon")).toHaveLength(1);
    expect(getByText("Active Tables (2)")).toBeTruthy();
    expect(getByText("View All")).toBeTruthy();
    expect(getAllByText("A1").length).toBeGreaterThan(0);
    expect(getAllByText("4").length).toBeGreaterThan(0);
    expect(
      getAllByText(moment("2026-06-17T11:30:00.000Z").format("hh:mm A")).length,
    ).toBeGreaterThan(0);
    expect(getAllByText("5").length).toBeGreaterThan(0);
    expect(getAllByText("2").length).toBeGreaterThan(0);
    expect(getAllByText("--").length).toBeGreaterThan(0);
    expect(
      getAllByTestId("mock-active-table-profile-icon").length,
    ).toBeGreaterThan(0);

    await waitFor(() => {
      expect(mockedFetchOwnerDashboard).toHaveBeenCalledTimes(1);
      expect(mockedFetchOwnerTables).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ownerDashboard/fetchOwnerDashboard",
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ownerTables/fetchOwnerTables",
      });
    });
    expect(getAllByTestId("mock-profit-icon")).toHaveLength(2);
  });

  it("navigates to the tables tab when view all is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("dashboard-view-all-button"));

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TABLES);
  });

  it("clears the app session after logout is confirmed", async () => {
    const { findByTestId, getByTestId } = renderScreen();

    fireEvent.press(getByTestId("owner-header-profile-button"));
    fireEvent.press(await findByTestId("custom-alert-ok"));

    await waitFor(() => {
      expect(mockedClearAppSession).toHaveBeenCalledTimes(1);
    });
  });
});
