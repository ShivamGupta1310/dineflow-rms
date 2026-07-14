import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  safeAreaRtl: {
    direction: "rtl",
  },
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  scrollView: {
    flex: 1,
    marginBottom: verticalScale(-40),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(40),
  },
  headerContainer: {
    paddingRight: horizontalScale(20),
    paddingLeft: horizontalScale(8),
    paddingTop: verticalScale(8),
  },
  headerContent: {
    minHeight: verticalScale(52),
  },
  headerAction: {
    backgroundColor: colors.white,
  },
  listSection: {
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
    borderRadius: horizontalScale(16),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(4),
    backgroundColor: colors.white,
  },
  listHeader: {
    paddingHorizontal: horizontalScale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  listTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
    lineHeight: 23,
  },
  listCount: {
    ...typography.regular_14,
    color: colors.primaryText,
  },
  listContent: {
    flex: 1,
    paddingHorizontal: horizontalScale(12),
  },
  columnWrapper: {
    gap: horizontalScale(10),
    marginBottom: verticalScale(10),
  },
  columnWrapperRtl: {
    flexDirection: "row-reverse",
  },
  emptyText: {
    paddingVertical: verticalScale(24),
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: moderateScale(13),
  },
  statusInfoContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  statusInfoContainerRtl: {
    alignItems: "flex-end",
  },
  statusTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
    includeFontPadding: false,
    marginBottom: verticalScale(6),
  },
  statusTextRtl: {
    textAlign: "right",
  },
  statusDesc: {
    ...typography.regular_14,
    color: colors.secondaryText,
    marginBottom: verticalScale(16),
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusCard: {
    width: horizontalScale(177),
    borderRadius: horizontalScale(10),
    paddingStart: horizontalScale(12),
    paddingEnd: horizontalScale(30),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(6),
  },
  statusCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIconWrap: {
    marginEnd: horizontalScale(12),
  },
  statusCardTitle: {
    ...typography.regular_14,
  },
  statusCardDesc: {
    ...typography.regular_12,
    color: colors.darkGray,
    marginTop: verticalScale(12),
  },
  activeTableContainer: {
  },
  allTablesText:{
    ...typography.semibold_16
  },
  tableCountText:{
    ...typography.regular_14

  }
});
