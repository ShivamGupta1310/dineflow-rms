import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import type { TFunction } from "i18next";

import BillSummaryScreen from "../index";
import { useBillSummary } from "../useBillSummary";
import {
  billDetailsMock,
  billDetailsMock2,
  billSummaryMock,
  billSummaryResponseMock,
  mockData,
  orderItemsMock,
} from "../__mockData__/billSummaryMock";

jest.mock("../useBillSummary", () => ({
  useBillSummary: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => {
    const { View } = require("react-native");

    return <View>{children}</View>;
  },
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@assets", () => ({
  SVGS: {
    DishIcon: () => {
      const { Text } = require("react-native");

      return <Text>DishIcon</Text>;
    },
    PrintIcon: () => {
      const { Text } = require("react-native");

      return <Text>PrintIcon</Text>;
    },
    Backlogo: () => {
      const { Text } = require("react-native");

      return <Text>Backlogo</Text>;
    },
    CalendarIcon: () => {
      const { Text } = require("react-native");

      return <Text>CalendarIcon</Text>;
    },
    UserIcon: () => {
      const { Text } = require("react-native");

      return <Text>UserIcon</Text>;
    },
    ClockIcon: () => {
      const { Text } = require("react-native");

      return <Text>ClockIcon</Text>;
    },
    PhoneIcon: () => {
      const { Text } = require("react-native");

      return <Text>PhoneIcon</Text>;
    },
    ShareIcon: () => {
      const { Text } = require("react-native");

      return <Text>ShareIcon</Text>;
    },
    CheckWhiteCircleIcon: () => {
      const { Text } = require("react-native");

      return <Text>CheckWhiteCircleIcon</Text>;
    },
  },
}));

jest.mock("@components", () => ({
  AppButton: ({ title, onPress, disabled, leftIcon }: any) => {
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable
        testID={title}
        onPress={disabled ? undefined : onPress}
        accessibilityState={{ disabled: Boolean(disabled) }}
      >
        {leftIcon}
        <Text>{title}</Text>
      </Pressable>
    );
  },
  AppLoader: () => {
    const { Text } = require("react-native");
    return <Text>Loader</Text>;
  },
  Header: ({ title, leftAction, rightSlot }: any) => {
    const { Text, View, Pressable } = require("react-native");
    return (
      <View>
        <Text>{title}</Text>
        {leftAction ? (
          <Pressable
            testID="bill-summary-header-back"
            onPress={leftAction.onPress}
          >
            {leftAction.icon}
          </Pressable>
        ) : null}
        {rightSlot}
      </View>
    );
  },
  IconButton: ({ icon, onPress, testID }: any) => {
    const { Pressable } = require("react-native");
    return (
      <Pressable testID={testID} onPress={onPress}>
        {icon}
      </Pressable>
    );
  },
  RNText: ({ children }: any) => {
    const { Text } = require("react-native");
    return <Text>{children}</Text>;
  },
  RNView: ({ children }: any) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
}));

jest.mock("@utils", () => {
  return {
    formatDate: jest.fn((value: string, format?: string) => {
      if (format === "DD/MM/YY") {
        return "17/06/26";
      }

      if (format === "hh:mm A") {
        return "03:30 PM";
      }

      return value;
    }),
    toCurrency: jest.fn(
      (value: number | string) => `₹${Number(value).toFixed(2)}`,
    ),
  };
});

const mockedUseBillSummary = useBillSummary as jest.MockedFunction<
  typeof useBillSummary
>;
const mockT = ((key: string) => key) as unknown as TFunction;

describe("BillSummaryScreen", () => {
  const mockHandleBack = jest.fn();
  const mockHandlePrint = jest.fn();
  const mockHandleShare = jest.fn();
  const mockHandleAddDiscount = jest.fn();
  const mockHandleMarkAsPaid = jest.fn();

  const renderScreen = () => render(<BillSummaryScreen />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders bill data, action buttons, and empty discount state", () => {
    const { bill_details, orderItems, tableId, tableSessionId } =
      mockData.screen;

    mockedUseBillSummary.mockReturnValue({
      t: mockT,
      ...mockData.screen.defaultState,
      isRTL: false,
      billDetails: bill_details,
      billSummary: billSummaryMock,
      orderItems,
      tableId,
      tableSessionId,
      handleBack: mockHandleBack,
      handlePrint: mockHandlePrint,
      handleShare: mockHandleShare,
      handleAddDiscount: mockHandleAddDiscount,
      handleMarkAsPaid: mockHandleMarkAsPaid,
      shareLoading: false,
    });

    const { getByText, getByTestId, queryByText } = renderScreen();

    expect(getByText("owner.billSummary.tableNo - 7")).toBeTruthy();
    expect(getByText("BILL-1")).toBeTruthy();
    expect(getByText("Paneer Tikka")).toBeTruthy();
    expect(getByText("owner.billSummary.qty 2")).toBeTruthy();
    expect(getByText("₹1180.00")).toBeTruthy();
    expect(getByText("+ owner.billSummary.add")).toBeTruthy();
    expect(queryByText("Loader")).toBeNull();

    fireEvent.press(getByTestId("bill-summary-header-back"));
    fireEvent.press(getByTestId("bill-summary-print-button"));
    fireEvent.press(getByTestId("owner.billSummary.share"));
    fireEvent.press(getByTestId("owner.billSummary.markAsPaid"));

    expect(mockHandleBack).toHaveBeenCalledTimes(1);
    expect(mockHandlePrint).toHaveBeenCalledTimes(1);
    expect(mockHandleShare).toHaveBeenCalledTimes(1);
    expect(mockHandleMarkAsPaid).toHaveBeenCalledTimes(1);
  });

  it("renders empty states, loading indicator, and a disabled paid action", () => {
    mockedUseBillSummary.mockReturnValue({
      t: mockT,
      ...mockData.screen.loadingState,
      isRTL: false,
      billDetails: billDetailsMock,
      billSummary: billDetailsMock2,
      orderItems: [],
      tableId: 8,
      tableSessionId: 92,
      handleBack: mockHandleBack,
      handlePrint: mockHandlePrint,
      handleShare: mockHandleShare,
      handleAddDiscount: mockHandleAddDiscount,
      handleMarkAsPaid: mockHandleMarkAsPaid,
      shareLoading: false,
    });

    const { getByText, getByTestId, queryByText } = renderScreen();

    expect(getByText("Loader")).toBeTruthy();
    expect(getByText("common.noItemsFound")).toBeTruthy();
    expect(getByText("₹20.00")).toBeTruthy();
    expect(queryByText("+ owner.billSummary.add")).toBeNull();
    expect(
      getByTestId("owner.billSummary.markAsPaid").props.accessibilityState,
    ).toEqual({ disabled: true });
  });

  it("renders layout fallbacks when response and details have missing/empty values", () => {
    mockedUseBillSummary.mockReturnValue({
      t: mockT,
      loading: false,
      error: null,
      response: billSummaryResponseMock,
      isRTL: true,
      billDetails: null,
      billSummary: null,
      orderItems: orderItemsMock,
      tableId: undefined,
      tableSessionId: null,
      handleBack: mockHandleBack,
      handlePrint: mockHandlePrint,
      handleShare: mockHandleShare,
      handleAddDiscount: mockHandleAddDiscount,
      handleMarkAsPaid: mockHandleMarkAsPaid,
      shareLoading: false,
    });

    const { getByText } = renderScreen();

    expect(getByText("owner.billSummary.tableNo - --")).toBeTruthy();
    expect(getByText("Tikka with Image")).toBeTruthy();
    expect(getByText("Tikka without Image")).toBeTruthy();
    expect(getByText("DishIcon")).toBeTruthy();
  });
});
