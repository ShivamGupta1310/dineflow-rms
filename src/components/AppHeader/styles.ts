import { colors } from "@theme/colors";
import { FONTS } from "@theme/fonts";
import { fontScale, horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "flex-end",
    paddingHorizontal: verticalScale(20),
  },
  goBackContainer: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(40),
    backgroundColor: colors.appBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  rightViewContainer: {
    width: horizontalScale(40),
    height: horizontalScale(40),
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logoContainer: {
    marginBottom: verticalScale(3),
  },
  title: {
    fontSize: fontScale(24),
    fontWeight: "700",
    color: colors.lightBlack,
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  iconRtl: {
    transform: [{ rotate: "180deg" }],
  },
});
