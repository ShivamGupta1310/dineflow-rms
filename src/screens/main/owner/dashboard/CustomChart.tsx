import React, { useState, useMemo } from "react";
import { StyleSheet, Pressable, Dimensions } from "react-native";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Rect,
} from "react-native-svg";
import { useTranslation } from "react-i18next";
import { RNView, RNText } from "@components";
import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { SVGS } from "@assets";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import {
  formatTooltipDate,
  prepareWeeklyGraphData,
  computeChartLayout,
  getBezierPath,
  getClosedBezierPath,
  formatYAxisLabel,
  formatIndianNumber,
} from "@utils";
import { GraphItem, SalesRevenue } from "@store/slices/ownerDashboardSlice";

interface CustomChartProps {
  salesRevenueData?: SalesRevenue;
  isRTL?: boolean;
}

export const CustomChart: React.FC<CustomChartProps> = ({
  salesRevenueData,
  isRTL = false,
}) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<"weekly" | "monthly">(
    "weekly",
  );
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(
    Dimensions.get("window").width - horizontalScale(40),
  );

  const svgWidth = useMemo(() => {
    return containerWidth - horizontalScale(32);
  }, [containerWidth]);

  // Prepare Chart Data
  const chartDataList = useMemo<GraphItem[]>(() => {
    if (!salesRevenueData) return [];
    if (selectedTab === "weekly") {
      return prepareWeeklyGraphData(
        salesRevenueData.weekly_chart?.graph || [],
        salesRevenueData.weekly_chart?.graph?.[0]?.date,
      );
    } else {
      return salesRevenueData.monthly_chart?.graph || [];
    }
  }, [salesRevenueData, selectedTab]);

  const chartTotal = useMemo(() => {
    if (!salesRevenueData) return 0;
    return selectedTab === "weekly"
      ? salesRevenueData.weekly_chart?.total || 0
      : salesRevenueData.monthly_chart?.total || 0;
  }, [salesRevenueData, selectedTab]);

  const currencySymbol = useMemo(() => {
    const code = salesRevenueData?.weekly_chart?.currency || "INR";
    return code === "INR" ? "₹" : "$";
  }, [salesRevenueData]);

  // Dimensions & Padding
  const height = verticalScale(180);
  const paddingLeft = isRTL ? horizontalScale(10) : horizontalScale(36);
  const paddingRight = isRTL ? horizontalScale(36) : horizontalScale(10);
  const paddingTop = verticalScale(20);
  const paddingBottom = verticalScale(20);

  // Compute points and NiceMax
  const { points, niceMax, chartWidth, chartHeight } = useMemo(() => {
    return computeChartLayout(
      chartDataList,
      svgWidth,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      isRTL,
    );
  }, [
    chartDataList,
    svgWidth,
    height,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    isRTL,
  ]);

  // Bezier line and area path
  const linePath = useMemo(() => getBezierPath(points), [points]);
  const areaPath = useMemo(() => {
    const bottomY = height - paddingBottom;
    return getClosedBezierPath(points, bottomY);
  }, [points, height, paddingBottom]);

  const activeIndex = activePointIndex;
  const activeItem = activeIndex !== null ? chartDataList[activeIndex] : null;
  const activePoint = activeIndex !== null ? points[activeIndex] : null;

  // Localize day names
  const getLocalizedDay = (day: string | number) => {
    if (typeof day === "number") return String(day);
    const key = `common.days.${day.toLowerCase()}`;
    const trans = t(key);
    return trans.includes("common.days") ? day : trans;
  };

  // Check if X-label should be displayed (to avoid overlap in monthly view)
  const shouldShowXLabel = (index: number, label: string | number) => {
    if (selectedTab === "weekly") return true;
    const labelNum = Number(label);
    if (!isNaN(labelNum)) {
      return (
        labelNum === 1 ||
        labelNum % 5 === 0 ||
        labelNum === chartDataList.length
      );
    }
    return index % 5 === 0;
  };

  // Trend mapping
  const changePercentage = salesRevenueData?.change_percentage || 0;
  const isProfit = (salesRevenueData?.trend || "UP") === "UP";
  const TrendIcon = isProfit ? SVGS.ProfitIcon : SVGS.LossIcon;

  // Horizontal Grid Lines positions (4 lines excluding bottom)
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  return (
    <RNView
      style={styles.card}
      onLayout={handleLayout}
      testID="sales-revenue-custom-chart-card"
    >
      {/* Header section */}
      <RNView style={[styles.headerRow, isRTL ? styles.rtlRow : styles.ltrRow]}>
        <RNText style={styles.title}>
          {t("owner.dashboard.salesRevenue.title")}
        </RNText>

        {/* Toggle tabs */}
        <RNView style={styles.toggleContainer}>
          <Pressable
            onPress={() => {
              setSelectedTab("weekly");
              setActivePointIndex(null);
            }}
            style={[
              styles.toggleTab,
              selectedTab === "weekly" && styles.activeTab,
            ]}
          >
            <RNText
              style={[
                styles.toggleText,
                selectedTab === "weekly" && styles.activeToggleText,
              ]}
            >
              {t("owner.dashboard.salesRevenue.weekly")}
            </RNText>
          </Pressable>
          <Pressable
            onPress={() => {
              setSelectedTab("monthly");
              setActivePointIndex(null);
            }}
            style={[
              styles.toggleTab,
              selectedTab === "monthly" && styles.activeTab,
            ]}
          >
            <RNText
              style={[
                styles.toggleText,
                selectedTab === "monthly" && styles.activeToggleText,
              ]}
            >
              {t("owner.dashboard.salesRevenue.monthly")}
            </RNText>
          </Pressable>
        </RNView>
      </RNView>

      {/* Earnings details */}
      <RNView
        style={[styles.earningRow, isRTL ? styles.rtlRow : styles.ltrRow]}
      >
        <RNView style={isRTL ? styles.alignRight : styles.alignLeft}>
          <RNText style={styles.earningLabel}>
            {selectedTab === "weekly"
              ? t("owner.dashboard.salesRevenue.weeklyEarning")
              : t("owner.dashboard.salesRevenue.monthlyEarning")}
          </RNText>
          <RNText style={styles.earningAmount}>
            {`${currencySymbol}${formatIndianNumber(chartTotal)}`}
          </RNText>
        </RNView>

        <RNView
          style={[
            styles.trendBadge,
            isProfit ? styles.trendBadgeProfit : styles.trendBadgeLoss,
          ]}
        >
          <RNText
            style={[
              styles.trendText,
              isProfit ? styles.trendTextProfit : styles.trendTextLoss,
            ]}
          >
            {`${Math.round(Math.abs(changePercentage))}%`}
          </RNText>
          <TrendIcon style={styles.trendIcon} width={8} height={8} />
        </RNView>
      </RNView>

      {/* Chart Canvas Area */}
      <RNView style={styles.chartContainer}>
        {chartDataList.length > 0 && (
          <Svg width={svgWidth} height={height}>
            <Defs>
              <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0%"
                  stopColor={colors.primary}
                  stopOpacity={0.25}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.primary}
                  stopOpacity={0.0}
                />
              </LinearGradient>
            </Defs>

            {/* Horizontal Grid lines */}
            {gridLines.map((ratio, index) => {
              const yVal = paddingTop + chartHeight * (1 - ratio);
              const xStart = isRTL ? paddingRight : paddingLeft;
              const xEnd = svgWidth - (isRTL ? paddingLeft : paddingRight);
              return (
                <Line
                  key={`grid-${index}`}
                  x1={xStart}
                  y1={yVal}
                  x2={xEnd}
                  y2={yVal}
                  stroke={colors.dividerColor}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area under the Bezier line */}
            {points.length > 1 && (
              <Path d={areaPath} fill="url(#areaGradient)" />
            )}

            {/* Bezier Line */}
            {points.length > 1 && (
              <Path
                d={linePath}
                fill="none"
                stroke={colors.primary}
                strokeWidth={2}
              />
            )}

            {/* Active Point Circle Overlay */}
            {activePoint && (
              <Circle
                cx={activePoint.x}
                cy={activePoint.y}
                r={5}
                fill={colors.primary}
                stroke={colors.white}
                strokeWidth={2}
              />
            )}

            {/* Interactive column hit-test zones */}
            {points.map((pt, index) => {
              const colWidth = chartWidth / (points.length - 1 || 1);
              const xCenter = pt.x;
              const xStart = xCenter - colWidth / 2;
              return (
                <Rect
                  key={`hit-${index}`}
                  testID={`chart-hit-zone-${index}`}
                  x={xStart}
                  y={0}
                  width={colWidth}
                  height={height}
                  fill="transparent"
                  onPressIn={() => setActivePointIndex(index)}
                />
              );
            })}
          </Svg>
        )}

        {/* Y-Axis scale label ticks */}
        {gridLines.map((ratio, index) => {
          const value = Math.round(niceMax * ratio);
          const yVal = paddingTop + chartHeight * (1 - ratio);

          return (
            <RNText
              key={`y-label-${index}`}
              style={[
                styles.yAxisLabel,
                {
                  top: yVal - verticalScale(6),
                  [isRTL ? "right" : "left"]: horizontalScale(2),
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {formatYAxisLabel(value)}
            </RNText>
          );
        })}

        {/* X-Axis labels */}
        <RNView style={styles.xAxisContainer}>
          {chartDataList.map((item, index) => {
            const isVisible = shouldShowXLabel(index, item.label);
            if (!isVisible) return null;

            const pt = points[index];
            if (!pt) return null;

            const labelWidth = horizontalScale(40);

            // eslint-disable-next-line react-native/no-inline-styles
            return (
              <RNText
                key={`x-label-${index}`}
                style={[
                  styles.xAxisLabel,
                  {
                    position: "absolute",
                    left: pt.x - labelWidth / 2,
                    width: labelWidth,
                    textAlign: "center",
                  },
                ]}
              >
                {getLocalizedDay(item.label)}
              </RNText>
            );
          })}
        </RNView>

        {/* Interactive Tooltip Card Overlay */}
        {activePoint && activeItem && (
          <RNView
            testID="custom-chart-tooltip"
            style={[
              styles.tooltip,
              {
                // Clamp absolute tooltip position inside the chart boundary width
                left: Math.max(
                  0,
                  Math.min(
                    svgWidth - horizontalScale(130),
                    activePoint.x - horizontalScale(65),
                  ),
                ),
                top: Math.max(0, activePoint.y - verticalScale(60)),
              },
            ]}
          >
            <RNText style={styles.tooltipAmount}>
              {`${currencySymbol}${formatIndianNumber(activeItem.amount)}`}
            </RNText>
            <RNText style={styles.tooltipDate}>
              {formatTooltipDate(activeItem.date)}
            </RNText>
          </RNView>
        )}
      </RNView>
    </RNView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: horizontalScale(16),
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  ltrRow: {
    flexDirection: "row",
  },
  rtlRow: {
    flexDirection: "row-reverse",
  },
  title: {
    ...typography.semibold_16,
    color: colors.primaryText,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.appBackground,
    borderRadius: horizontalScale(60),
    padding: horizontalScale(4),
  },
  toggleTab: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(14),
    borderRadius: horizontalScale(60),
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    ...typography.medium_12,
    color: colors.secondaryText,
  },
  activeToggleText: {
    color: colors.primaryText,
  },
  earningRow: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(16),
  },
  alignLeft: {
    alignItems: "flex-start",
  },
  alignRight: {
    alignItems: "flex-end",
  },
  earningLabel: {
    ...typography.regular_14,
    color: colors.secondaryText,
  },
  earningAmount: {
    ...typography.semibold_26,
    color: colors.primaryText,
    marginTop: verticalScale(3),
  },
  trendBadge: {
    minWidth: horizontalScale(48),
    height: verticalScale(22),
    borderRadius: horizontalScale(60),
    paddingHorizontal: horizontalScale(8),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  trendBadgeProfit: {
    backgroundColor: colors.successBackground,
  },
  trendBadgeLoss: {
    backgroundColor: colors.errorBackground,
  },
  trendText: {
    ...typography.bold_12,
  },
  trendTextProfit: {
    color: colors.successText,
  },
  trendTextLoss: {
    color: colors.errorText,
  },
  trendIcon: {
    marginLeft: horizontalScale(4),
  },
  chartContainer: {
    height: verticalScale(180),
    position: "relative",
  },
  yAxisLabel: {
    position: "absolute",
    ...typography.regular_12,
    color: colors.placeHolder,
    width: horizontalScale(30),
  },
  xAxisContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(16),
  },
  xAxisLabel: {
    ...typography.regular_12,
    color: colors.placeHolder,
  },
  tooltip: {
    position: "absolute",
    width: horizontalScale(130),
    backgroundColor: colors.white,
    borderRadius: horizontalScale(10),
    padding: horizontalScale(8),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.dividerColor,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tooltipAmount: {
    ...typography.semibold_16,
    color: colors.primary,
  },
  tooltipDate: {
    ...typography.regular_12,
    color: colors.secondaryText,
    marginTop: verticalScale(2),
    textAlign: "center",
  },
});
