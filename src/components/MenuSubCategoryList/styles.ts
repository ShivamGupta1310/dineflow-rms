import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { typography } from "@theme/theme";

export default StyleSheet.create({
  listContent: {
    gap: verticalScale(6),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: verticalScale(12),
    borderRadius: verticalScale(46),
    gap: verticalScale(6),
    backgroundColor: colors.white,
    borderWidth: moderateScale(1),
    borderColor: colors.transparent,
    boxShadow: `0px 0px 20px 0px ${colors.menuCardShadow}`,
  },
  selectedItemContainer: {
    borderColor: colors.primary,
  },
  title: {
    ...typography.regular_12,
    color: colors.primaryText,
    textAlign: "center",
    includeFontPadding: false,
  },
  itemIconWrap: {
    width: horizontalScale(20),
    height: horizontalScale(20),
    overflow: "hidden",
    borderRadius: horizontalScale(8),
  },
  centerIcon: {
    width: horizontalScale(20),
    height: horizontalScale(20),
    borderRadius: horizontalScale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
