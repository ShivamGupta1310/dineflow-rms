import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import WaiterPasscode from "../index";
import { waiterPasscodeHookReturn } from "./mockData";
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockUseWaiterPasscode = jest.fn();
const mockHandleLogin = jest.fn();

jest.mock("../useWaiterPasscode", () => ({
  useWaiterPasscode: () => mockUseWaiterPasscode(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: any) => (
      <View {...props}>{children}</View>
    ),
  };
});

jest.mock("@components/AppHeader", () => {
  const { Text, TouchableOpacity, View } = require("react-native");
  return ({ title, onGoBack }: any) => (
    <View>
      <TouchableOpacity testID="app-header-back" onPress={onGoBack} />
      <Text>{title}</Text>
    </View>
  );
});

jest.mock("@components/common/AppButton", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return ({ title, onPress, disabled, testID }: any) => (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock("../../../../components/OTPInput", () => {
  const { TextInput } = require("react-native");
  const MockOTPInput = ({ value, onChangeText }: any) => (
    <TextInput testID="otp-input" value={value} onChangeText={onChangeText} />
  );

  return {
    __esModule: true,
    default: MockOTPInput,
  };
});

jest.mock("@components/rn-view/rn-view.component", () => {
  const { View } = require("react-native");
  return {
    RNView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock("@components/rn-text/rn-text.component", () => {
  const { Text } = require("react-native");
  return {
    RNText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

jest.mock("@assets", () => ({
  SVGS: {
    DineSetupLogo: () => null,
    Waiterlogo: () => null,
  },
}));

describe("WaiterPasscode", () => {
  beforeEach(() => {
    mockUseWaiterPasscode.mockReturnValue({
      t: (key: string) => key,
      handleLogin: mockHandleLogin,
      ...waiterPasscodeHookReturn,
    });
  });

  it("renders selected waiter details and wires login", () => {
    const { getByText, getByTestId } = render(<WaiterPasscode />);

    expect(getByText("Ravi Patel")).toBeTruthy();
    expect(getByText("waiter.waiterPasscode.enterPasscode")).toBeTruthy();
    expect(getByTestId("otp-input")).toBeTruthy();
    expect(getByTestId("waiter-passcode-login")).toBeTruthy();
    expect(
      getByTestId("waiter-passcode-login").props.accessibilityState.disabled,
    ).toBe(true);

    fireEvent.press(getByTestId("app-header-back"));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("renders the fallback waiter name and avatar when none is selected", () => {
    mockUseWaiterPasscode.mockReturnValueOnce({
      selectedWaiter: null,
      ownerId: null,
      waiterName: "",
      passcode: "123456",
      setPasscode: jest.fn(),
      isPasscodeValid: true,
      t: (key: string) => key,
      isRTL: true,
      loading: false,
      handleLogin: mockHandleLogin,
    });

    const { getByText, getByTestId } = render(<WaiterPasscode />);

    expect(getByText("waiter.waiterPasscode.defaultWaiter")).toBeTruthy();
    expect(
      getByTestId("waiter-passcode-login").props.accessibilityState.disabled,
    ).toBe(false);

    fireEvent.press(getByTestId("waiter-passcode-login"));
    expect(mockHandleLogin).toHaveBeenCalled();
  });
});
