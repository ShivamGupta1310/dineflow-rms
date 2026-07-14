import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";

const CARD_RADIUS = horizontalScale(16);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  safeAreaRtl: {
    direction: "rtl",
  },
  headerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(8),
  },
  headerContent: {
    minHeight: verticalScale(40),
  },
  headerAction: {
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    gap: verticalScale(30),
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(12),
  },
  scrollContentRtl: {
    direction: "rtl",
  },
  detailsContainer: {
    gap: verticalScale(10),
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: CARD_RADIUS,
    paddingHorizontal: horizontalScale(16),
    padding: horizontalScale(16),
    shadowColor: colors.lightPink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 2,
    boxShadow: `0px 0px 20px 0px ${colors.menuCardShadow}`,
  },
  sectionTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
    marginBottom: verticalScale(6),
  },
  itemPrice: {
    ...typography.medium_16,
    color: colors.primaryText,
    textAlign: "left",
  },
  emptyText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    paddingVertical: verticalScale(8),
    textAlign: "center",
  },
  billRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  subTotalTopSpacing: {
    marginTop: verticalScale(4),
  },
  billRowLabel: {
    ...typography.regular_14,
    color: colors.secondaryText,
  },
  billRowValue: {
    ...typography.medium_14,
    color: colors.primaryText,
    textAlign: "left",
  },
  addDiscountText: {
    ...typography.medium_14,
    color: colors.primary,
  },
  billDivider: {
    height: verticalScale(1),
    backgroundColor: colors.devider,
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
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
  footer: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 2,
  },
  shareButtonSpacing: {
    marginEnd: horizontalScale(10),
  },
  divider: {
    height: verticalScale(1),
    marginVertical: verticalScale(10),
    backgroundColor: colors.dividerColor,
  },
  guestDetailsContainer: {
    gap: verticalScale(14),
  },
  inputLabelStyle: {
    ...typography.medium_14,
    color: colors.primaryText,
  },
  inputViewContainer: {
    minHeight: verticalScale(46),
    borderRadius: horizontalScale(50),
    paddingHorizontal: horizontalScale(16),
  },
  mobileInputSpacing: {
    paddingStart: horizontalScale(6),
  },
  mobilePrefixView: {
    borderEndWidth: verticalScale(0),
    paddingEnd: horizontalScale(5),
    marginEnd: horizontalScale(5),
  },
  flagContainer: {
    width: horizontalScale(34),
    height: horizontalScale(34),
    borderRadius: horizontalScale(17),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightPink,
  },
  successSubtitle: {
    marginTop: verticalScale(0),
  },
});

export default styles;
