import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { typography } from "@theme/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparentBlack,
    paddingHorizontal: horizontalScale(24),
  },
  alertCard: {
    width: "auto",
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    minWidth: horizontalScale(305),
  },
  titleContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(14),
  },
  title: {
    textAlign: "center",
    ...typography.medium_16,
    color: colors.primaryText,
  },
  subtitleContainer: {
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(18),
  },
  divider: {
    borderBottomWidth: 5,
    borderBottomColor: colors.appBackground,
    borderStyle: "solid",
  },
  subtitle: {
    textAlign: "center",
    ...typography.regular_16,
    lineHeight: horizontalScale(22),
    color: colors.primaryText,
  },
  actionRow: {
    flexDirection: "row",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
  },
  cancelText: {
    ...typography.medium_14,
  },
  okText: {
    color: colors.primary,
    ...typography.medium_14,
  },
});
