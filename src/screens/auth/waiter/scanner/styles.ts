import { colors } from "@theme/colors";
import { FONTS } from "@theme/fonts";
import { fontScale, horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: horizontalScale(24),
  },
  description: {
    marginTop: verticalScale(16),
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: fontScale(14),
    lineHeight: verticalScale(15),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  barCodeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(40),
  },
  passcodeOR: {
    marginTop: verticalScale(40),
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: fontScale(14),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  textInputContainer: {
    marginTop: verticalScale(40),
  },
  button: {
    marginVertical: verticalScale(16),
  },
});

export default styles;
