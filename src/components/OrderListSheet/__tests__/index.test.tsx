import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";

import OrderListSheet from "../index";
import {
  orderSheetMockData,
  orderSheetSortMockData,
} from "../__mocks__/mockData";

jest.mock("i18next", () => ({
  t: (key: string) => key,
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children, ...props }: any) => {
    const { View } = require("react-native");
    return <View {...props}>{children}</View>;
  },
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@components", () => {
  const { Pressable, Text, View } = require("react-native");

  return {
    AppButton: ({ title, onPress, disabled }: any) => (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        testID={`app-button-${title}`}
      >
        <Text>{title}</Text>
        <Text testID={`app-button-state-${title}`}>
          {disabled ? "disabled" : "enabled"}
        </Text>
      </Pressable>
    ),
    RNText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
    RNView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock("@assets", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    CookingSVG: "CookingSVG",
    ServedSVG: "ServedSVG",
    TableSVG: () => ReactModule.createElement(Text, null, "TableIcon"),
    SVGS: {
      DeskBell: () => ReactModule.createElement(Text, null, "DeskBellIcon"),
    },
  };
});

jest.mock("@assets/svgXML", () => ({
  FoodPlaceholderIcon: "FoodPlaceholderIcon",
}));

jest.mock("react-native-svg", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SvgXml: ({ xml }: any) => {
      if (xml === "CookingSVG") {
        return ReactModule.createElement(Text, null, "CookingIcon");
      }

      if (xml === "ServedSVG") {
        return ReactModule.createElement(Text, null, "ServedIcon");
      }

      if (xml === "FoodPlaceholderIcon") {
        return ReactModule.createElement(Text, null, "FoodPlaceholder");
      }

      return ReactModule.createElement(Text, null, "SvgXmlMock");
    },
  };
});

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("@store/slices/waiterOrderSlice", () => {
  const updateWaiterOrderStatus = Object.assign(
    jest.fn((payload: { orderId: number }) => ({
      type: "waiterOrder/updateWaiterOrderStatus",
      meta: { arg: payload },
    })),
    {
      fulfilled: {
        match: (action: { type?: string }) =>
          action.type === "waiterOrder/updateWaiterOrderStatus/fulfilled",
      },
    },
  );

  return {
    updateWaiterOrderStatus,
  };
});

const { updateWaiterOrderStatus: mockUpdateWaiterOrderStatus } =
  jest.requireMock("@store/slices/waiterOrderSlice") as {
    updateWaiterOrderStatus: jest.Mock & {
      fulfilled: {
        match: (action: { type?: string }) => boolean;
      };
    };
  };

const baseProps = {
  visible: true,
  setOrderSheetVisible: jest.fn(),
  tableNumber: "T1",
  handleAddItemClick: jest.fn(),
  handleGenerateBillClick: jest.fn(),
};

const flattenTextChildren = (children: any): string[] => {
  if (typeof children === "string") {
    return [children];
  }

  if (Array.isArray(children)) {
    return children.flatMap(flattenTextChildren);
  }

  return [];
};

const getRenderedItemNamesInOrder = (UNSAFE_getAllByType: any) => {
  const { Text } = require("react-native");

  return UNSAFE_getAllByType(Text)
    .flatMap((node: any) => flattenTextChildren(node.props.children))
    .filter((text: string) =>
      [
        "Ready Item",
        "Preparing Item",
        "Placed Item",
        "Served Item",
      ].includes(text),
    );
};

describe("OrderListSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockResolvedValue({
      type: "waiterOrder/updateWaiterOrderStatus/fulfilled",
      payload: {
        success: true,
        orderId: 3,
      },
    });
  });

  it("renders comma-separated order numbers and all order items", () => {
    const { getAllByText, getByText } = render(
      <OrderListSheet
        {...baseProps}
        orders={orderSheetMockData}
      />,
    );

    expect(getByText("#ORD001, #ORD002, #ORD003")).toBeTruthy();
    expect(getAllByText("Paneer Tikka")).toHaveLength(2);
    expect(getByText("Veg Noodles")).toBeTruthy();
    expect(getByText("Masala Dosa ready")).toBeTruthy();
    expect(getByText("Masala Dosa served")).toBeTruthy();
    expect(getAllByText("waiter.order.qty: 1")).toHaveLength(2);
    expect(getByText("waiter.order.qty: 2")).toBeTruthy();
    expect(getAllByText("waiter.order.qty: 3")).toHaveLength(2);
  });

  it("counts only items that are explicitly ready", () => {
    const { getAllByText, getByText } = render(
      <OrderListSheet
        {...baseProps}
        orders={orderSheetMockData}
      />,
    );

    expect(getByText("2 waiter.order.itemReadyForServe")).toBeTruthy();
    expect(getAllByText("DeskBellIcon")).toHaveLength(3);
  });

  it("keeps served status based on the item status", () => {
    const { getAllByText, getByTestId, getByText } = render(
      <OrderListSheet
        {...baseProps}
        orders={orderSheetMockData}
      />,
    );

    expect(getAllByText("TableIcon")).toHaveLength(1);
    expect(getByText("ServedIcon")).toBeTruthy();
    expect(
      getByTestId("app-button-state-waiter.order.generateBill").props.children,
    ).toBe("disabled");
  });

  it("renders items in ready, preparing, order placed, served order", () => {
    const { UNSAFE_getAllByType } = render(
      <OrderListSheet
        {...baseProps}
        orders={orderSheetSortMockData}
      />,
    );

    expect(getRenderedItemNamesInOrder(UNSAFE_getAllByType)).toEqual([
      "Ready Item",
      "Preparing Item",
      "Placed Item",
      "Served Item",
    ]);
  });

  it("renders the sheet content inside a bottom SafeAreaView", () => {
    const { getByTestId } = render(
      <OrderListSheet
        {...baseProps}
        orders={[]}
      />,
    );

    expect(getByTestId("order-list-sheet-container").props.edges).toEqual([
      "bottom",
    ]);
  });

  it("updates only the tapped order items from ready to served", async () => {
    const { getByTestId, getByText, queryByTestId, queryByText } = render(
      <OrderListSheet
        {...baseProps}
        orders={orderSheetMockData}
      />,
    );

    fireEvent(getByTestId("order-status-action-3-13"), "longPress");

    await waitFor(() => {
      expect(mockUpdateWaiterOrderStatus).toHaveBeenCalledWith({ orderId: 3 });
    });

    await waitFor(() => {
      expect(queryByText("2 waiter.order.itemReadyForServe")).toBeNull();
    });

    expect(getByText("1 waiter.order.itemReadyForServe")).toBeTruthy();
    expect(queryByTestId("order-status-action-3-13")).toBeNull();
    expect(getByTestId("order-status-action-1-12")).toBeTruthy();
  });

  it("shows a loader and blocks repeated presses while the update is running", async () => {
    let resolveDispatch: ((value: unknown) => void) | undefined;

    mockDispatch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDispatch = resolve;
        }),
    );

    const { getByTestId, queryByTestId } = render(
      <OrderListSheet
        {...baseProps}
        orders={orderSheetMockData}
      />,
    );

    fireEvent(getByTestId("order-status-action-3-13"), "longPress");

    await waitFor(() => {
      expect(getByTestId("order-status-loader-3")).toBeTruthy();
    });

    fireEvent(getByTestId("order-status-action-1-12"), "longPress");
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveDispatch?.({
        type: "waiterOrder/updateWaiterOrderStatus/rejected",
      });
    });

    await waitFor(() => {
      expect(queryByTestId("order-status-loader-3")).toBeNull();
    });
  });
});
