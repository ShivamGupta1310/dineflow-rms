import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdropColor,
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: verticalScale(30),
    borderTopRightRadius: verticalScale(30),
    paddingHorizontal: horizontalScale(30),
    paddingTop: verticalScale(30),
  },

  title: {
    marginBottom: verticalScale(26),
    color: colors.lightBlack,
    ...typography.medium_20,
    textAlign: "left",
  },

  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginTop: verticalScale(26),
  },
  divider: {
    height: 1,
    backgroundColor: colors.dividerColor,
  },
  languagesContainer: {
    gap: verticalScale(10),
  },
});
