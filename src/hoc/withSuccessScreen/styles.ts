import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { typography } from "@theme/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(45),
    backgroundColor: colors.transparentBlack,
  },

  alertCard: {
    minWidth: horizontalScale(305),
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    overflow: "hidden",
  },

  titleContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
  },

  title: {
    textAlign: "center",
    color: colors.primaryText,
    ...typography.medium_16,
  },

  subtitleContainer: {
    alignItems: "center",
  },

  subIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  subtitle: {
    marginTop: verticalScale(20),
    textAlign: "center",
    lineHeight: horizontalScale(22),
    color: colors.primaryText,
    ...typography.regular_16,
  },

  divider: {
    borderBottomWidth: moderateScale(5),
    borderBottomColor: colors.appBackground,
  },

  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
  },

  okText: {
    color: colors.primary,
    ...typography.medium_14,
  },
});