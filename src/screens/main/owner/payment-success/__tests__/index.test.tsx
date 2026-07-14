import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import PaymentSuccessScreen from "../index";
import { usePaymentSuccess } from "../usePaymentSuccess";
import { defaultMockResultDetails } from "../__mocks__/paymentSuccessMock";

jest.mock("../usePaymentSuccess", () => ({
  usePaymentSuccess: jest.fn(),
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

jest.mock("@components", () => ({
  RNText: ({ children }: any) => {
    const { Text } = require("react-native");
    return <Text>{children}</Text>;
  },
  RNView: ({ children }: any) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
  AppLoader: () => {
    const { Text } = require("react-native");
    return <Text>AppLoader</Text>;
  },
  Header: ({ title, leftAction, rightSlot }: any) => {
    const { View, Text, Pressable } = require("react-native");
    return (
      <View>
        <Text>{title}</Text>
        {leftAction && (
          <Pressable onPress={leftAction.onPress} testID={leftAction.testID}>
            {leftAction.icon}
          </Pressable>
        )}
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
}));

jest.mock("@assets", () => ({
  SVGS: {
    Backlogo: () => {
      const { Text } = require("react-native");
      return <Text>Backlogo</Text>;
    },
    PrintIcon: () => {
      const { Text } = require("react-native");
      return <Text>PrintIcon</Text>;
    },
    PaymentSuccessIcon: () => {
      const { Text } = require("react-native");
      return <Text>PaymentSuccessIcon</Text>;
    },
    DineSetupLogo: () => {
      const { Text } = require("react-native");
      return <Text>DineSetupLogo</Text>;
    },
  },
}));

jest.mock("@assets/svgXML", () => ({
  ShareIcon: () => "<svg><text>ShareIcon</text></svg>",
  ThankYouBGIcon: () => "<svg><text>ThankYouBGIcon</text></svg>",
}));

jest.mock("react-native-svg", () => {
  const { Text } = require("react-native");

  return {
    SvgXml: ({ xml }: any) => {
      if (typeof xml === "string" && xml.includes("ShareIcon")) {
        return <Text>ShareIcon</Text>;
      }
      if (typeof xml === "string" && xml.includes("ThankYouBGIcon")) {
        return <Text>ThankYouBGIcon</Text>;
      }
      return <Text>SvgXmlMock</Text>;
    },
  };
});

const mockedUsePaymentSuccess = usePaymentSuccess as jest.Mock;

describe("PaymentSuccessScreen", () => {
  const mockHandleBack = jest.fn();
  const mockHandlePrint = jest.fn();
  const mockHandleShare = jest.fn();

  const defaultMockResult = {
    t: (key: string) => key,
    paymentDetails: defaultMockResultDetails,
    shareLoading: false,
    formattedPaidAt: "25/06/26 at 1:43 PM",
    handleBack: mockHandleBack,
    handlePrint: mockHandlePrint,
    handleShare: mockHandleShare,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUsePaymentSuccess.mockReturnValue(defaultMockResult);
  });

  it("renders layout texts, summary details, and SVG illustrations", () => {
    const { getByText } = render(<PaymentSuccessScreen />);

    expect(getByText("owner.billSummary.paymentSuccessful")).toBeTruthy();
    expect(getByText("owner.billSummary.billNo")).toBeTruthy();
    expect(getByText("BILL-1245")).toBeTruthy();
    expect(getByText("owner.billSummary.paidOn 25/06/26 at 1:43 PM")).toBeTruthy();

    expect(getByText("owner.billSummary.bill")).toBeTruthy();
    expect(getByText("owner.billSummary.subTotal")).toBeTruthy();
    expect(getByText("owner.billSummary.cgst", { exact: false })).toBeTruthy();
    expect(getByText("owner.billSummary.sgst", { exact: false })).toBeTruthy();
    expect(getByText("owner.billSummary.discount")).toBeTruthy();
    expect(getByText("owner.billSummary.total")).toBeTruthy();

    // Check SVG components exist
    expect(getByText("Backlogo")).toBeTruthy();
    expect(getByText("ShareIcon")).toBeTruthy();
    expect(getByText("PrintIcon")).toBeTruthy();
    expect(getByText("PaymentSuccessIcon")).toBeTruthy();
    expect(getByText("DineSetupLogo")).toBeTruthy();
  });

  it("triggers hook callbacks when header actions are pressed", () => {
    const { getByTestId } = render(<PaymentSuccessScreen />);

    const backButton = getByTestId("payment-success-back-button");
    const shareButton = getByTestId("payment-success-share-button");
    const printButton = getByTestId("payment-success-print-button");

    fireEvent.press(backButton);
    expect(mockHandleBack).toHaveBeenCalled();

    fireEvent.press(shareButton);
    expect(mockHandleShare).toHaveBeenCalled();

    fireEvent.press(printButton);
    expect(mockHandlePrint).toHaveBeenCalled();
  });

  it("renders AppLoader when shareLoading is true", () => {
    mockedUsePaymentSuccess.mockReturnValue({
      ...defaultMockResult,
      shareLoading: true,
    });

    const { getByText } = render(<PaymentSuccessScreen />);
    expect(getByText("AppLoader")).toBeTruthy();
  });

  it("renders with fallback values if paymentDetails is partially empty or missing", () => {
    mockedUsePaymentSuccess.mockReturnValue({
      ...defaultMockResult,
      paymentDetails: null as any,
    });

    const { getByText } = render(<PaymentSuccessScreen />);
    expect(getByText("--")).toBeTruthy();
  });
});
