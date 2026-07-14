import { StyleSheet } from "react-native";

import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { typography } from "@theme/theme";
import { colors } from "@theme/colors";

const styles = StyleSheet.create({
  addButton: {
    width: verticalScale(24),
    height: verticalScale(24),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: verticalScale(40),
    backgroundColor: colors.primary,
  },
  quantityContainer: {
    height: verticalScale(24),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: verticalScale(10),
    paddingVertical: horizontalScale(4),
    paddingHorizontal: horizontalScale(8),
    gap: horizontalScale(10),
  },
  quantity: {
    ...typography.regular_14,
    color: colors.white,
    textAlign: "center",
    minWidth: horizontalScale(16),
    includeFontPadding: false,
  },
});

export default styles;
