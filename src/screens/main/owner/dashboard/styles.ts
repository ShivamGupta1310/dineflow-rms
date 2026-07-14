import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  fontScale,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  mainContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(20),
    rowGap: verticalScale(24),
  },
  salesSection: {
    width: "100%",
  },
  salesCard: {
    backgroundColor: colors.white,
    borderRadius: horizontalScale(20),
    paddingTop: verticalScale(16),
    paddingLeft: horizontalScale(10),
    paddingRight: horizontalScale(10),
    paddingBottom: verticalScale(10),
  },
  salesTopSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  salesLeftContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(6),
  },
  salesTitle: {
    ...typography.regular_14,
    color: colors.darkGray,
  },
  salesAmount: {
    ...typography.semibold_26,
    marginTop: verticalScale(3),
    color: colors.primaryText,
  },
  salesRightContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  salesPeriod: {
    marginTop: verticalScale(10),
    ...typography.regular_12,
    color: colors.darkGray,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: verticalScale(20),
    padding: horizontalScale(6),
    borderRadius: horizontalScale(14),
    backgroundColor: colors.appBackground,
    columnGap: horizontalScale(8),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: horizontalScale(10),
    paddingHorizontal: horizontalScale(12),
    paddingTop: verticalScale(11),
    paddingBottom: verticalScale(11),
    justifyContent: "space-between",
  },
  statTitle: {
    ...typography.regular_14,
    lineHeight: fontScale(18),
    color: colors.darkGray,
  },
  statFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(20),
  },
  statValue: {
    ...typography.semibold_20,
    lineHeight: fontScale(24),
    color: colors.primaryText,
  },
  trendBadge: {
    minWidth: horizontalScale(42),
    height: verticalScale(20),
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
    ...typography.regular_12,
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
  headerDateBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: horizontalScale(16),
    borderRadius: horizontalScale(20),
    backgroundColor: colors.white,
  },
  headerDateContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  ltrHeaderContent: {
    marginLeft: horizontalScale(8),
  },
  rtlHeaderContent: {
    marginRight: horizontalScale(8),
  },
  headerDateText: {
    ...typography.medium_12,
    color: colors.ownerHeaderDateText,
  },
  headerDateSuffixText: {
    ...typography.medium_10,
    color: colors.ownerHeaderDateText,
    alignSelf: "flex-start",
    marginTop: -2,
  },
  activeTablesCard: {
    backgroundColor: colors.white,
    borderRadius: horizontalScale(20),
    paddingVertical: verticalScale(16),
  },
  activeTablesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: horizontalScale(16),
  },
  activeTablesTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
  },
  activeTablesViewAll: {
    ...typography.regular_14,
    color: colors.primary,
  },
  activeTablesListContent: {
    marginLeft: horizontalScale(16),
  },
  activeTablesListContainer: {
    flexGrow: 1,
    marginTop: verticalScale(20),
  },
  ltrActiveTables: {
    paddingLeft: horizontalScale(10),
  },
  rltActiveTables: {
    paddingRight: horizontalScale(10),
  },
  activeTablesEmptyContent: {
    paddingRight: horizontalScale(10),
  },
  activeTableSeparator: {
    width: horizontalScale(12),
  },
  activeTableContainer: {
    width: moderateScale(106),
  },
  activeTablesEmptyState: {
    flex: 1,
    height: verticalScale(120),
    borderRadius: horizontalScale(18),
    backgroundColor: colors.appBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTablesEmptyText: {
    ...typography.regular_14,
    color: colors.darkGray,
    textAlign: "center",
  },
  chartSelectorContainer: {
    backgroundColor: colors.white,
    borderRadius: horizontalScale(12),
    padding: horizontalScale(4),
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: horizontalScale(8),
  },
  activeSelectorButton: {
    backgroundColor: colors.primary,
  },
  selectorButtonText: {
    ...typography.medium_14,
    color: colors.secondaryText,
  },
  activeSelectorButtonText: {
    color: colors.white,
  },
  ltrRow: {
    flexDirection: "row",
  },
  rtlRow: {
    flexDirection: "row-reverse",
  },
});

export default styles;
