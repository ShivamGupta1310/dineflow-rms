import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  listContentContainer: {},
  dateContainer: {
    width: horizontalScale(47),
    height: verticalScale(70),
    borderRadius: 42,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(5),
  },
  selectedDateContainer: {
    backgroundColor: colors.primary,
  },
  dayText: {
    ...typography.regular_12,
    color: colors.dateDayText,
    marginBottom: verticalScale(8),
  },
  dateText: {
    ...typography.medium_16,
    color: colors.dateDayText,
  },
  selectedText: {
    color: colors.white,
  },
});
