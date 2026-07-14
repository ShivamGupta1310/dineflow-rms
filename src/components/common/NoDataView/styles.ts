import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { moderateScale, verticalScale } from "@utils/scale/scale";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(40),
    width: "100%",
    flex: 1
  },
  imageContainer: {
    marginBottom: verticalScale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.regular_16,
    color: colors.atlanticBlue,
    textAlign: "center",
    marginBottom: verticalScale(20),
  },
  message: {
    ...typography.regular_12,
    color: colors.darkGray,
    textAlign: "center",
    lineHeight: moderateScale(16),
    marginBottom: verticalScale(20),
  },
  refreshButton: {
    minHeight: verticalScale(44),
    height: verticalScale(44),
    borderWidth: 1,
    borderColor: colors.grayBorder,
    borderRadius: moderateScale(22),
    paddingHorizontal: moderateScale(14),
    backgroundColor: colors.white,
  },
  refreshText: {
    ...typography.regular_14,
    color: colors.primaryText,
    marginStart: moderateScale(4),
  },
});

export default styles;
