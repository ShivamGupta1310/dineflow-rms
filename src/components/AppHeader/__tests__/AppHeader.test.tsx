import React from "react";
import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { TouchableOpacity } from "react-native";

import AppHeader from "../index";
import { GlobalContext } from "../../../contexts/global.provider";

jest.mock("@assets", () => ({
  SVGS: {
    Backlogo: () => {
      const ReactModule = require("react");
      const { Text } = require("react-native");

      return ReactModule.createElement(
        Text,
        { testID: "app-header-back-icon" },
        "Back Icon",
      );
    },
  },
}));

describe("AppHeader", () => {
  const renderWithContext = (ui: React.ReactElement) =>
    render(
      <GlobalContext.Provider
        value={{
          language: "en" as any,
          setLanguage: jest.fn(),
          isRTL: false,
          setIsRTL: jest.fn(),
        }}
      >
        {ui}
      </GlobalContext.Provider>,
    );

  it("renders the title", () => {
    const { getByText } = renderWithContext(<AppHeader title="DineFlow" />);

    expect(getByText("DineFlow")).toBeTruthy();
  });

  it("renders the back button and calls onGoBack when pressed", () => {
    const mockOnGoBack = jest.fn();

    const { getByTestId, UNSAFE_getByType } = renderWithContext(
      <AppHeader title="DineFlow" onGoBack={mockOnGoBack} />,
    );

    expect(getByTestId("app-header-back-icon")).toBeTruthy();

    fireEvent.press(UNSAFE_getByType(TouchableOpacity));

    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  it("does not render the back button when onGoBack is not provided", () => {
    const { queryByTestId } = renderWithContext(<AppHeader title="DineFlow" />);

    expect(queryByTestId("app-header-back-icon")).toBeNull();
  });
});
