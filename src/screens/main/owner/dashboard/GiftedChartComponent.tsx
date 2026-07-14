import React, { useState, useMemo } from "react";
import { StyleSheet, Pressable, Dimensions } from "react-native";
import { LineChart, yAxisSides } from "react-native-gifted-charts";
import { useTranslation } from "react-i18next";
import { RNView, RNText } from "@components";
import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { SVGS } from "@assets";
import {
  horizontalScale,
  verticalScale,
  fontScale,
} from "@utils/scale/scale";
import {
  formatTooltipDate,
  prepareWeeklyGraphData,
  formatIndianNumber,
} from "@utils";
import { GraphItem, SalesRevenue } from "@store/slices/ownerDashboardSlice";

interface GiftedChartProps {
  salesRevenueData?: SalesRevenue;
  isRTL?: boolean;
}

export const GiftedChartComponent: React.FC<GiftedChartProps> = ({
  salesRevenueData,
  isRTL = false,
}) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<"weekly" | "monthly">("weekly");
  const [containerWidth, setContainerWidth] = useState<number>(
    Dimensions.get("window").width - horizontalScale(40)
  );

  // Prepare Raw Data
  const rawDataList = useMemo<GraphItem[]>(() => {
    if (!salesRevenueData) return [];
    if (selectedTab === "weekly") {
      return prepareWeeklyGraphData(
        salesRevenueData.weekly_chart?.graph || [],
        salesRevenueData.weekly_chart?.graph?.[0]?.date
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

  // Localize day names helper
  const getLocalizedDay = (day: string | number) => {
    if (typeof day === "number") return String(day);
    const key = `common.days.${day.toLowerCase()}`;
    const trans = t(key);
    return trans.includes("common.days") ? day : trans;
  };

  // Format data for react-native-gifted-charts
  const formattedChartData = useMemo(() => {
    const data = rawDataList.map((item, index) => {
      // Show X-axis label at multiples of 5 for monthly, or always for weekly
      const isVisible =
        selectedTab === "weekly" ||
        Number(item.label) === 1 ||
        Number(item.label) % 5 === 0 ||
        Number(item.label) === rawDataList.length;

      return {
        value: item.amount,
        label: isVisible ? getLocalizedDay(item.label) : "",
        date: item.date,
      };
    });

    // Gifted charts renders left-to-right. To handle RTL, we reverse the data array
    // so Monday starts on the right side and flows left.
    return isRTL ? [...data].reverse() : data;
  }, [rawDataList, selectedTab, isRTL]);

  // Maximum value for Y-axis scaling
  const maxVal = useMemo(() => {
    const max = Math.max(...rawDataList.map(item => item.amount), 1);
    // Nice rounding
    if (max <= 1000) return Math.ceil(max / 100) * 100;
    if (max <= 10000) return Math.ceil(max / 2000) * 2000;
    return Math.ceil(max / 5000) * 5000;
  }, [rawDataList]);

  // Trend mapping
  const changePercentage = salesRevenueData?.change_percentage || 0;
  const isProfit = (salesRevenueData?.trend || "UP") === "UP";
  const TrendIcon = isProfit ? SVGS.ProfitIcon : SVGS.LossIcon;

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  // Safe dimension variables
  const chartHeight = verticalScale(120);
  const chartWidthOffset = horizontalScale(70);
  const calculatedWidth = containerWidth - chartWidthOffset;

  return (
    <RNView
      style={styles.card}
      onLayout={handleLayout}
      testID="sales-revenue-gifted-chart-card"
    >
      {/* Header section */}
      <RNView style={[styles.headerRow, isRTL ? styles.rtlRow : styles.ltrRow]}>
        <RNText style={styles.title}>{t("owner.dashboard.salesRevenue.title")} (Gifted)</RNText>
        
        {/* Toggle tabs */}
        <RNView style={styles.toggleContainer}>
          <Pressable
            onPress={() => setSelectedTab("weekly")}
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
            onPress={() => setSelectedTab("monthly")}
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
      <RNView style={[styles.earningRow, isRTL ? styles.rtlRow : styles.ltrRow]}>
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

      {/* Chart Render Area */}
      <RNView style={styles.chartWrapper}>
        {formattedChartData.length > 0 && (
          <LineChart
            data={formattedChartData}
            areaChart
            curved
            height={chartHeight}
            width={calculatedWidth}
            maxValue={maxVal}
            noOfSections={4}
            spacing={calculatedWidth / (formattedChartData.length - 1 || 1)}
            initialSpacing={0}
            endSpacing={0}
            color={colors.primary}
            thickness={2}
            startFillColor={colors.primary}
            endFillColor={colors.primary}
            startOpacity={0.25}
            endOpacity={0.0}
            rulesType="dashed"
            rulesColor={colors.dividerColor}
            yAxisColor="transparent"
            xAxisColor="transparent"
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisSide={isRTL ? yAxisSides.RIGHT : yAxisSides.LEFT}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            hideRules={false}
            dataPointsColor="transparent"
            overflowTop={verticalScale(70)}
            disableScroll={true}
            pointerConfig={{
              pointerColor: colors.primary,
              radius: 5,
              pointerLabelWidth: horizontalScale(130),
              pointerLabelHeight: verticalScale(60),
              pointerEvents: "auto",
              showPointerStrip: false,
              autoAdjustPointerLabelPosition: true,
              pointerComponent: () => (
                <RNView
                  style={{
                    width: horizontalScale(10),
                    height: horizontalScale(10),
                    borderRadius: horizontalScale(5),
                    backgroundColor: colors.primary,
                    borderWidth: 2,
                    borderColor: colors.white,
                  }}
                />
              ),
              pointerLabelComponent: (items: any[]) => {
                if (!items || items.length === 0) return null;
                const activeItem = items[0];
                return (
                  <RNView style={styles.tooltip}>
                    <RNText style={styles.tooltipAmount}>
                      {`${currencySymbol}${formatIndianNumber(activeItem.value)}`}
                    </RNText>
                    <RNText style={styles.tooltipDate}>
                      {formatTooltipDate(activeItem.date || new Date())}
                    </RNText>
                  </RNView>
                );
              },
            }}
          />
        )}
      </RNView>
    </RNView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: horizontalScale(20),
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
    marginBottom: verticalScale(14),
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
    color: colors.darkGray,
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
  chartWrapper: {
    height: verticalScale(200),
    justifyContent: "center",
    paddingTop: verticalScale(10),
  },
  axisText: {
    fontSize: fontScale(9),
    color: colors.placeHolder,
    fontFamily: typography.regular_12.fontFamily,
  },
  tooltip: {
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
    width: horizontalScale(130),
    transform: [{ translateY: verticalScale(-70) }], // Center above the pointer circle
  },
  tooltipAmount: {
    ...typography.semibold_16,
    color: colors.primary,
  },
  tooltipDate: {
    ...typography.regular_10,
    color: colors.secondaryText,
    marginTop: verticalScale(2),
    textAlign: "center",
  },
});
