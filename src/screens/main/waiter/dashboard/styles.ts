import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";

const CARD_SHADOW = {
  shadowColor: colors.black,
  shadowOffset: {
    width: 0,
    height: verticalScale(6),
  },
  shadowOpacity: 0.06,
  shadowRadius: moderateScale(18),
  elevation: 4,
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(10),
  },
  scrollContent: {
    paddingBottom: verticalScale(120),
  },
  headerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(4),
    backgroundColor: colors.appBackground,
  },
  headerAvatarWrap: {
    width: horizontalScale(46),
    height: horizontalScale(46),
    borderRadius: horizontalScale(23),
    overflow: "hidden",
    backgroundColor: colors.white,
    ...CARD_SHADOW,
  },
  headerAvatar: {
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    ...typography.semibold_18,
    color: colors.primaryText,
    includeFontPadding: false,
  },
  headerSubtitle: {
    ...typography.regular_12,
    color: colors.darkGray,
    marginTop: verticalScale(2),
    includeFontPadding: false,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: horizontalScale(40),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: colors.white,
  },
  logoutButtonPressed: {
    opacity: 0.75,
  },
  logoutIconWrap: {
    marginEnd: horizontalScale(6),
  },
  logoutText: {
    ...typography.medium_12,
    color: colors.cherryRed,
    includeFontPadding: false,
  },
  reservationCard: {
    backgroundColor: colors.white,
    borderRadius: horizontalScale(20),
    paddingHorizontal: horizontalScale(10),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(10),
    marginBottom: verticalScale(20),
    ...CARD_SHADOW,
  },
  reservationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(6),
  },
  reservationTitle: {
    ...typography.regular_14,
    color: colors.darkGray,
  },
  reservationCount: {
    ...typography.semibold_26,
    color: colors.primaryText,
    marginTop: verticalScale(4),
    includeFontPadding: false,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: verticalScale(12),
    padding: moderateScale(6),
    backgroundColor: colors.appBackground,
    borderRadius: horizontalScale(14),
  },
  statCard: {
    flex: 1,
    minHeight: verticalScale(84),
    borderRadius: horizontalScale(10),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  statCardPending: {
    marginStart: horizontalScale(6),
  },
  statTitle: {
    ...typography.regular_14,
    color: colors.primaryText,
    includeFontPadding: false,
  },
  statFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  statValue: {
    ...typography.semibold_20,
    color: colors.primaryText,
    includeFontPadding: false,
  },
  statIconWrap: {
    width: horizontalScale(24),
    height: horizontalScale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  activeTablesCard: {
    backgroundColor: colors.white,
    borderRadius: horizontalScale(16),
    padding: horizontalScale(16),
    marginBottom: verticalScale(20),
    ...CARD_SHADOW,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
    includeFontPadding: false,
  },
  viewAllText: {
    ...typography.regular_14,
    color: colors.primary,
    includeFontPadding: false,
  },
  activeTablesRow: {
    flexDirection: "row",
  },
  activeTableCard: {
    width: horizontalScale(104),
    minHeight: verticalScale(100),
    borderRadius: horizontalScale(16),
    alignItems: "center",
    justifyContent: "center",
    marginEnd: horizontalScale(8),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(12),
  },
  activeTableCardLast: {
    marginEnd: 0,
  },
  activeTableIconWrap: {
    marginBottom: verticalScale(8),
  },
  activeTableLabel: {
    ...typography.medium_14,
    color: colors.primaryText,
    includeFontPadding: false,
  },
});
