import { colors } from "@theme/colors";
import { FONTS } from "@theme/fonts";
import { typography } from "@theme/theme";
import { fontScale, horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: verticalScale(30),
    justifyContent: "space-between",
  },
  title: {
    fontSize: fontScale(24),
    fontWeight: "700",
    color: colors.lightBlack,
    textAlign: "center",
  },
  mainContainer: {
    alignItems: "center",
  },
  subtitle: {
    marginTop: verticalScale(16),
    fontSize: fontScale(14),
    fontFamily: FONTS.SFProDisplayRegular,
    color: colors.darkGray,
    textAlign: "center",
    fontWeight: "400",
  },

  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: horizontalScale(30),
    borderTopRightRadius: horizontalScale(30),
    paddingHorizontal: verticalScale(24),
    paddingTop: verticalScale(30),
    minHeight: horizontalScale(400),
  },
  languageChip: {
    marginTop: verticalScale(18),
    alignSelf: "flex-end",
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(6),
    borderWidth: 1,
    borderColor: colors.grayBorder,
    borderRadius: horizontalScale(40),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chipView: {
    paddingHorizontal: horizontalScale(29),
  },
  languageText: {
    marginHorizontal: horizontalScale(10),
    ...typography.regular_14,
    color: colors.primaryText,
    textAlign: "center",
  },
});
