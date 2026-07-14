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
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(12),
  },
  scrollContentRtl: {
    direction: "rtl",
  },
  billHeaderCard: {
    alignItems: "center",
    marginTop: verticalScale(26),
  },
  billHeaderLabel: {
    ...typography.regular_16,
    color: colors.secondaryText,
    marginBottom: verticalScale(6),
  },
  billHeaderValue: {
    ...typography.semibold_36,
    color: colors.primaryText,
  },
  highlightedInfoContainer: {
    flex: 1,
    borderColor: colors.grayBorder,
    paddingVertical: verticalScale(28),
    alignItems: "center",
  },
  highlightedInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "80%",
  },
  highlightedInfoRowSpacing: { marginTop: verticalScale(10) },
  highlightedInfoText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    marginStart: horizontalScale(6),
  },
  textRight: {
    textAlign: "right",
  },
  infoDivider: {
    width: 1,
    height: verticalScale(16),
    backgroundColor: colors.grayBorder,
    marginHorizontal: horizontalScale(16),
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: CARD_RADIUS,
    paddingHorizontal: horizontalScale(16),
    paddingTop: horizontalScale(16),
    marginBottom: verticalScale(10),
    shadowColor: colors.lightPink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 2,
  },
  cardPadding: {
    padding: horizontalScale(16),
  },
  sectionTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
    marginBottom: verticalScale(6),
  },
  itemsList: { marginBottom: verticalScale(6) },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  itemRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.devider,
  },
  itemIconWrap: {
    width: horizontalScale(46),
    height: horizontalScale(46),
    borderRadius: horizontalScale(8),
    marginEnd: horizontalScale(10),
    backgroundColor: colors.lightPink,
    overflow: "hidden",
  },
  centerIcon: {
    width: horizontalScale(46),
    height: horizontalScale(46),
    borderRadius: horizontalScale(8),
    marginEnd: horizontalScale(10),
    backgroundColor: colors.lightPink,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: {
    flex: 1,
    marginEnd: horizontalScale(10),
  },
  itemName: {
    ...typography.medium_16,
    color: colors.primaryText,
  },
  itemQuantity: {
    ...typography.regular_12,
    color: colors.secondaryText,
    marginTop: verticalScale(2),
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
    height: 1,
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
});

export default styles;
