import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { typography } from "@theme/theme";

const styles = StyleSheet.create({
  button: {
    minHeight: verticalScale(52),
    borderRadius: horizontalScale(26),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(20),
    borderWidth: 1.5,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  outlinedButton: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginEnd: horizontalScale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...typography.semibold_16,
  },
  primaryButtonText: {
    color: colors.white,
  },
  outlinedButtonText: {
    color: colors.primary,
  },
  flexRow: {
    flexDirection: "row",
  },
  loadingTextSpacing: { marginHorizontal: horizontalScale(5) },
});

export default styles;
