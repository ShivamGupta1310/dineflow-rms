import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, moderateScale, verticalScale } from "@utils/scale/scale";

const CARD_RADIUS = moderateScale(16);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(8),
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  printIconSpacing: {
    marginStart: horizontalScale(10),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
  },
  successIconContainer: {
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  successTitle: {
    ...typography.medium_20,
    color: colors.primaryText,
    textAlign: "center",
    marginTop: verticalScale(18),
  },
  billNoLabel: {
    ...typography.regular_16,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: verticalScale(16),
  },
  billNoValue: {
    ...typography.semibold_36,
    color: colors.primaryText,
    textAlign: "center",
    marginTop: verticalScale(4),
  },
  paidTimestamp: {
    ...typography.regular_14,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: verticalScale(6),
  },
  card: {
    backgroundColor: colors.appBackground,
    borderRadius: CARD_RADIUS,
    padding: moderateScale(16),
    marginTop: verticalScale(24),
    shadowColor: colors.lightPink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 2,
  },
  cardTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
    marginBottom: verticalScale(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  rowLabel: {
    ...typography.regular_14,
    color: colors.secondaryText,
  },
  rowValue: {
    ...typography.medium_14,
    color: colors.primaryText,
    textAlign: "left",
  },
  divider: {
    height: 1,
    backgroundColor: colors.devider,
    marginVertical: verticalScale(12),
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    ...typography.medium_14,
    color: colors.primaryText,
  },
  totalValue: {
    ...typography.semibold_18,
    color: colors.primaryText,
    textAlign: "left",
  },
  thankYouContainer: {
    alignItems: "center",
  },
  variableHeight:{
    minHeight: verticalScale(18)
  },
  thankYouTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bgIconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  thankYouText: {
    ...typography.regular_16,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: verticalScale(20),
  },
  bottomIllustrationContainer: {
    alignItems: "center",
  },
});

export default styles;
