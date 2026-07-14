import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import WaiterListScreen from "../index";
import { useWaiterList } from "../useWaiterList";
import { paddedStaffList } from "../__mocks__/waiterSelectionMockData";

jest.mock("../useWaiterList");

jest.mock("@utils/authSession", () => ({
  OWNER_ROLE: "owner",
  CAPTAIN_ROLE: "captain",
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");

  return {
    SafeAreaView: ({ children, ...props }: any) => (
      <View {...props}>{children}</View>
    ),
  };
});

jest.mock("@components", () => {
  const ReactMock = require("react");
  const { Pressable, Text, TouchableOpacity, View } = require("react-native");

  return {
    AppButton: ({ title, onPress, disabled, loading, style, testID }: any) => (
      <Pressable
        testID={testID}
        onPress={onPress}
        disabled={disabled || loading}
        style={style}
        accessibilityState={{ disabled: Boolean(disabled || loading) }}
      >
        <Text>{title}</Text>
      </Pressable>
    ),
    AppLoader: () =>
      ReactMock.createElement(
        Text,
        { testID: "waiter-selection-loader" },
        "Loading",
      ),
    RNView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    RNText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
    AppHeader: ({ title, onGoBack }: any) => (
      <View>
        <TouchableOpacity testID="app-header-back" onPress={onGoBack} />
        <Text>{title}</Text>
      </View>
    ),
  };
});

const mockedUseWaiterList = useWaiterList as jest.MockedFunction<
  typeof useWaiterList
>;

describe("WaiterSelection screen", () => {
  const mockHandleSelect = jest.fn();
  const mockHandleContinue = jest.fn();
  const mockHandleUnlink = jest.fn();
  const mockHandleBackPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseWaiterList.mockReturnValue({
      t: ((key: string) => key) as any,
      loading: false,
      unlinkLoading: false,
      error: null,
      isRTL: false,
      staffList: paddedStaffList,
      selectedId: null,
      NUM_COLUMNS: 3,
      getFullName: (staff: any) => `${staff.first_name} ${staff.last_name}`,
      handleSelect: mockHandleSelect,
      handleContinue: mockHandleContinue,
      handleUnlink: mockHandleUnlink,
      handleBackPress: mockHandleBackPress,
    });
  });

  it("renders the waiter grid and wires the actions", () => {
    const { getByText, getByTestId } = render(<WaiterListScreen />);

    fireEvent.press(getByTestId("app-header-back"));

    expect(getByText("Ravi Patel")).toBeTruthy();
    expect(getByText("Suresh Mehta")).toBeTruthy();
    expect(getByText("waiter.waiterList.unlinkWaiter")).toBeTruthy();
    expect(
      getByTestId("waiter-selection-continue").props.accessibilityState
        .disabled,
    ).toBe(true);

    fireEvent.press(getByTestId("waiter-card-19"));

    expect(mockHandleSelect).toHaveBeenCalledWith(19);

    fireEvent.press(getByText("waiter.waiterList.unlinkWaiter"));
    expect(mockHandleUnlink).toHaveBeenCalledTimes(1);
  });

  it("shows active continue styling when a waiter is selected", () => {
    mockedUseWaiterList.mockReturnValueOnce({
      t: ((key: string) => key) as any,
      loading: false,
      unlinkLoading: false,
      error: null,
      isRTL: false,
      staffList: paddedStaffList,
      selectedId: 19,
      NUM_COLUMNS: 3,
      getFullName: (staff: any) => `${staff.first_name} ${staff.last_name}`,
      handleSelect: mockHandleSelect,
      handleContinue: mockHandleContinue,
      handleUnlink: mockHandleUnlink,
      handleBackPress: mockHandleBackPress,
    });

    const { getByTestId } = render(<WaiterListScreen />);

    expect(
      getByTestId("waiter-selection-continue").props.accessibilityState
        .disabled,
    ).toBe(false);
    fireEvent.press(getByTestId("waiter-selection-continue"));
    expect(mockHandleContinue).toHaveBeenCalledTimes(1);
  });

  it("renders correctly when the hook is in rtl mode", () => {
    mockedUseWaiterList.mockReturnValueOnce({
      t: ((key: string) => key) as any,
      loading: false,
      unlinkLoading: false,
      error: null,
      isRTL: true,
      staffList: paddedStaffList,
      selectedId: null,
      NUM_COLUMNS: 3,
      getFullName: (staff: any) => `${staff.first_name} ${staff.last_name}`,
      handleSelect: mockHandleSelect,
      handleContinue: mockHandleContinue,
      handleUnlink: mockHandleUnlink,
      handleBackPress: mockHandleBackPress,
    });

    const { getByTestId } = render(<WaiterListScreen />);

    expect(getByTestId("waiter-selection-container").props.style).toMatchObject(
      {
        backgroundColor: "#FFFFFF",
        flex: 1,
      },
    );
  });

  it("shows the empty state when no active waiters are available", () => {
    mockedUseWaiterList.mockReturnValueOnce({
      t: ((key: string) => key) as any,
      loading: false,
      unlinkLoading: false,
      error: null,
      isRTL: false,
      staffList: [],
      selectedId: null,
      NUM_COLUMNS: 3,
      getFullName: (staff: any) => `${staff.first_name} ${staff.last_name}`,
      handleSelect: mockHandleSelect,
      handleContinue: mockHandleContinue,
      handleUnlink: mockHandleUnlink,
      handleBackPress: mockHandleBackPress,
    });

    const { getByText, queryByTestId, queryByText } = render(
      <WaiterListScreen />,
    );

    expect(getByText("waiter.waiterList.noActiveWaitersTitle")).toBeTruthy();
    expect(getByText("waiter.waiterList.noActiveWaitersSubtitle")).toBeTruthy();
    expect(queryByTestId("waiter-selection-continue")).toBeNull();
    expect(queryByText("waiter.waiterList.unlinkWaiter")).toBeNull();
  });

  it("shows the app loader while unlink is running", () => {
    mockedUseWaiterList.mockReturnValueOnce({
      t: ((key: string) => key) as any,
      loading: false,
      unlinkLoading: true,
      error: null,
      isRTL: false,
      staffList: paddedStaffList,
      selectedId: null,
      NUM_COLUMNS: 3,
      getFullName: (staff: any) => `${staff.first_name} ${staff.last_name}`,
      handleSelect: mockHandleSelect,
      handleContinue: mockHandleContinue,
      handleUnlink: mockHandleUnlink,
      handleBackPress: mockHandleBackPress,
    });

    const { getByTestId } = render(<WaiterListScreen />);

    expect(getByTestId("waiter-selection-loader")).toBeTruthy();
  });
});
