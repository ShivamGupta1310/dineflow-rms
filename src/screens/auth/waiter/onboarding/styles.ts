import { colors } from "@theme/colors";
import { FONTS } from "@theme/fonts";
import { fontScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontScale(20),
    fontWeight: "600",
    color: colors.primaryText,
    textAlign: "center",
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  description: {
    marginTop: verticalScale(16),
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: fontScale(14),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  passcodeOR: {
    marginTop: verticalScale(14),
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: fontScale(14),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  logo: {
    marginBottom: verticalScale(-2),
    marginTop: verticalScale(40),
  },
  textInputContainer: {
    marginTop: verticalScale(16),
  },
  continueButton: {
    marginVertical: verticalScale(16),
  },
});

export default styles;
