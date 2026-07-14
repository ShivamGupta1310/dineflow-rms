import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import OrderSummaryScreen from "../index";
import { useOrderSummary } from "../useOrderSummary";
import {
  mockOrderItems,
  mockHandleBack,
  mockHandleConfirmedOrder,
  mockUseOrderSummary,
  mockUseOrderSummaryLoading,
  mockUseOrderSummaryNoTable,
  mockUseOrderSummaryMobileError,
  mockUseOrderSummaryMultipleItems,
} from "../__mocks__/mockData";

jest.mock("../useOrderSummary");

jest.mock("@assets", () => ({
  SVGS: {
    Backlogo: () => null,
    IndiaFlag: () => null,
  },
  TableSVG: () => null,
}));

jest.mock("@components", () => {
  const { Text, View, TouchableOpacity, TextInput } = require("react-native");

  return {
    Header: ({ title, leftAction }: any) => (
      <View>
        <Text>{title}</Text>
        <TouchableOpacity testID="back-button" onPress={leftAction.onPress} />
      </View>
    ),

    AppLoader: () => <Text testID="loader">Loader</Text>,

    RNView: View,

    RNText: Text,

    AppButton: ({ title, onPress }: any) => (
      <TouchableOpacity testID="confirm-button" onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),

    QuantitySelector: ({ quantity, onAdd, onRemove }: any) => (
      <View>
        <Text>{quantity}</Text>
        <TouchableOpacity testID={`add-${quantity}`} onPress={onAdd} />
        <TouchableOpacity testID={`remove-${quantity}`} onPress={onRemove} />
      </View>
    ),

    OrderItemCard: ({ itemName, trailingComponent }: any) => (
      <View>
        <Text>{itemName}</Text>
        {trailingComponent}
      </View>
    ),

    AppTextInput: ({ label, value, placeholder, error }: any) => (
      <View>
        <Text>{label}</Text>
        <TextInput value={value} placeholder={placeholder} />
        {error && <Text>{error}</Text>}
      </View>
    ),

    TableSelectionSheet: () => null,
  };
});

describe("OrderSummaryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useOrderSummary as jest.Mock).mockReturnValue(mockUseOrderSummary);
  });

  it("renders correctly", () => {
    const { getByText } = render(<OrderSummaryScreen />);

    expect(getByText("waiter.order.orderSummary")).toBeTruthy();

    expect(getByText("T1")).toBeTruthy();

    expect(getByText("Pizza")).toBeTruthy();

    expect(getByText("owner.newReservation.guestDetail")).toBeTruthy();
  });

  it("shows loader when loading", () => {
    (useOrderSummary as jest.Mock).mockReturnValue(mockUseOrderSummaryLoading);

    const { getByTestId } = render(<OrderSummaryScreen />);

    expect(getByTestId("loader")).toBeTruthy();
  });

  it("calls handleBack", () => {
    const { getByTestId } = render(<OrderSummaryScreen />);

    fireEvent.press(getByTestId("back-button"));

    expect(mockHandleBack).toHaveBeenCalled();
  });

  it("calls confirm order", () => {
    const { getByTestId } = render(<OrderSummaryScreen />);

    fireEvent.press(getByTestId("confirm-button"));

    expect(mockHandleConfirmedOrder).toHaveBeenCalled();
  });

  it("shows select table when no table selected", () => {
    (useOrderSummary as jest.Mock).mockReturnValue(mockUseOrderSummaryNoTable);

    const { getByText, queryByText } = render(<OrderSummaryScreen />);

    expect(getByText("waiter.order.selectTable")).toBeTruthy();

    expect(queryByText("T1")).toBeNull();
  });

  it("shows change when table is selected", () => {
    const { getByText } = render(<OrderSummaryScreen />);

    expect(getByText("waiter.order.change")).toBeTruthy();
  });

  it("renders all guest detail fields", () => {
    const { getByText } = render(<OrderSummaryScreen />);

    expect(getByText("owner.newReservation.fullName")).toBeTruthy();

    expect(getByText("owner.newReservation.mobile")).toBeTruthy();

    expect(getByText("waiter.order.specialNotesOptional")).toBeTruthy();
  });

  it("shows mobile error", () => {
    (useOrderSummary as jest.Mock).mockReturnValue(
      mockUseOrderSummaryMobileError,
    );

    const { getByText } = render(<OrderSummaryScreen />);

    expect(getByText("Invalid mobile number")).toBeTruthy();
  });

  it("renders all order items", () => {
    (useOrderSummary as jest.Mock).mockReturnValue(
      mockUseOrderSummaryMultipleItems,
    );

    const { getByText } = render(<OrderSummaryScreen />);

    expect(getByText("Pizza")).toBeTruthy();
    expect(getByText("Burger")).toBeTruthy();
  });

  it("wires quantity selector actions from order summary", () => {
    const { getByTestId } = render(<OrderSummaryScreen />);

    fireEvent.press(getByTestId(`add-${mockOrderItems[0].quantity}`));
    fireEvent.press(getByTestId(`remove-${mockOrderItems[0].quantity}`));

    expect(mockUseOrderSummary.handleAddItem).toHaveBeenCalledWith(
      mockOrderItems[0],
    );
    expect(mockUseOrderSummary.handleRemoveItem).toHaveBeenCalledWith(
      mockOrderItems[0],
    );
  });
});
