import React from "react";
import { render } from "@testing-library/react-native";
import GlobalProvider from "../../../../../contexts/global.provider";
import { GiftedChartComponent } from "../GiftedChartComponent";

// Mock react-native-gifted-charts so we can verify the props passed to LineChart
jest.mock("react-native-gifted-charts", () => {
  const ReactModule = require("react");
  const { View } = require("react-native");
  return {
    LineChart: (props: any) => {
      return <View testID="mock-line-chart" {...props} />;
    },
    yAxisSides: {
      LEFT: "left",
      RIGHT: "right",
    },
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

describe("GiftedChartComponent Prop Validation", () => {
  it("renders correctly with hideDataPoints and custom pointerConfig components", () => {
    const { getByTestId } = render(
      <GlobalProvider>
        <GiftedChartComponent salesRevenueData={mockSalesRevenueData} />
      </GlobalProvider>
    );

    const lineChart = getByTestId("mock-line-chart");
    
    // Assert dataPointsColor prop is transparent
    expect(lineChart.props.dataPointsColor).toBe("transparent");

    // Assert overflowTop prop is configured
    expect(lineChart.props.overflowTop).toBeDefined();

    // Assert disableScroll prop is true
    expect(lineChart.props.disableScroll).toBe(true);

    // Assert autoAdjustPointerLabelPosition is true in pointerConfig
    expect(lineChart.props.pointerConfig.autoAdjustPointerLabelPosition).toBe(true);

    // Assert custom pointerComponent is provided
    expect(lineChart.props.pointerConfig.pointerComponent).toBeDefined();

    // Verify pointerComponent rendering
    const pointerElement = lineChart.props.pointerConfig.pointerComponent();
    const { toJSON } = render(<GlobalProvider>{pointerElement}</GlobalProvider>);
    expect(toJSON()).toBeTruthy();
  });
});
