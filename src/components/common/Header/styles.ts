import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";

const ACTION_SIZE = horizontalScale(40);

export default StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.transparent,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: verticalScale(40),
    paddingVertical: verticalScale(8),
  },
  leftContainer: {
    flexShrink: 0,
    marginEnd: horizontalScale(12),
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
  titleContainerCenter: {
    alignItems: "center",
  },
  titleContainerRight: {
    alignItems: "flex-end",
  },
  textBlock: {
    minWidth: 0,
  },
  title: {
    ...typography.semibold_20,
    color: colors.primaryText,
    includeFontPadding: false,
  },
  titleLeft: {
    textAlign: "left",
  },
  titleCenter: {
    textAlign: "center",
  },
  titleRight: {
    textAlign: "right",
  },
  subtitle: {
    ...typography.regular_12,
    color: colors.secondaryText,
    marginTop: verticalScale(2),
    includeFontPadding: false,
  },
  subtitleLeft: {
    textAlign: "left",
  },
  subtitleCenter: {
    textAlign: "center",
  },
  subtitleRight: {
    textAlign: "right",
  },
  rightContainer: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    marginStart: horizontalScale(12),
  },
  actionButton: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    backgroundColor: colors.appBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionSpacing: {
    marginStart: horizontalScale(8),
  },
  actionIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  childrenContainer: {
    width: "100%",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.grayBorder,
  },
   iconRtl: {
    transform: [{ rotate: "180deg" }],
  },
});
