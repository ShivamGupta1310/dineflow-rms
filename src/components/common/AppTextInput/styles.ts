import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { typography } from "@theme/theme";

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    ...typography.medium_16,
    color: colors.primaryText,
    marginBottom: verticalScale(10),
  },
  inputContainer: {
    minHeight: verticalScale(56),
    borderRadius: horizontalScale(28),
    borderWidth: 1,
    borderColor: colors.grayBorder,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(8),
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  disabledInput: {
    opacity: 0.7,
  },
  leftAccessory: {
    marginEnd: horizontalScale(8),
  },
  prefixContainer: {
    paddingRight: horizontalScale(10),
    marginEnd: horizontalScale(10),
    borderRightWidth: 1,
    borderRightColor: colors.grayBorder,
  },
  prefixText: {
    ...typography.regular_14,
    color: colors.primaryText,
  },
  input: {
    flex: 1,
    ...typography.regular_14,
    color: colors.primaryText,
  },
  alignRight: { textAlign: "right" },
  rightAccessory: {
    marginStart: horizontalScale(8),
  },
  errorText: {
    ...typography.regular_12,
    marginTop: verticalScale(6),
    color: colors.error,
  },
});

export default styles;
