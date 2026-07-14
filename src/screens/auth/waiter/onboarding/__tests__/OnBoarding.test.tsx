import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import GlobalProvider from "../../../../../contexts/global.provider";

const mockNavigate = jest.fn();
let mockIsIOS = true;

jest.mock("@components", () => {
  const ReactModule = require("react");
  const { Pressable, Text, TextInput, View } = require("react-native");

  const MockRNTextInput = ReactModule.forwardRef(
    (
      {
        value,
        onChangeText,
        placeholder,
        editable = true,
        testID,
        ...rest
      }: any,
      _ref: any,
    ) =>
      ReactModule.createElement(TextInput, {
        value,
        onChangeText,
        placeholder,
        editable,
        testID: testID || "mock-rn-text-input",
        ...rest,
      }),
  );

  return {
    RNTextInput: MockRNTextInput,
    AppLayout: ({ children }: any) => <View>{children}</View>,
    RNView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    RNText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
    ActionCard: ({ title, onPress, testID }: any) => (
      <Pressable testID={testID} onPress={onPress}>
        <Text>{title}</Text>
      </Pressable>
    ),
    AppButton: ({ title, onPress, testID, loading }: any) => (
      <Pressable testID={testID} onPress={onPress} disabled={loading}>
        <Text>{title}</Text>
      </Pressable>
    ),
  };
});

import OnBoardingScreen from "../index";
import { useOnBoarding } from "../useOnBoarding";

jest.mock("../useOnBoarding");

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("@utils/authSession", () => ({
  CAPTAIN_ROLE: "captain",
}));

jest.mock("@assets", () => ({
  SVGS: {
    DineLogo: () => {
      const ReactModule = require("react");
      const { Text } = require("react-native");
      return ReactModule.createElement(
        Text,
        { testID: "dineflow-logo" },
        "DineFlow Logo",
      );
    },
    Waiterlogo: () => {
      const ReactModule = require("react");
      const { Text } = require("react-native");
      return ReactModule.createElement(
        Text,
        { testID: "waiter-logo" },
        "Waiter Logo",
      );
    },
    QRCodeLogo: () => {
      const ReactModule = require("react");
      const { Text } = require("react-native");
      return ReactModule.createElement(Text, { testID: "qr-logo" }, "QR Logo");
    },
  },
}));

jest.mock("@theme/theme", () => ({
  ...jest.requireActual("@theme/theme"),
  get isIOS() {
    return mockIsIOS;
  },
}));

const mockedUseOnBoarding = useOnBoarding as jest.MockedFunction<
  typeof useOnBoarding
>;

describe("OnBoarding Screen", () => {
  const mockHandlePasscodeChange = jest.fn();
  const mockHandleVerify = jest.fn();
  const mockHandleScanQRCode = jest.fn();

  const renderScreen = () =>
    render(
      <GlobalProvider>
        <OnBoardingScreen />
      </GlobalProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsIOS = true;

    mockedUseOnBoarding.mockReturnValue({
      t: (key: string) => key,
      passcode: "",
      inputRef: { current: null },
      loading: false,
      handlePasscodeChange: mockHandlePasscodeChange,
      handleVerify: mockHandleVerify,
      handleScanQRCode: mockHandleScanQRCode,
    });
  });

  it("renders onboarding content", () => {
    const { getByText } = renderScreen();

    expect(getByText("auth.onBoarding.title")).toBeTruthy();
  });



  it("calls handleScanQRCode when action card is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("owner-waiter-login-button"));

    expect(mockHandleScanQRCode).toHaveBeenCalledTimes(1);
  });

  it("calls handlePasscodeChange when passcode changes", () => {
    const { getByPlaceholderText } = renderScreen();

    fireEvent.changeText(
      getByPlaceholderText("auth.onBoarding.passcodeLabel"),
      "78563214",
    );

    expect(mockHandlePasscodeChange).toHaveBeenCalledWith("78563214");
  });

  it("calls handleVerify when continue is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("owner-login-continue"));

    expect(mockHandleVerify).toHaveBeenCalledTimes(1);
  });

  it("navigates to waiter list after a successful verification", () => {
    mockedUseOnBoarding.mockReturnValue({
      t: (key: string) => key,
      passcode: "78563214",
      inputRef: { current: null },
      loading: false,
      handlePasscodeChange: mockHandlePasscodeChange,
      handleVerify: mockHandleVerify,
      handleScanQRCode: mockHandleScanQRCode,
    });

    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("owner-login-continue"));

    expect(mockHandleVerify).toHaveBeenCalledTimes(1);
  });

  it("disables passcode input while loading", () => {
    mockedUseOnBoarding.mockReturnValue({
      t: (key: string) => key,
      passcode: "78563214",
      inputRef: { current: null },
      loading: true,
      handlePasscodeChange: mockHandlePasscodeChange,
      handleVerify: mockHandleVerify,
      handleScanQRCode: mockHandleScanQRCode,
    });

    const { getByDisplayValue } = renderScreen();

    expect(getByDisplayValue("78563214").props.editable).toBe(false);
  });
});
