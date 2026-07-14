import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
  },
  profileSection: {
    alignItems: "center",
    marginTop: verticalScale(-19),
  },
  avatar: {
    width: horizontalScale(100),
    height: horizontalScale(100),
    borderRadius: horizontalScale(72),
    backgroundColor: colors.appBackground,
  },
  name: {
    ...typography.medium_20,
    marginTop: verticalScale(20),
    color: colors.primaryText,
    textAlign: "center",
  },
  label: {
    ...typography.medium_16,
    marginTop: verticalScale(40),
    marginBottom: verticalScale(10),
    color: colors.primaryText,
  },
  helper: {
    ...typography.regular_14,
    marginTop: verticalScale(10),
    color: colors.grayDescText,
  },
  button: {
    marginTop: verticalScale(16),
  },
  illustration: {
    marginTop: "auto",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
