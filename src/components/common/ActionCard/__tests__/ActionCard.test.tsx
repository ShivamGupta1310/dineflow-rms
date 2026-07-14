import React from "react";
import { Text } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { GlobalContext } from "../../../../contexts/global.provider";
import ActionCard from "../index";

describe("ActionCard", () => {
  const renderWithContext = (isRTL = false) =>
    render(
      <GlobalContext.Provider
        value={{
          language: "en" as any,
          setLanguage: jest.fn(),
          isRTL,
          setIsRTL: jest.fn(),
        }}
      >
        <ActionCard
          icon={<Text testID="action-icon">Icon</Text>}
          title="Waiter Login"
          onPress={jest.fn()}
          testID="action-card"
        />
      </GlobalContext.Provider>,
    );

  it("renders the icon, title, and arrow", () => {
    const { getByTestId, getByText } = renderWithContext(false);

    expect(getByTestId("action-icon")).toBeTruthy();
    expect(getByText("Waiter Login")).toBeTruthy();
    expect(getByText("›")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();

    const { getByTestId } = render(
      <GlobalContext.Provider
        value={{
          language: "en" as any,
          setLanguage: jest.fn(),
          isRTL: false,
          setIsRTL: jest.fn(),
        }}
      >
        <ActionCard
          icon={<Text testID="action-icon">Icon</Text>}
          title="Waiter Login"
          onPress={onPress}
          testID="action-card"
        />
      </GlobalContext.Provider>,
    );

    fireEvent.press(getByTestId("action-card"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("keeps the current arrow glyph in RTL", () => {
    const { getByText } = renderWithContext(true);

    expect(getByText("›")).toBeTruthy();
  });
});
