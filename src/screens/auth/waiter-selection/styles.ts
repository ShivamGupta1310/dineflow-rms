import { colors } from "@theme/colors";
import { FONTS } from "@theme/fonts";
import { fontScale, horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerRtl: {
    direction: "rtl",
  },
  description: {
    marginTop: verticalScale(16),
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: fontScale(14),
    lineHeight: verticalScale(15),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  listContent: {
    paddingTop: verticalScale(40),
    marginBottom: verticalScale(300),
    alignItems: "center",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(32),
  },
  emptyStateContainerRtl: {
    direction: "rtl",
  },
  emptyStateTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: colors.primaryText,
    textAlign: "center",
    lineHeight: horizontalScale(24),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  emptyStateTitleRtl: {
    textAlign: "right",
  },
  emptyStateSubtitle: {
    marginTop: verticalScale(8),
    fontSize: fontScale(14),
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: horizontalScale(22),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  emptyStateSubtitleRtl: {
    textAlign: "right",
  },
  columnWrapper: {
    gap: horizontalScale(10),
    marginBottom: verticalScale(10),
  },
  card: {
    width: horizontalScale(107),
    alignItems: "center",
    backgroundColor: colors.appBackground,
    borderRadius: 16,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(8),
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  cardEmpty: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
    borderColor: "transparent",
  },
  avatarWrapper: {
    width: horizontalScale(90),
    height: horizontalScale(95),
    marginBottom: verticalScale(10),
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  name: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: colors.lightBlack,
    textAlign: "center",
    fontFamily: FONTS.SFProDisplayMedium
  },
  bottomBar: {
    paddingHorizontal: horizontalScale(24),
    paddingBottom: verticalScale(30),
    alignItems: "center",
    gap: verticalScale(20),
    backgroundColor: colors.white,
    marginBottom: verticalScale(10),
  },
  continueButton: {
    width: "100%",
    marginTop: verticalScale(18),
  },
  continueButtonActive: {
    width: "100%",
  },
  unlinkText: {
    fontSize: fontScale(12),
    color: colors.lightBlack,
    fontWeight: "500",
    lineHeight: horizontalScale(22),
    fontFamily: FONTS.SFProDisplayMedium
  },
  unlinkTextRtl: {
    textAlign: "right",
  },
});
