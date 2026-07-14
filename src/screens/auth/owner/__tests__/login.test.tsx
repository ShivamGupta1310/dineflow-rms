import {
  fireEvent,
  render
} from "@testing-library/react-native";
import React from "react";

import Login from "..";
import { useOwnerLogin } from "../useOwnerLogin";

jest.mock("../useOwnerLogin");

jest.mock("@utils/authSession", () => ({
  OWNER_ROLE: "owner",
  CAPTAIN_ROLE: "captain",
}));

jest.mock("@components/LanguageSheet", () => {
  const { Button } = require("react-native");
  return jest.fn(({ onApply, visible }) => {
    if (!visible) return null;
    return (
      <Button
        testID="language-apply"
        title="Apply Language"
        onPress={() => onApply("en")}
      />
    );
  });
});

jest.mock("@assets", () => ({
  SVGS: {
    DineSetupLogo: () => null,
    IndiaFlag: () => null,
    TickedIcon: () => null,
    DishIcon: () => null,
  },
}));

jest.mock("@components", () => {
  const { Pressable, Text, TextInput, View } = require("react-native");

  return {
    AppLayout: ({ children, title, subtitle, onLanguagePress, language }: any) => (
      <View testID="app-layout">
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
        <Pressable testID="language-chip" onPress={onLanguagePress}>
          <Text>{language}</Text>
        </Pressable>
        {children}
      </View>
    ),
    AppButton: ({ title, onPress, testID, loading, disabled }: any) => (
      <Pressable
        onPress={onPress}
        testID={testID}
        accessibilityState={{ disabled: Boolean(disabled || loading) }}
      >
        <Text>{title}</Text>
      </Pressable>
    ),
    AppTextInput: ({
      label,
      placeholder,
      value,
      onChangeText,
      error,
      prefix,
      leftAccessory,
    }: any) => (
      <View testID="owner-mobile-input-wrapper">
        <Text>{label}</Text>
        <Text>{placeholder}</Text>
        <Text>{prefix}</Text>
        {leftAccessory}
        <TextInput
          testID="owner-mobile-input"
          value={value}
          onChangeText={onChangeText}
        />
        {!!error && <Text>{error}</Text>}
      </View>
    ),
    ActionCard: ({ icon, title, onPress, testID }: any) => (
      <Pressable onPress={onPress} testID={testID}>
        {icon}
        <Text>{title}</Text>
      </Pressable>
    ),
    RNText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
    RNView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    LanguageSheet: ({ onApply }: any) => {
      return (
        <Pressable testID="language-apply" onPress={() => onApply("en")}>
          <Text>Apply</Text>
        </Pressable>
      );
    },
  };
});

const mockedUseOwnerLogin = useOwnerLogin as jest.MockedFunction<
  typeof useOwnerLogin
>;

describe("Owner Login Screen", () => {
  const mockHandleMobileChange = jest.fn();
  const mockHandleContinue = jest.fn();
  const mockToggleRememberMe = jest.fn();
  const mockHandleWaiterOnboarding = jest.fn();
  const mockToggleLanguageSheet = jest.fn();
  const mockOnLanguageChipPress = jest.fn();
  const mockHandleLanguageApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseOwnerLogin.mockReturnValue({
      COUNTRY_CODE: 91,
      isRTL: false,
      loading: false,
      mobileNumber: "9876543210",
      mobileErrorText: null,
      submitError: null,
      rememberMe: true,
      showLanguageSheet: true,
      language: "AR",
      toggleLanguageSheet: mockToggleLanguageSheet,
      onLanguageChipPress: mockOnLanguageChipPress,
      handleLanguageApply: mockHandleLanguageApply,
      t: ((key: string) => key) as any,
      handleMobileChange: mockHandleMobileChange,
      handleContinue: mockHandleContinue,
      toggleRememberMe: mockToggleRememberMe,
      handleWaiterOnboarding: mockHandleWaiterOnboarding,
    });
  });

  it("renders the owner auth UI", () => {
    const { getByText, getByTestId } = render(<Login />);

    expect(getByText("common.dineflow")).toBeTruthy();
    expect(getByText("auth.login.welcomeTitle")).toBeTruthy();
    expect(getByText("auth.login.welcomeSubtitle")).toBeTruthy();
    expect(getByText("auth.login.mobileLabel")).toBeTruthy();
    expect(getByText("auth.login.continue")).toBeTruthy();
    expect(getByText("auth.login.waiterLogin")).toBeTruthy();
    expect(getByTestId("owner-mobile-input")).toBeTruthy();
  });

  it("wires the mobile input and action buttons", () => {
    const { getByTestId, getByText } = render(<Login />);

    fireEvent.changeText(getByTestId("owner-mobile-input"), "1234567890");
    fireEvent.press(getByText("auth.login.continue"));
    fireEvent.press(getByText("auth.login.rememberMe"));
    fireEvent.press(getByTestId("owner-waiter-login-button"));
  });

  it("calls the handlers from the owner login hook", () => {
    const { getByText, getByTestId } = render(<Login />);

    fireEvent.press(getByText("auth.login.continue"));
    fireEvent.press(getByText("auth.login.rememberMe"));
    fireEvent.press(getByTestId("owner-waiter-login-button"));

    expect(mockHandleContinue).toHaveBeenCalledTimes(1);
    expect(mockToggleRememberMe).toHaveBeenCalledTimes(1);
    expect(mockHandleWaiterOnboarding).toHaveBeenCalledTimes(1);
  });

  test("change the language and apply", async () => {
    const { getByTestId } = render(<Login />);

    const applyButton = getByTestId("language-apply");

    fireEvent.press(applyButton);

    expect(mockHandleLanguageApply).toHaveBeenCalledTimes(1);
    expect(mockHandleLanguageApply).toHaveBeenCalledWith("en");
  });

  it("renders submit error and disabled state for loading RTL layout", () => {
    mockedUseOwnerLogin.mockReturnValueOnce({
      COUNTRY_CODE: 91,
      isRTL: true,
      loading: true,
      mobileNumber: "9876543210",
      mobileErrorText: null,
      submitError: "auth.login.errors.otpFailed",
      rememberMe: false,
      language: "EN",
      showLanguageSheet: false,
      toggleLanguageSheet: mockToggleLanguageSheet,
      onLanguageChipPress: mockOnLanguageChipPress,
      handleLanguageApply: mockHandleLanguageApply,
      t: ((key: string) => key) as any,
      handleMobileChange: mockHandleMobileChange,
      handleContinue: mockHandleContinue,
      toggleRememberMe: mockToggleRememberMe,
      handleWaiterOnboarding: mockHandleWaiterOnboarding,
    });

    const {getByText, getByTestId} = render(<Login />);

    expect(getByText("auth.login.errors.otpFailed")).toBeTruthy();
    expect(getByTestId("owner-login-continue").props.accessibilityState.disabled).toBe(true);
  });
});
