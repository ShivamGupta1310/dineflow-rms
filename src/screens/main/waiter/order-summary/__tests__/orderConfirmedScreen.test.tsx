import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import OrderConfirmedScreen from "../orderConfirmedScreen";
import { showToast } from "@utils/toastHelper";
import { clearOrder } from "@store/slices/waiterOrderSlice";
import {
  orderConfirmedRouteParams,
  orderConfirmedExtraItem,
} from "../__mocks__/mockData";

const mockGoBack = jest.fn();
const mockDispatch = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@utils", () => ({
  formatDate: jest.fn(() => "10:24 AM"),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("@store/slices/waiterOrderSlice", () => ({
  clearOrder: jest.fn(() => ({
    type: "waiterOrder/clearOrder",
  })),
}));

jest.mock("@assets", () => ({
  SVGS: {
    Backlogo: () => null,
    DineSetupLogo: () => null,
    QuotationMark: () => null,
    UserIcon: () => null,
    ClockIcon: () => null,
    PhoneIcon: () => null,
    SuccessConfirmIcons: () => null,
  },
  TableSVG: () => null,
  EditIcon: "<svg />",
}));

jest.mock("react-native-svg", () => ({
  SvgXml: () => null,
}));

jest.mock("@components/common", () => {
  const { View, Text, TouchableOpacity } = require("react-native");

  return {
    Header: ({ title, leftAction, rightActions }: any) => (
      <View>
        {title && <Text>{title}</Text>}

        {leftAction && (
          <TouchableOpacity testID="back-button" onPress={leftAction.onPress} />
        )}

        {rightActions?.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            testID={`right-action-${index}`}
            onPress={item.onPress}
          />
        ))}
      </View>
    ),
  };
});

jest.mock("@components/rn-view/rn-view.component", () => {
  const { View } = require("react-native");

  return {
    RNView: View,
  };
});

jest.mock("@components/rn-text/rn-text.component", () => {
  const { Text } = require("react-native");

  return {
    RNText: Text,
  };
});

jest.mock("@components/OrderItemCard", () => {
  const { View, Text } = require("react-native");

  return {
    __esModule: true,
    default: ({ itemName, trailingComponent }: any) => (
      <View>
        <Text>{itemName}</Text>
        {trailingComponent}
      </View>
    ),
  };
});

describe("OrderConfirmedScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: mockGoBack,
    });
    (useRoute as jest.Mock).mockReturnValue({
      params: orderConfirmedRouteParams,
    });
  });

  it("renders successfully", () => {
    const { getByText } = render(<OrderConfirmedScreen />);

    expect(getByText("waiter.order.orderConfirmed")).toBeTruthy();

    expect(getByText("waiter.order.items")).toBeTruthy();

    expect(getByText("Pizza")).toBeTruthy();

    expect(getByText("waiter.order.thankYouQuote")).toBeTruthy();
  });

  it("clears order summary redux state on mount", () => {
    render(<OrderConfirmedScreen />);

    expect(clearOrder).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "waiterOrder/clearOrder",
    });
  });

  it("calls handleBack", () => {
    const { getByTestId } = render(<OrderConfirmedScreen />);

    fireEvent.press(getByTestId("back-button"));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it("calls handleEditOrder", () => {
    const { getByTestId } = render(<OrderConfirmedScreen />);

    fireEvent.press(getByTestId("right-action-0"));

    expect(showToast).toHaveBeenCalledWith("info", "common.comingSoon");
  });

  it("renders formatted time", () => {
    const { getByText } = render(<OrderConfirmedScreen />);

    expect(getByText("10:24 AM")).toBeTruthy();
  });

  it("renders static customer details", () => {
    const { getByText, queryByText } = render(<OrderConfirmedScreen />);

    expect(getByText("Rahul Sharma")).toBeTruthy();

    expect(getByText("9586245284")).toBeTruthy();

    expect(getByText("#ORD-1025")).toBeTruthy();

    expect(getByText("5")).toBeTruthy();

    expect(queryByText("39")).toBeNull();
  });

  it("renders multiple order items", () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        ...orderConfirmedRouteParams,
        orderItems: [
          ...orderConfirmedRouteParams.orderItems,
          orderConfirmedExtraItem,
        ],
      },
    });

    const { getByText } = render(<OrderConfirmedScreen />);

    expect(getByText("Pizza")).toBeTruthy();

    expect(getByText("Burger")).toBeTruthy();
  });

  it("renders quantity label", () => {
    const { getByText } = render(<OrderConfirmedScreen />);

    expect(getByText("waiter.order.quantityLabel")).toBeTruthy();
  });

  it("renders empty time safely when placedAt is missing", () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        ...orderConfirmedRouteParams,
        placedAt: "",
      },
    });

    const { queryByText } = render(<OrderConfirmedScreen />);

    expect(queryByText("10:24 AM")).toBeNull();
  });
});
