import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";

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
    minHeight: verticalScale(52),
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
    marginTop: verticalScale(10),
  },
  scrollContentRtl: {
    direction: "rtl",
  },
  mainContainer: {
    alignItems: "center",
    marginTop: verticalScale(26),
    justifyContent: "center",
  },
  personContainer: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: moderateScale(6),
    height: verticalScale(32),
    justifyContent: "center",
    width: horizontalScale(32),
  },
  billHeaderValue: {
    ...typography.medium_20,
    color: colors.primaryText,
    marginTop: verticalScale(8),
  },
  highlightedInfoContainer: {
    alignItems: "center",
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
  },
  highlightedInfoRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  highlightedInfoRowSpacing: {
    marginTop: verticalScale(20),
  },
  highlightedInfoText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    marginStart: horizontalScale(6),
  },
  infoDivider: {
    backgroundColor: colors.grayBorder,
    height: verticalScale(16),
    marginHorizontal: horizontalScale(16),
    width: 1,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: CARD_RADIUS,
    elevation: 2,
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(4),
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(16),
    shadowColor: colors.lightPink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  cardPadding: { paddingBottom: verticalScale(12) },
  emptyStateCard: {
    marginTop: verticalScale(26),
    paddingBottom: verticalScale(16),
  },
  sectionTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
    marginBottom: verticalScale(6),
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
  },
  itemRowDivider: {
    borderBottomColor: colors.devider,
    borderBottomWidth: 1,
  },
  itemTitle: {
    ...typography.regular_14,
    color: colors.darkGray,
    flex: 1,
  },
  itemValue: {
    ...typography.regular_14,
    color: colors.primaryText,
    flex: 1,
    textAlign: "right",
  },
  emptyText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    paddingVertical: verticalScale(8),
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  footer: {
    backgroundColor: colors.white,
    elevation: 2,
    flexDirection: "row",
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  shareButtonSpacing: {
    marginEnd: horizontalScale(10),
  },
  statusChip: {
    borderRadius: moderateScale(6),
    marginTop: verticalScale(8),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(6),
  },
  statusText: {
    ...typography.semibold_10,
    fontSize: 10,
    lineHeight: verticalScale(14),
  },
  statusChipPending: {
    backgroundColor: colors.warningBackgroundLight,
  },
  statusChipNeedConfirmation: {
    backgroundColor: colors.warningBackgroundSoft,
  },
  statusChipConfirmed: {
    backgroundColor: colors.successBackgroundLight,
  },
  statusChipReserved: {
    backgroundColor: colors.infoBackgroundLight,
  },
  statusChipCancelled: {
    backgroundColor: colors.lightOrange,
  },
  statusTextPending: {
    color: colors.warningTextStrong,
  },
  statusTextNeedConfirmation: {
    color: colors.primary,
  },
  statusTextConfirmed: {
    color: colors.successText,
  },
  statusTextReserved: {
    color: colors.infoTextStrong,
  },
  statusTextCancelled: {
    color: colors.dangerTextStrong,
  },
});

export default styles;
