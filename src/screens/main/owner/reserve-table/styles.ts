import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from "@utils/scale/scale";

const CARD_RADIUS = moderateScale(16);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  headerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(6),
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(132),
  },
  infoCard: {
    alignItems: "center",
    marginTop: verticalScale(16),
  },
  avatarContainer: {
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderRadius: moderateScale(6),
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(6),
  },
  customerName: {
    ...typography.medium_20,
    color: colors.primaryText,
    textAlign: "center",
    marginBottom: verticalScale(6),
  },
  statusBadge: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(2),
    marginBottom: verticalScale(18),
  },
  statusText: {
    ...typography.medium_10,
    color: colors.statusConfirmed,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  phoneText: {
    ...typography.regular_14,
    color: colors.primaryText,
    marginStart: horizontalScale(6),
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    ...typography.regular_14,
    color: colors.primaryText,
    marginStart: horizontalScale(6),
  },
  detailDivider: {
    width: 1,
    height: verticalScale(16),
    backgroundColor: colors.detailsDividerColor,
    marginHorizontal: horizontalScale(16),
  },
  timeSlotTopSpacing: {
    marginTop: verticalScale(30),
  },
  tableSpacing: {
    paddingTop: horizontalScale(16),
    paddingBottom: horizontalScale(6),
  },
  sectionContainer: {
    backgroundColor: colors.white,
    borderRadius: CARD_RADIUS,
    paddingVertical: horizontalScale(16),
    marginTop: verticalScale(10),
    shadowColor: colors.lightPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(18),
    paddingHorizontal: horizontalScale(16),
  },
  sectionTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
  },
  sectionRightText: {
    ...typography.regular_14,
    color: colors.secondaryText,
  },
  timeSlotsList: {
    paddingStart: horizontalScale(16),
    paddingEnd: horizontalScale(10),
  },
  ltrStyle: { direction: "ltr" },
  timeSlotCard: {
    width: horizontalScale(90),
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(18),
    borderWidth: 1,
    borderRadius: moderateScale(12),
    borderColor: colors.backdropColor,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginEnd: horizontalScale(6),
  },
  timeSlotCardSelected: {
    borderWidth: 1,
    borderColor: colors.availableBorder,
    backgroundColor: colors.availableBG,
  },
  timeSlotText: {
    ...typography.medium_14,
    color: colors.primaryText,
    textAlign: "center",
    marginBottom: verticalScale(6),
  },
  timeSlotStatus: {
    ...typography.semibold_12,
    color: colors.tableTimeText,
  },
  tablesListContainer: {
    paddingHorizontal: horizontalScale(12),
  },
  activeTableContainer: {
    flex: 1,
    maxWidth: "31.33%",
    marginHorizontal: "1%",
    marginBottom: verticalScale(10),
    borderRadius: moderateScale(14),
    backgroundColor: colors.white,
  },
  tableCard: {
    borderWidth: 1,
    borderColor: colors.backdropColor,
    backgroundColor: colors.white,
  },
  tableCardSelected: {
    borderWidth: 1,
    borderColor: colors.availableBorder,
    backgroundColor: colors.availableBG,
  },
  bottomViewStyle: {
    backgroundColor: colors.appBackground,
  },
  selectedBottomViewStyle: {
    backgroundColor: colors.white,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(16),
    justifyContent: "space-between",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  cancelButton: {
    marginEnd: horizontalScale(10),
  },
  loadingContainer: {
    paddingVertical: verticalScale(34),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    textAlign: "center",
    paddingVertical: verticalScale(20),
  },
  disabledCard: {
    opacity: 0.5,
  },
});

export default styles;
