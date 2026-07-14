import {colors} from "@theme/colors";
import {typography} from "@theme/theme";
import {horizontalScale, verticalScale} from "@utils/scale/scale";
import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  formContainer: {
    paddingBottom: verticalScale(10),
    flexGrow: 1,
  },
  formContainerRtl: {
    direction: "rtl",
  },
  welcomeTitle: {
    ...typography.h3,
    color: colors.primaryText,
    textAlign: "center",
  },
  welcomeSubtitle: {
    ...typography.regular_14,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: verticalScale(8),
  },
  inputSection: {
    marginTop: verticalScale(24),
  },
  mobileInputWrapper: {
    marginTop: verticalScale(6),
  },
  flagContainer: {
    width: horizontalScale(44),
    height: horizontalScale(44),
    borderRadius: horizontalScale(25),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightPink,
  },
  rememberRow: {
    marginTop: verticalScale(12),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  checkbox: {
    width: horizontalScale(16),
    height: horizontalScale(16),
    borderRadius: horizontalScale(4),
    borderWidth: 1,
    borderColor: colors.grayBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: horizontalScale(8),
  },
  checkboxRtl: {
    marginRight: 0,
    marginLeft: horizontalScale(8),
  },
  checkboxChecked: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  rememberText: {
    ...typography.regular_12,
    color: colors.primaryText,
  },
  submitError: {
    ...typography.regular_12,
    color: colors.error,
    textAlign: "center",
    marginTop: verticalScale(12),
  },
  continueButton: {
    marginTop: verticalScale(18),
  },
  waiterIcon: {
    width: horizontalScale(44),
    height: horizontalScale(44),
    borderRadius: horizontalScale(22),
    marginRight: horizontalScale(12),
  },
});
