import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  horizontalScale,
  moderateScale,
  scaledSize,
  verticalScale,
} from "@utils/scale/scale";
import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdropColor,
  },
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: verticalScale(30),
    borderTopRightRadius: verticalScale(30),
    paddingHorizontal: horizontalScale(30),
    paddingTop: verticalScale(30),
    maxHeight: Dimensions.get("window").height * 0.85,
    paddingBottom: verticalScale(4),
  },

  title: {
    color: colors.lightBlack,
    ...typography.semibold_20,
  },

  billNumber: {
    color: colors.primaryText,
    ...typography.regular_16,
    textAlign: "right",
    width: "100%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(26),
  },

  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },

  radio: {
    width: verticalScale(18),
    height: horizontalScale(18),
    borderRadius: horizontalScale(18),
    borderWidth: 1,
    borderColor: colors.gray500,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(2),
    paddingVertical: verticalScale(2),
  },

  radioSelected: {
    borderColor: colors.primary,
  },
  selectedCircle: {
    backgroundColor: colors.primary,
    width: "100%",
    height: "100%",
    borderRadius: horizontalScale(18),
  },
  languageName: {
    ...typography.medium_14,
    color: colors.lightBlack,
    textAlign: "center",
  },
  applyBtn: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dividerColor,
  },
  bottomBtnContainer: {
    gap: verticalScale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: verticalScale(10),
  },
  readyToServeCount: {
    flexDirection: "row",
    marginBottom: verticalScale(26),
  },
  readyToServeText: {
    ...typography.regular_14,
    color: colors.primaryText,
    marginStart: horizontalScale(8),
  },
  itemsText: {
    ...typography.semibold_16,
    color: colors.primaryText,
    marginBottom: verticalScale(16),
  },
  itemsNameText: {
    ...typography.regular_16,
    color: colors.primaryText,
    marginBottom: verticalScale(12),
  },
  itemsQtyText: {
    ...typography.regular_12,
    color: colors.darkGray,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: horizontalScale(10),
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  itemListContentContainer: {
    gap: verticalScale(10),
  },
  itemMainView: {
    flex: 1,
  },
  itemStatusContainer: {
    minWidth: scaledSize(24),
    alignItems: "center",
    justifyContent: "center",
  },
  itemImageView: {
    width: scaledSize(46),
    height: scaledSize(46),
    borderRadius: scaledSize(6),
    overflow: "hidden",
    backgroundColor: colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextStyle: {
    ...typography.medium_14,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  emptyText: {
    ...typography.regular_14,
    color: colors.primaryText,
    textAlign: "center",
    paddingVertical: verticalScale(12),
  },
  itemFood: {
    backgroundColor: colors.lightPink,
    height: verticalScale(45),
    width: horizontalScale(45),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(5),
  },
  tableNumberContainer: {
    flex: 0.2,
  },
  orderNumberContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  statusActionButton: {
    minWidth: scaledSize(24),
    minHeight: scaledSize(24),
    alignItems: "center",
    justifyContent: "center",
  },
});
