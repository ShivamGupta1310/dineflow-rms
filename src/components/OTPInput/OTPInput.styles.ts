import { colors } from "@theme/colors";
import { fontScale, horizontalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  codeFieldRoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    direction: "ltr",
  },
  codeFieldRootRtl: {
    direction: "rtl",
  },
  cell: {
    width: horizontalScale(49),
    height: horizontalScale(50),
    borderWidth: 1,
    borderColor: colors.grayBorder,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  focusCell: {
    borderColor: colors.primary,
  },
  cellText: {
    fontSize: fontScale(14),
    fontWeight: "400",
    color: colors.primaryText,
  },
});

export default styles;
