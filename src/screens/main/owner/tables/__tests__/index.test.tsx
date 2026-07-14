import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { colors } from "@theme/colors";
import { GlobalContext } from "../../../../../contexts/global.provider";
import TableList from "../index";
import useTableList from "../useTableList";
import {
  baseStatusGuideCards,
  baseTabs,
  tables as mockTables,
  translations,
} from "../__mocks__/mockData";

const mockSetSelectedStatus = jest.fn();
const mockHandleSearchClick = jest.fn();
const mockHandleFilterClick = jest.fn();
const mockHandleRefresh = jest.fn();
const mockHandleTablePress = jest.fn();

jest.mock("../useTableList");

jest.mock("@components/common", () => {
  const actual = jest.requireActual("@components/common");
  const ReactMock = require("react");
  const { Text } = require("react-native");

  return {
    ...actual,
    AppLoader: () =>
      ReactMock.createElement(Text, { testID: "app-loader" }, "Loading"),
  };
});

jest.mock("@assets", () => {
  const ReactMock = require("react");
  const { Text } = require("react-native");

  return {
    SVGS: {
      SearchIcon: () =>
        ReactMock.createElement(Text, { testID: "search-icon" }, "Search"),
      FilterIcon: () =>
        ReactMock.createElement(Text, { testID: "filter-icon" }, "Filter"),
      DineSetupLogo: () =>
        ReactMock.createElement(
          Text,
          { testID: "dine-setup-logo" },
          "DineSetupLogo",
        ),
    },
    TableSVG: () =>
      ReactMock.createElement(Text, { testID: "status-guide-icon" }, "Table"),
  };
});

jest.mock("@components/TableGridItem", () => {
  const ReactMock = require("react");
  const { Pressable, Text } = require("react-native");

  return {
    __esModule: true,
    default: ({ item, onPress }: any) =>
      ReactMock.createElement(
        Pressable,
        {
          testID: `table-grid-item-${item.table_id}`,
          onPress: () => onPress?.(item),
        },
        ReactMock.createElement(Text, null, item.table_number),
        ReactMock.createElement(Text, null, String(item.capacity)),
      ),
  };
});

const mockedUseTableList = useTableList as jest.MockedFunction<
  typeof useTableList
>;

function createHookReturn(
  overrides: Partial<ReturnType<typeof useTableList>> = {},
) {
  return {
    t: (key: string) => translations[key] ?? key,
    isRTL: false,
    selectedStatus: "all",
    setSelectedStatus: mockSetSelectedStatus,
    tables: mockTables,
    tabs: baseTabs,
    statusGuideCards: baseStatusGuideCards,
    refreshing: false,
    loading: false,
    handleRefresh: mockHandleRefresh,
    handleTablePress: mockHandleTablePress,
    handleSearchClick: mockHandleSearchClick,
    handleFilterClick: mockHandleFilterClick,
    navigation: { navigate: jest.fn() },
    ...overrides,
  } as ReturnType<typeof useTableList>;
}

describe("TableList", () => {
  const renderScreen = (
    isRTL = false,
    hookOverrides: Partial<ReturnType<typeof useTableList>> = {},
  ) => {
    mockedUseTableList.mockReturnValue(
      createHookReturn({ isRTL, ...hookOverrides }),
    );

    return render(
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
        <TableList />
      </GlobalContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseTableList.mockReturnValue(createHookReturn());
  });

  it("renders the table screen header, tabs, grid, and guide cards", () => {
    const { getByText, getByTestId, getAllByTestId } = renderScreen();

    expect(getByText("Tables")).toBeTruthy();
    expect(getByText("Manage restaurant tables")).toBeTruthy();
    expect(getByTestId("search-table-button")).toBeTruthy();
    expect(getByTestId("bill-summary-print-button")).toBeTruthy();
    expect(
      getByTestId("table-list-scroll").props.refreshControl.props.onRefresh,
    ).toBe(mockHandleRefresh);
    expect(
      getByTestId("table-list-scroll").props.refreshControl.props.refreshing,
    ).toBe(false);
    expect(getByText("All (4)")).toBeTruthy();
    expect(getByText("Available (2)")).toBeTruthy();
    expect(getByText("Occupied (1)")).toBeTruthy();
    expect(getByText("Reserved (0)")).toBeTruthy();
    expect(getByText("Ready To Pay (1)")).toBeTruthy();
    expect(getByTestId("table-grid-item-1")).toBeTruthy();
    expect(getByTestId("table-grid-item-2")).toBeTruthy();
    expect(getByTestId("table-grid-item-3")).toBeTruthy();
    expect(getByTestId("table-grid-item-4")).toBeTruthy();
    expect(getByTestId("status-guide-grid")).toBeTruthy();
    expect(getByTestId("status-guide-card-available")).toHaveStyle({
      backgroundColor: colors.statusAvailableBG,
    });
    expect(getByTestId("status-guide-card-occupied")).toHaveStyle({
      backgroundColor: colors.statusOccupiedBG,
    });
    expect(getByTestId("status-guide-card-reserved")).toHaveStyle({
      backgroundColor: colors.statusReservedBG,
    });
    expect(getByTestId("status-guide-card-ready-to-pay")).toHaveStyle({
      backgroundColor: colors.statusReadyToPayBG,
    });
    expect(getAllByTestId("status-guide-icon")).toHaveLength(4);
  });

  it("shows the loading overlay when the hook reports loading", () => {
    const { getByTestId } = renderScreen(false, {
      loading: true,
    });

    expect(getByTestId("app-loader")).toBeTruthy();
  });

  it("calls the hook handlers when the action buttons and tabs are pressed", () => {
    const { getByTestId, getByText } = renderScreen();

    fireEvent.press(getByTestId("search-table-button"));
    fireEvent.press(getByTestId("bill-summary-print-button"));
    fireEvent.press(getByText("Available (2)"));

    expect(mockHandleSearchClick).toHaveBeenCalledTimes(1);
    expect(mockHandleFilterClick).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedStatus).toHaveBeenCalledWith("available");
  });

  it("navigates ready to pay tables through the hook press handler", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("table-grid-item-4"));

    expect(mockHandleTablePress).toHaveBeenCalledTimes(1);
    expect(mockHandleTablePress).toHaveBeenCalledWith(
      expect.objectContaining({
        table_id: 4,
        status: "ready to pay",
      }),
    );
  });

  it("filters table items when the selected status is not all", () => {
    const { getAllByTestId, queryByTestId } = renderScreen(false, {
      selectedStatus: "available",
      tables: mockTables,
    });

    expect(getAllByTestId(/table-grid-item-/)).toHaveLength(2);
    expect(queryByTestId("table-grid-item-1")).toBeNull();
  });

  it("applies the RTL container style when the global context is RTL", () => {
    const { getByTestId, getByText } = renderScreen(true);

    expect(getByTestId("table-list-root")).toBeTruthy();
    expect(getByTestId("table-list-scroll")).toBeTruthy();
    expect(getByTestId("horizontal-status-tabs")).toBeTruthy();
    expect(
      getByTestId("horizontal-status-tabs-list").props.contentContainerStyle,
    ).toEqual(expect.arrayContaining([expect.any(Object)]));
    expect(getByTestId("horizontal-status-tab-1")).toBeTruthy();
    expect(getByText("Status Guide")).toBeTruthy();
    expect(getByText("Understand each table state.")).toBeTruthy();
  });

  it("renders NoDataView when the tables list is empty", () => {
    const { getByTestId, queryByTestId } = renderScreen(false, {
      tables: [],
    });

    expect(getByTestId("no-data-view")).toBeTruthy();
    expect(getByTestId("no-data-view-title")).toBeTruthy();
    expect(getByTestId("no-data-view-message")).toBeTruthy();
    expect(queryByTestId("table-grid-item-1")).toBeNull();
  });

  it("does not render NoDataView when tables list is empty but loading is true", () => {
    const { queryByTestId } = renderScreen(false, {
      tables: [],
      loading: true,
    });

    expect(queryByTestId("no-data-view")).toBeNull();
  });
});
