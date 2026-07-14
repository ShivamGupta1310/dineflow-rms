import { StyleSheet, StatusBar } from "react-native";

import { colors } from "@theme/colors";
import { isAndroid, typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  label: {
    marginBottom: verticalScale(10),
    ...typography.regular_14,
    color: colors.primaryText,
  },
  colorRed: {
    color: colors.error,
  },
  inputWrapper: {
    minHeight: verticalScale(46),
    borderRadius: horizontalScale(28),
    borderWidth: 1,
    borderColor: colors.grayBorder,
    backgroundColor: colors.white,
    position: "relative",
    justifyContent: "center",
  },
  iconLeftContainer: {
    position: "absolute",
    padding: horizontalScale(9),
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    start: 0,
    borderEndWidth: 1,
    borderEndColor: colors.grayBorder,
  },
  dropdown: {
    minHeight: verticalScale(42),
    backgroundColor: colors.white,
    paddingHorizontal: horizontalScale(16),
    borderRadius: horizontalScale(50),
  },
  dropdownBaseDirection: {
    direction: "ltr",
  },
  ltrLayout: {
    flexDirection: "row",
    alignItems: "center",
  },
  rtlLayout: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  dropdownContainer: {
    maxHeight: verticalScale(240),
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: colors.grayBorder,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  modalExtraStyles: {
    marginTop: -(isAndroid ? (StatusBar.currentHeight ?? 0) + 2 : 2),
    marginBottom: isAndroid ? (StatusBar.currentHeight ?? 0) + 2 : 2,
  },
  selectedText: {
    ...typography.regular_14,
    color: colors.primaryText,
  },
  flex1Text: {
    flex: 1,
  },
  ltrText: {
    textAlign: "left",
    writingDirection: "ltr",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  disableSelectedText: {
    ...typography.regular_14,
    color: colors.placeHolder,
  },
  placeholderText: {
    ...typography.regular_14,
    color: colors.placeHolder,
  },
  itemText: {
    ...typography.regular_14,
    color: colors.secondaryText,
  },
  selectedItemContainer: {
    backgroundColor: colors.lightPink,
  },
  singleItemRow: {
    minHeight: verticalScale(40),
    paddingHorizontal: horizontalScale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  singleItemRowRtl: {
    flexDirection: "row-reverse",
  },
  iconStyle: {
    marginStart: horizontalScale(9),
  },
  rotatedIcon: {
    transform: [{ rotate: "180deg" }],
  },
  itemContainer: {
    backgroundColor: colors.white,
  },
  tickIcon: {
    marginStart: horizontalScale(12),
  },
  tickIconRtl: {
    marginStart: 0,
    marginEnd: horizontalScale(12),
  },
  iconStyleRtl: {
    marginStart: 0,
    marginEnd: horizontalScale(9),
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayBorder,
  },
  errorText: {
    marginTop: verticalScale(8),
    ...typography.regular_12,
    color: colors.error,
  },
  checkBoxMultiple: {
    borderWidth: 1,
    borderColor: colors.primary,
    width: horizontalScale(18),
    height: horizontalScale(18),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: horizontalScale(3),
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  multipleCheckBoxContainer: {
    flexDirection: "row",
    padding: horizontalScale(12),
    alignItems: "center",
  },
  multipleCheckBoxContainerRtl: {
    flexDirection: "row-reverse",
  },
  multipleItemText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    marginStart: horizontalScale(8),
    lineHeight: verticalScale(18),
  },
  multipleItemTextRtl: {
    marginStart: 0,
    marginEnd: horizontalScale(8),
    textAlign: "right",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    textAlign: "center",
  },
});

export default styles;
