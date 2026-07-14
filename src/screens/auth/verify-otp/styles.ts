import { colors } from "@theme/colors";
import { fontScale, horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerRtl: {
    direction: "rtl",
  },
  title: {
    fontSize: fontScale(20),
    fontWeight: "600",
    color: colors.primaryText,
    textAlign: "center",
    lineHeight: horizontalScale(22),
  },
  description: {
    marginTop: verticalScale(16),
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: fontScale(14),
    lineHeight: horizontalScale(22),
  },
  mobileNumber: {
    fontWeight: "500",
    fontSize: fontScale(14),
    color: colors.secondaryText,
  },
  label: {
    marginTop: verticalScale(36),
    marginBottom: verticalScale(10),
    fontSize: fontScale(16),
    fontWeight: "500",
    color: colors.primaryText,
  },
  labelRtl: {
    textAlign: "right",
  },
  button: {
    height: verticalScale(56),
    borderRadius: horizontalScale(50),
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(16),
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: colors.primary,
  },
  waiterButton: {
    marginTop: verticalScale(24),
    minHeight: verticalScale(68),
    borderRadius: horizontalScale(24),
    backgroundColor: colors.lightPink,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
  },
  waiterIcon: {
    width: horizontalScale(44),
    height: horizontalScale(44),
    borderRadius: horizontalScale(22),
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: horizontalScale(12),
  },
  waiterIconRtl: {
    marginRight: 0,
    marginLeft: horizontalScale(12),
  },
  waiterIconText: {
    fontSize: fontScale(18),
  },
  waiterText: {
    flex: 1,
    fontSize: fontScale(15),
    color: colors.primaryText,
    fontWeight: "600",
  },
  waiterArrow: {
    fontSize: fontScale(28),
    color: colors.primaryText,
    marginLeft: horizontalScale(12),
    marginBottom: verticalScale(4),
  },
  continueButton: {
    marginTop: verticalScale(18),
  },
});
