import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import GlobalProvider from "../../../../../contexts/global.provider";
import { useQRCodeAccess } from "../useQRCodeAccess";

jest.mock("../useQRCodeAccess");

jest.mock("@react-native-clipboard/clipboard", () => ({
  setString: jest.fn(),
}));

jest.mock("react-native-qrcode-svg", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return ({ value }: { value: string }) =>
    ReactModule.createElement(Text, { testID: "mock-qr-code" }, value);
});

jest.mock("@components/AppHeader", () => {
  const ReactModule = require("react");
  const { Pressable, Text, View } = require("react-native");

  return ({ title, onGoBack }: any) =>
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
    );
});

jest.mock("@components/common", () => {
  const ReactModule = require("react");
  const { Pressable, Text, View } = require("react-native");

  return {
    ActionCard: ({ title, subtitle, onPress, testID, rightContainer }: any) =>
      ReactModule.createElement(
        Pressable,
        { testID, onPress },
        ReactModule.createElement(Text, null, title),
        subtitle ? ReactModule.createElement(Text, null, subtitle) : null,
        ReactModule.createElement(
          View,
          { testID: "mock-action-card-right-container" },
          rightContainer,
        ),
      ),
  };
});

jest.mock("@assets", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SVGS: {
      DishIcon: () => ReactModule.createElement(Text, null, "DishIcon"),
      DineSetupLogo: () =>
        ReactModule.createElement(Text, null, "DineSetupLogo"),
      QuotationMark: () =>
        ReactModule.createElement(Text, null, "QuotationMark"),
      CopyLogo: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-copy-logo" },
          "CopyLogo",
        ),
    },
  };
});

const mockedUseQRCodeAccess = useQRCodeAccess as jest.MockedFunction<
  typeof useQRCodeAccess
>;

import QRCodeAccessScreen from "../index";

describe("QRCodeAccess Screen", () => {
  const mockHandleScanQRCode = jest.fn();
  const mockHandleGoBack = jest.fn();

  const renderScreen = () =>
    render(
      <GlobalProvider>
        <QRCodeAccessScreen />
      </GlobalProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseQRCodeAccess.mockReturnValue({
      t: (key: string) => key as any,
      ownerAccessCode: "12345",
      handleScanQRCode: mockHandleScanQRCode,
      handleGoBack: mockHandleGoBack,
    });
  });

  it("renders qr code access content with owner access code", () => {
    const { getByText, getByTestId, getAllByText } = renderScreen();

    expect(getByText("auth.qrCodeAccess.description")).toBeTruthy();
    expect(getByText("auth.qrCodeAccess.accessCode")).toBeTruthy();
    expect(getByText("auth.qrCodeAccess.welcomeQuote")).toBeTruthy();
    expect(getByText("DineSetupLogo")).toBeTruthy();
    expect(getByText("QuotationMark")).toBeTruthy();
    expect(getAllByText("12345")).toHaveLength(2);
    expect(getByTestId("mock-qr-code")).toBeTruthy();
  });

  it("calls go back when header back is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("app-header-back"));

    expect(mockHandleGoBack).toHaveBeenCalledTimes(1);
  });

  it("calls handleScanQRCode when access card is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("owner-waiter-login-button"));

    expect(mockHandleScanQRCode).toHaveBeenCalledTimes(1);
  });

  it("hides qr code and separator when owner access code is empty", () => {
    mockedUseQRCodeAccess.mockReturnValue({
      t: (key: string) => key as any,
      ownerAccessCode: "",
      handleScanQRCode: mockHandleScanQRCode,
      handleGoBack: mockHandleGoBack,
    });

    const { queryByTestId } = renderScreen();

    expect(queryByTestId("mock-qr-code")).toBeNull();
  });
});
