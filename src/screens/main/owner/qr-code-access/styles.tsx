import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { typography } from "@theme/theme";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(24),
  },
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
  },
  description: {
    marginTop: verticalScale(26),
    ...typography.regular_14,
    textAlign: "center",
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(50),
  },
  passcodeOR: {
    marginTop: verticalScale(36),
    textAlign: "center",
    color: colors.neutral600,
    ...typography.regular_14,
  },
  qrMainContainer: {
    height: moderateScale(190),
    overflow: "hidden",
    width: moderateScale(190),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCard: {
    marginTop: verticalScale(36),
  },
  bottomSection: {
    marginTop: verticalScale(70),
  },
  quoteSection: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  quoteMark: {
    position: "absolute",
  },
  quoteText: {
    textAlign: "center",
    color: colors.primaryText,
    ...typography.regular_16,
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(18),
  },
  subTitle: {
    flex: 1,
    marginTop: verticalScale(8),
    ...typography.medium_14,
  },
  title: {
    flex: 1,
    color: colors.mediumGray,
    ...typography.regular_12,
  },
});

export default styles;
