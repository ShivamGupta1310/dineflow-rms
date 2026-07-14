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
  waiterOrder,
} from "../__mocks__/mockData";

const mockSetSelectedStatus = jest.fn();
const mockHandleSearchClick = jest.fn();
const mockHandleRefresh = jest.fn();
const mockHandleTablePress = jest.fn();
const mockGetStatusTitle = jest.fn();
const mockSetOrderSheetVisible = jest.fn();

jest.mock("../useTableList");

jest.mock("@components", () => {
  const ReactMock = require("react");
  const { Pressable, Text, View } = require("react-native");

  return {
    AppLoader: () =>
      ReactMock.createElement(Text, { testID: "app-loader" }, "Loading"),
    Header: ({ leftSlot, rightActions, title, subtitle }: any) => (
      <View>
        <View>
          {leftSlot}
          <View>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
          </View>
          {rightActions?.map?.((action: any) => action.icon ?? action)}
        </View>
      </View>
    ),
    IconButton: ({ icon, onPress, testID }: any) => (
      <Pressable onPress={onPress} testID={testID}>
        {icon}
      </Pressable>
    ),
    RNText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
    RNView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    WaiterTableGridItem: ({ item, onPress }: any) => (
      <Pressable
        testID={`table-grid-item-${item.table_id}`}
        onPress={() => onPress?.(item)}
      >
        <Text>{item.table_number}</Text>
        <Text>{String(item.capacity)}</Text>
      </Pressable>
    ),
    OrderListSheet: () => null,
    HorizontalStatusTabs: require("../../../../../components/HorizontalStatusTabs").default,
  };
});

jest.mock("@assets/svgXML", () => {
  const ReactMock = require("react");
  const { Text } = require("react-native");

  return {
    SearchIcon: () =>
      ReactMock.createElement(Text, { testID: "search-icon" }, "Search"),
    TableSVG: () =>
      ReactMock.createElement(Text, { testID: "status-guide-icon" }, "Table"),
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
    getStatusTitle: mockGetStatusTitle,
    navigation: { navigate: jest.fn() },
    orderSheetVisible: false,
    setOrderSheetVisible: mockSetOrderSheetVisible,
    orders: waiterOrder.orders,
    selectedTable: mockTables[0],
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

    expect(getByText("Manage all restaurant tables")).toBeTruthy();
    expect(getByTestId("search-table-button")).toBeTruthy();
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
    fireEvent.press(getByText("Available (2)"));

    expect(mockHandleSearchClick).toHaveBeenCalledTimes(1);
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
});
