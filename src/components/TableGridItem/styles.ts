import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { typography } from "@theme/theme";

export default StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(4),
    paddingHorizontal: verticalScale(4),
    backgroundColor: colors.white,
  },
  capacityContainer: {
    flexDirection: "row",
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
    alignItems: "center",
  },
  capacity: {
    ...typography.regular_14,
    color: colors.primaryText,
    marginStart: horizontalScale(2),
  },
  tableTimeContainer: {
    height: verticalScale(48),
    backgroundColor: colors.white,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: moderateScale(10),
  },
  tableNumber: {
    ...typography.medium_14,
    color: colors.primaryText,
  },
  time: {
    ...typography.semibold_12,
    color: colors.tableTimeText,
  },
});
