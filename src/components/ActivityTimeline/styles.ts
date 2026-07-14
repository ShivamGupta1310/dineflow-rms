import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  horizontalScale,
  verticalScale,
} from "@utils/scale/scale";
import { StyleSheet } from "react-native";

const DOT_SIZE = horizontalScale(8);

export default StyleSheet.create({
  container: {
    marginTop: verticalScale(12),
  },
  itemRow: {
    flexDirection: "row",
  },
  itemRowRtl: {
    flexDirection: "row-reverse",
  },
  railMainContainer: {
    alignItems: "center",
  },
  railContainer: {
    marginRight: horizontalScale(10),
  },
  railContainerRtl: {
    marginLeft: horizontalScale(10),
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primary,
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    marginTop: verticalScale(-4)
  },
  contentSpace: {
    paddingBottom: verticalScale(24),
  },
  activityTitle: {
    ...typography.regular_14,
    color: colors.primaryText,
  },
  activitySubtitle: {
    ...typography.regular_12,
    color: colors.mediumGray,
    marginTop: verticalScale(10),
  },
  textRight: {
    textAlign: "right",
  },
});
