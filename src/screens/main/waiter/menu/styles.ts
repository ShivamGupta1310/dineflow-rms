import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { typography } from "@theme/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  safeAreaRtl: {
    direction: "rtl",
  },
  headerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(8),
  },
  headerContent: {
    minHeight: verticalScale(40),
  },
  headerAction: {
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    marginHorizontal: horizontalScale(20),
    gap: horizontalScale(20),
  },
  topViewContainer: {
    gap: horizontalScale(10),
  },
  contentContainer: {
    flex: 1,
    gap: horizontalScale(16),
  },
  floatingBtnContainer: {
    position: "absolute",
    bottom: verticalScale(32),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: horizontalScale(6),
    paddingEnd: horizontalScale(16),
    paddingStart: horizontalScale(6),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(68),
    gap: horizontalScale(14),
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: horizontalScale(8),
  },
  floatingCartIconContainer: {
    backgroundColor: colors.cartIconBg,
    borderRadius: horizontalScale(30),
    padding: horizontalScale(10),
    gap: horizontalScale(20),
  },
  itemCount: {
    ...typography.regular_16,
    color: colors.white,
  },
  searchInputContainer: {
    marginTop: verticalScale(12),
  },
  searchInputInner: {
    borderWidth: 0,
    backgroundColor: colors.white,
    paddingHorizontal: horizontalScale(14),
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(6),
  },
  toggleSwitch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
    marginEnd: horizontalScale(-6),
  },
  toggleLabel: {
    ...typography.semibold_16,
    color: colors.primaryText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...typography.regular_14,
    color: colors.grayDescText,
  },
});
