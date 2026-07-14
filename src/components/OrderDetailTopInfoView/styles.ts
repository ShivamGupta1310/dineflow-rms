import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: verticalScale(30),
    marginTop: verticalScale(26),
  },
  headerCard: {
    alignItems: "center",
  },
  orderNoHeaderLabel: {
    ...typography.regular_16,
    color: colors.primaryText,
    marginBottom: verticalScale(6),
  },
  orderNoValue: {
    ...typography.semibold_20,
    color: colors.primaryText,
    textAlign: "center",
    width: "80%",
  },
  highlightedInfoContainer: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(10),
  },
  highlightedInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "40%",
  },
  highlightedInfoText: {
    ...typography.regular_14,
    color: colors.primaryText,
    marginStart: horizontalScale(6),
  },
  infoDivider: {
    width: 1,
    height: verticalScale(16),
    backgroundColor: colors.grayBorder,
    marginHorizontal: horizontalScale(16),
  },
});
