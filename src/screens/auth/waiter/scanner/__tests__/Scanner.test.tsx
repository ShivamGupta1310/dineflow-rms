import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import GlobalProvider from "../../../../../contexts/global.provider";

const mockGoBack = jest.fn();
let mockIsIOS = true;

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(() => ({
    goBack: mockGoBack,
  })),
}));

jest.mock("@utils/authSession", () => ({
  CAPTAIN_ROLE: "captain",
}));

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
    BarcodeScanner: ({ onScan }: any) =>
      ReactModule.createElement(
        Pressable,
        {
          testID: "mock-barcode-scanner",
          onPress: () => onScan?.({ success: true, value: "123456" }),
        },
        ReactModule.createElement(Text, null, "Barcode Scanner"),
      ),
    AppHeader: ({ title, onGoBack }: any) =>
      ReactModule.createElement(
        View,
        null,
        onGoBack
          ? ReactModule.createElement(
              Pressable,
              { testID: "app-header-back", onPress: onGoBack },
              ReactModule.createElement(Text, null, "Back"),
            )
          : null,
        ReactModule.createElement(Text, null, title),
      ),
    AppButton: ({ title, onPress, testID, disabled }: any) =>
      ReactModule.createElement(
        Pressable,
        { onPress, testID, disabled },
        ReactModule.createElement(Text, null, title),
      ),
    AppLoader: () =>
      ReactModule.createElement(
        View,
        { testID: "full-screen-loader" },
        ReactModule.createElement(Text, null, "Loading"),
      ),
    RNView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    RNText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

jest.mock("@theme/theme", () => ({
  ...jest.requireActual("@theme/theme"),
  get isIOS() {
    return mockIsIOS;
  },
}));

import ScannerScreen from "../index";
import { useScanner } from "../useScanner";

jest.mock("../useScanner");

const mockedUseScanner = useScanner as jest.MockedFunction<typeof useScanner>;

describe("Scanner Screen", () => {
  const mockHandlePasscodeChange = jest.fn();
  const mockHandleVerify = jest.fn();
  const mockHandleScan = jest.fn();

  const renderScreen = () =>
    render(
      <GlobalProvider>
        <ScannerScreen />
      </GlobalProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsIOS = true;

    mockedUseScanner.mockReturnValue({
      t: (key: string) => key,
      passcode: "",
      isScanLoading: false,
      isButtonLoading: false,
      inputRef: { current: null },
      handlePasscodeChange: mockHandlePasscodeChange,
      handleBarcodeScan: jest.fn(),
      handleVerify: mockHandleVerify,
      handleScan: mockHandleScan,
      barcodeScannerRef: { current: null },
    });
  });

  it("renders scanner content", () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderScreen();

    expect(getByText("auth.barcodeScanner.description")).toBeTruthy();
    expect(getByText("auth.onBoarding.or")).toBeTruthy();
    expect(getByPlaceholderText("auth.onBoarding.passcodeLabel")).toBeTruthy();
    expect(getByTestId("scanner-continue-button")).toBeTruthy();
    expect(getByTestId("app-header-back")).toBeTruthy();
  });



  it("calls handlePasscodeChange when passcode changes", () => {
    const { getByPlaceholderText } = renderScreen();

    fireEvent.changeText(
      getByPlaceholderText("auth.onBoarding.passcodeLabel"),
      "78563214",
    );

    expect(mockHandlePasscodeChange).toHaveBeenCalledWith("78563214");
  });

  it("calls handleVerify with button source on continue press", () => {
    mockedUseScanner.mockReturnValue({
      t: (key: string) => key,
      passcode: "78563214",
      isScanLoading: false,
      isButtonLoading: false,
      inputRef: { current: null },
      handlePasscodeChange: mockHandlePasscodeChange,
      handleBarcodeScan: jest.fn(),
      handleVerify: mockHandleVerify,
      handleScan: mockHandleScan,
      barcodeScannerRef: { current: null },
    });

    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("scanner-continue-button"));

    expect(mockHandleVerify).toHaveBeenCalledWith("78563214", "button");
  });

  it("passes scan results to handleScan", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("mock-barcode-scanner"));

    expect(mockHandleScan).toHaveBeenCalledWith({
      success: true,
      value: "123456",
    });
  });

  it("navigates back when the header back button is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("app-header-back"));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("shows full screen loader while scan verification is running", () => {
    mockedUseScanner.mockReturnValue({
      t: (key: string) => key,
      passcode: "123456",
      isScanLoading: true,
      isButtonLoading: false,
      inputRef: { current: null },
      handlePasscodeChange: mockHandlePasscodeChange,
      handleBarcodeScan: jest.fn(),
      handleVerify: mockHandleVerify,
      handleScan: mockHandleScan,
      barcodeScannerRef: { current: null },
    });

    const { getByTestId, getByDisplayValue } = renderScreen();

    expect(getByTestId("full-screen-loader")).toBeTruthy();
    expect(getByDisplayValue("123456").props.editable).toBe(false);
  });

  it("disables input while button verification is running", () => {
    mockedUseScanner.mockReturnValue({
      t: (key: string) => key,
      passcode: "123456",
      isScanLoading: false,
      isButtonLoading: true,
      inputRef: { current: null },
      handlePasscodeChange: mockHandlePasscodeChange,
      handleBarcodeScan: jest.fn(),
      handleVerify: mockHandleVerify,
      handleScan: mockHandleScan,
      barcodeScannerRef: { current: null },
    });

    const { getByDisplayValue, queryByTestId } = renderScreen();

    expect(getByDisplayValue("123456").props.editable).toBe(false);
    expect(queryByTestId("full-screen-loader")).toBeNull();
  });
});
