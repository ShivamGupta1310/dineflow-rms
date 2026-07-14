import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contentContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  contentContainerRtl: {
    flexDirection: "row-reverse",
  },
  tabButton: {
    height: verticalScale(34),
    paddingHorizontal: horizontalScale(14),
    borderRadius: 46,
    marginEnd: horizontalScale(6),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  tabButtonRtl: {
    direction: "rtl",
  },
  tabText: {
    ...typography.regular_14,
    fontWeight: "400",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowRtl: {
    flexDirection: "row-reverse",
  },
  dot: {
    width: horizontalScale(8),
    height: horizontalScale(8),
    borderRadius: horizontalScale(4),
    marginRight: horizontalScale(6),
  },
  dotRtl: {
    direction: "rtl",
  },
});
