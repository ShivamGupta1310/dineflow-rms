import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: horizontalScale(10),
    alignItems: "center",
  },
  itemImageView: {
    width: verticalScale(46),
    height: verticalScale(46),
    borderRadius: verticalScale(8),
    overflow: "hidden",
    backgroundColor: colors.lightPink,
    justifyContent: "center",
    alignItems: "center",
  },
  itemMainView: {
    flex: 1,
  },
  itemsNameText: {
    ...typography.medium_14,
    color: colors.primaryText,
  },
  itemDescText: {
    ...typography.regular_12,
    color: colors.descriptionText,
  },
  trailingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
