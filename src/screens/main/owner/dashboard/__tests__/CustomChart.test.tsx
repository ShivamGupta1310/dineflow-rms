import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GlobalProvider from "../../../../../contexts/global.provider";
import { CustomChart } from "../CustomChart";

// Mock react-native-svg so that we can render the component without errors.
// In the SVG mock, we map onPressIn of Rect to onPress so it can be triggered by fireEvent.press.
jest.mock("react-native-svg", () => {
  const ReactModule = require("react");
  const { View, Pressable } = require("react-native");
  return {
    __esModule: true,
    default: View,
    Svg: View,
    Path: View,
    Circle: View,
    Defs: View,
    LinearGradient: View,
    Stop: View,
    Line: View,
    Rect: ({ onPressIn, testID, ...props }: any) => (
      <Pressable testID={testID} onPress={onPressIn} {...props} />
    ),
  };
});

// Mock assets used in the component
jest.mock("@assets", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SVGS: {
      ProfitIcon: () => ReactModule.createElement(Text, null, "ProfitIcon"),
      LossIcon: () => ReactModule.createElement(Text, null, "LossIcon"),
      CalendarIcon: () => ReactModule.createElement(Text, null, "CalendarIcon"),
    },
  };
});

const mockSalesRevenueData = {
  amount: 57858.21,
  change_percentage: 18,
  trend: "UP" as const,
  weekly_chart: {
    total: 57858.21,
    currency: "INR",
    graph: [
      { label: "Mon", date: "2026-07-13", amount: 10000 },
      { label: "Tue", date: "2026-07-14", amount: 11250 },
      { label: "Wed", date: "2026-07-15", amount: 8000 },
      { label: "Thu", date: "2026-07-16", amount: 9000 },
      { label: "Fri", date: "2026-07-17", amount: 12000 },
      { label: "Sat", date: "2026-07-18", amount: 9252 },
      { label: "Sun", date: "2026-07-19", amount: 10000 },
    ],
  },
  monthly_chart: {
    total: 57858.21,
    currency: "INR",
    graph: [],
  },
};

describe("CustomChart Tooltip Visibility", () => {
  it("does not show the tooltip on initial load", () => {
    const { queryByTestId } = render(
      <GlobalProvider>
        <CustomChart salesRevenueData={mockSalesRevenueData} />
      </GlobalProvider>
    );
    expect(queryByTestId("custom-chart-tooltip")).toBeNull();
  });

  it("shows the tooltip when a chart point is clicked/pressed", () => {
    const { queryByTestId, getByTestId } = render(
      <GlobalProvider>
        <CustomChart salesRevenueData={mockSalesRevenueData} />
      </GlobalProvider>
    );

    // Verify tooltip is not present initially
    expect(queryByTestId("custom-chart-tooltip")).toBeNull();

    // Trigger press on the Saturday (index 5) point hit zone
    fireEvent.press(getByTestId("chart-hit-zone-5"));

    // Tooltip should be visible now
    expect(getByTestId("custom-chart-tooltip")).toBeTruthy();

    // It should display Saturday's value (₹9,252) and the formatted date (18th July Saturday)
    expect(getByTestId("custom-chart-tooltip")).toHaveTextContent("₹9,25218th July Saturday");
  });
});
