import React from "react";
import { FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SVGS } from "@assets";
import {
  AppLoader,
  DashboardHeader,
  RNText,
  RNView,
  TableGridItem,
} from "@components";
import styles from "./styles";
import { DashboardTrendVariant, useDashbaord } from "./useDashbaord";
import withCustomAlert, {
  CustomAlertController,
} from "../../../../hoc/withCustomAlert";
import { formatIndianNumber } from "@utils";
import { horizontalScale } from "@utils/scale/scale";
import { TableGridItemStatus } from "@utils/constants";
import { CustomChart } from "./CustomChart";
import { GiftedChartComponent } from "./GiftedChartComponent";

const ActiveTableSeparator = () => (
  <RNView style={styles.activeTableSeparator} />
);

export const DashboardScreen: React.FC<CustomAlertController> = ({
  showAlert,
  hideAlert,
}) => {
  const {
    t,
    isRTL,
    isLoggingOut,
    dashboardSummary,
    dashboardStats,
    tableLoader,
    todayDate,
    ownerTablesData,
    handleLogout,
    handleViewAllPress,
    handleTablePress,
    chartApproach,
    setChartApproach,
    salesRevenue,
  } = useDashbaord({ showAlert, hideAlert });
  const hasActiveTables = ownerTablesData.length > 0;
  const formattedMonthYear = isRTL
    ? `${todayDate.monthYear} `
    : ` ${todayDate.monthYear}`;

  const renderTrendBadge = (value: number, variant: DashboardTrendVariant) => {
    const isProfit = variant === "profit";
    const TrendIcon = isProfit ? SVGS.ProfitIcon : SVGS.LossIcon;

    return (
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
          {`${Math.round(Number(value))}%`}
        </RNText>
        <TrendIcon style={styles.trendIcon} width={8} height={8} />
      </RNView>
    );
  };

  const todaySale = () => (
    <RNView style={styles.salesCard}>
      <RNView style={styles.salesTopSection}>
        <RNView style={styles.salesLeftContainer}>
          <RNText style={styles.salesTitle}>{dashboardSummary.title}</RNText>
          <RNText style={styles.salesAmount}>{`₹${formatIndianNumber(
            dashboardSummary?.amount || 0,
          )}`}</RNText>
        </RNView>

        <RNView style={styles.salesRightContainer}>
          {renderTrendBadge(dashboardSummary.change, dashboardSummary.variant)}
          <RNText style={styles.salesPeriod}>{dashboardSummary.period}</RNText>
        </RNView>
      </RNView>

      <RNView style={styles.statsContainer}>
        {dashboardStats.map((stat) => (
          <RNView key={stat.title} style={styles.statCard}>
            <RNText style={styles.statTitle}>{stat.title}</RNText>
            <RNView style={styles.statFooter}>
              <RNText style={styles.statValue}>{stat.value}</RNText>
              {stat.title !== t("owner.dashboard.stats.availableTables") &&
                renderTrendBadge(stat.change, stat.variant)}
            </RNView>
          </RNView>
        ))}
      </RNView>
    </RNView>
  );

  const renderTableContainer = (item: any) => (
    <RNView style={styles.activeTableContainer}>
      <TableGridItem
        item={item}
        onPress={() =>
          item.status?.toLowerCase() === TableGridItemStatus.READY_TO_PAY
            ? handleTablePress(item)
            : undefined
        }
      />
    </RNView>
  );

  const renderActiveTables = () => (
    <RNView style={styles.activeTablesCard}>
      <RNView style={styles.activeTablesHeader}>
        <RNText style={styles.activeTablesTitle}>
          {`${t("owner.dashboard.activeTables.title")} (${
            ownerTablesData.length
          })`}
        </RNText>
        {hasActiveTables ? (
          <Pressable
            onPress={handleViewAllPress}
            testID="dashboard-view-all-button"
          >
            <RNText style={styles.activeTablesViewAll}>
              {t("owner.dashboard.activeTables.viewAll")}
            </RNText>
          </Pressable>
        ) : null}
      </RNView>

      <FlatList
        data={ownerTablesData}
        horizontal
        keyExtractor={(item, index) => `${item.table_id.toString()}_${index}`}
        renderItem={({ item }) => renderTableContainer(item)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.activeTablesListContainer,
          isRTL ? styles.rltActiveTables : styles.ltrActiveTables,
          !hasActiveTables && styles.activeTablesEmptyContent,
        ]}
        ItemSeparatorComponent={ActiveTableSeparator}
        ListEmptyComponent={
          <RNView style={styles.activeTablesEmptyState}>
            <RNText style={styles.activeTablesEmptyText}>
              {t("owner.dashboard.activeTables.empty")}
            </RNText>
          </RNView>
        }
      />
    </RNView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNView>
        <DashboardHeader
          onPressProfile={handleLogout}
          rightContainer={
            <RNView style={styles.headerDateBadge}>
              <SVGS.CalendarIcon
                width={horizontalScale(20)}
                height={horizontalScale(20)}
              />
              <RNView
                style={[
                  styles.headerDateContent,
                  !isRTL ? styles.ltrHeaderContent : styles.rtlHeaderContent,
                ]}
              >
                <RNText style={styles.headerDateText}>{todayDate.day}</RNText>
                <RNText style={styles.headerDateSuffixText}>
                  {` ${todayDate.suffix}`}
                </RNText>
                <RNText style={styles.headerDateText}>
                  {formattedMonthYear}
                </RNText>
              </RNView>
            </RNView>
          }
        />
      </RNView>
      {isLoggingOut || tableLoader ? <AppLoader /> : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
      >
        <RNView style={styles.salesSection}>{todaySale()}</RNView>
        {renderActiveTables()}

        {/* Selected Chart Rendering */}
        {salesRevenue ? (
          chartApproach === "custom" ? (
            <CustomChart salesRevenueData={salesRevenue} isRTL={isRTL} />
          ) : (
            <GiftedChartComponent
              salesRevenueData={salesRevenue}
              isRTL={isRTL}
            />
          )
        ) : null}
        {/* Chart Selector Switch Bar */}
        <RNView
          style={[
            styles.chartSelectorContainer,
            isRTL ? styles.rtlRow : styles.ltrRow,
          ]}
        >
          <Pressable
            onPress={() => setChartApproach("custom")}
            style={[
              styles.selectorButton,
              chartApproach === "custom" && styles.activeSelectorButton,
            ]}
          >
            <RNText
              style={[
                styles.selectorButtonText,
                chartApproach === "custom" && styles.activeSelectorButtonText,
              ]}
            >
              {t("owner.dashboard.salesRevenue.customToggle")}
            </RNText>
          </Pressable>
          <Pressable
            onPress={() => setChartApproach("gifted")}
            style={[
              styles.selectorButton,
              chartApproach === "gifted" && styles.activeSelectorButton,
            ]}
          >
            <RNText
              style={[
                styles.selectorButtonText,
                chartApproach === "gifted" && styles.activeSelectorButtonText,
              ]}
            >
              {t("owner.dashboard.salesRevenue.giftedToggle")}
            </RNText>
          </Pressable>
        </RNView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default withCustomAlert(DashboardScreen);
