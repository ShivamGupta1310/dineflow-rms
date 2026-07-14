import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";
import { fontScale, horizontalScale, verticalScale } from "@utils/scale/scale";
import { FONTS } from "@theme/fonts";

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(8),
  },
  label: {
    fontSize: fontScale(16),
    color: colors.primaryText,
    marginBottom: verticalScale(10),
    fontFamily: FONTS.SFProDisplayMedium,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grayBorder,
    borderRadius: 70,
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(20),
    fontSize: fontScale(14),
    color: colors.primaryText,
    backgroundColor: colors.white,
    height: verticalScale(56),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: fontScale(12),
    color: colors.error,
    marginTop: verticalScale(6),
    fontWeight: "500",
  },
  rtlInput: {
    textAlign: "right",
  },
});

export default styles;
