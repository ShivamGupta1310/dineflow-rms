import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GlobalProvider from "../../../../../contexts/global.provider";
import BillGenerationScreen from "../index";
import { useBillGeneration } from "../useBillGeneration";
import { mockUseBillGeneration, mockBillMetadata } from "../__mocks__/mockData";

jest.mock("../useBillGeneration");

jest.mock("../../../../../hoc/withSuccessScreen", () => {
  return (Component: any) => (props: any) =>
    (
      <Component
        {...props}
        showSuccessScreen={jest.fn()}
        hideSuccessScreen={jest.fn()}
      />
    );
});
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
  useSafeAreaInsets: jest.fn(),
}));

jest.mock("@assets", () => {
  const { Text } = require("react-native");

  return {
    SVGS: {
      Backlogo: () => <Text testID="back-icon">Back</Text>,
      IndiaFlag: () => <Text testID="india-flag">India</Text>,
    },
  };
});

jest.mock("@components", () => {
  const { View, Text, Pressable, TextInput } = require("react-native");

  return {
    AppLoader: () => <Text testID="loader">Loader</Text>,

    Header: ({ title, leftAction }: any) => (
      <View>
        <Text>{title}</Text>

        <Pressable testID="header-back" onPress={leftAction.onPress}>
          <Text>Back</Text>
        </Pressable>
      </View>
    ),

    RNView: ({ children, ...props }: any) => <View {...props}>{children}</View>,

    RNText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,

    AppTextInput: ({ value, onChangeText, error, label }: any) => (
      <View>
        <Text>{label}</Text>

        <TextInput testID={label} value={value} onChangeText={onChangeText} />

        {error && <Text>{error}</Text>}
      </View>
    ),

    OrderItemCard: ({ itemName, description, trailingComponent }: any) => (
      <View>
        <Text>{itemName}</Text>
        <Text>{description}</Text>
        {trailingComponent}
      </View>
    ),

    AppButton: ({ title, onPress, disabled }: any) => (
      <Pressable
        testID="generate-bill-button"
        onPress={onPress}
        disabled={disabled}
        accessibilityState={{ disabled }}
      >
        <Text>{title}</Text>
      </Pressable>
    ),
  };
});

jest.mock("@components/OrderDetailTopInfoView", () => () => {
  const { Text } = require("react-native");

  return <Text testID="top-info-view">Top Info</Text>;
});

const mockedUseBillGeneration = useBillGeneration as jest.MockedFunction<
  typeof useBillGeneration
>;

describe("BillGenerationScreen", () => {
  const renderScreen = () =>
    render(
      <GlobalProvider>
        <BillGenerationScreen />
      </GlobalProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();

    (useSafeAreaInsets as jest.Mock).mockReturnValue({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });

    mockedUseBillGeneration.mockReturnValue(mockUseBillGeneration as any);
  });

  it("renders bill generation screen", () => {
    const { getByText, getByTestId } = renderScreen();

    expect(getByText("waiter.generateBill.tableNo - 12")).toBeTruthy();

    expect(getByTestId("top-info-view")).toBeTruthy();

    expect(getByText("waiter.generateBill.items")).toBeTruthy();

    expect(getByText("waiter.generateBill.bill")).toBeTruthy();

    expect(getByText("owner.newReservation.guestDetail")).toBeTruthy();

    expect(getByText("waiter.generateBill.generatingBill")).toBeTruthy();
  });

  it("shows loader", () => {
    mockedUseBillGeneration.mockReturnValue({
      ...mockUseBillGeneration,
      loading: true,
    } as any);

    const { getByTestId } = renderScreen();

    expect(getByTestId("loader")).toBeTruthy();
  });

  it("renders all order items", () => {
    const { getByText } = renderScreen();

    expect(getByText("Paneer Tikka")).toBeTruthy();

    expect(getByText("Butter Naan")).toBeTruthy();

    expect(getByText("Veg Biryani")).toBeTruthy();
  });

  it("shows add discount button when discount is zero", () => {
    const { getByText } = renderScreen();

    expect(getByText("+ waiter.generateBill.add")).toBeTruthy();
  });

  it("shows discount amount when discount exists", () => {
    mockedUseBillGeneration.mockReturnValue({
      ...mockUseBillGeneration,
      billMetadata: {
        ...mockBillMetadata,
        billDetails: {
          ...mockBillMetadata.billDetails!,
          discount_amount: 100,
        },
      },
    } as any);

    const { queryByText } = renderScreen();

    expect(queryByText("+ waiter.generateBill.add")).toBeNull();
  });
  it("calls handleBack when back button is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("header-back"));

    expect(mockUseBillGeneration.handleBack).toHaveBeenCalledTimes(1);
  });

  it("calls handleGenerateBill when generate bill button is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("generate-bill-button"));

    expect(mockUseBillGeneration.handleGenerateBill).toHaveBeenCalledTimes(1);
  });

  it("calls handleAddDiscount when add discount is pressed", () => {
    const { getByText } = renderScreen();

    fireEvent.press(getByText("+ waiter.generateBill.add"));

    expect(mockUseBillGeneration.handleAddDiscount).toHaveBeenCalledTimes(1);
  });

  it("updates full name", () => {
    const { getByTestId } = renderScreen();

    fireEvent.changeText(
      getByTestId("owner.newReservation.fullName"),
      "John Patel",
    );

    expect(mockUseBillGeneration.handleFullNameChange).toHaveBeenCalledWith(
      "John Patel",
    );
  });

  it("updates mobile number", () => {
    const { getByTestId } = renderScreen();

    fireEvent.changeText(
      getByTestId("owner.newReservation.mobile"),
      "9999999999",
    );

    expect(mockUseBillGeneration.handleMobileChange).toHaveBeenCalledWith(
      "9999999999",
    );
  });

  it("shows mobile validation error", () => {
    mockedUseBillGeneration.mockReturnValue({
      ...mockUseBillGeneration,
      mobileErrorText: "Invalid mobile number",
    } as any);

    const { getByText } = renderScreen();

    expect(getByText("Invalid mobile number")).toBeTruthy();
  });

  it("disables generate bill button", () => {
    mockedUseBillGeneration.mockReturnValue({
      ...mockUseBillGeneration,
      isGenerateBillDisabled: true,
    } as any);

    const { getByTestId } = renderScreen();

    expect(getByTestId("generate-bill-button")).toHaveProp(
      "accessibilityState",
      {
        disabled: true,
      },
    );
  });

  it("renders fallback bill values when calculated summary is null", () => {
    mockedUseBillGeneration.mockReturnValue({
      ...mockUseBillGeneration,
      calculatedBillSummary: null,
    } as any);

    const { getAllByText } = renderScreen();

    expect(getAllByText("₹0.00").length).toBeGreaterThan(0);
  });

  it("renders bill values correctly", () => {
    const { getByText, getAllByText } = renderScreen();

    expect(getByText("₹700.00")).toBeTruthy();

    expect(getAllByText("₹17.50")).toHaveLength(2);

    expect(getByText("₹735.00")).toBeTruthy();
  });
});
