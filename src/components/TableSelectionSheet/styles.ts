import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
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
    paddingBottom: verticalScale(20),
  },
  title: {
    color: colors.lightBlack,
    ...typography.semibold_20,
    marginBottom: verticalScale(20),
  },
  listContentContainer: {
    paddingBottom: verticalScale(20),
  },
  columnWrapper: {
    marginBottom: verticalScale(10),
    justifyContent: "space-between",
  },
  columnWrapperRtl: {
    flexDirection: "row-reverse",
  },
  tableCard: {
    flex: 1,
    maxWidth: "31.33%",
    borderColor: colors.primary,
    borderWidth: 1,
  },
  bottomBox: {
    height: verticalScale(32),
    justifyContent: "center",
  },
  selectButton: {
    marginTop: verticalScale(10),
    width: "100%",
  },
  btnTextStyle: {
    ...typography.medium_14,
  },
  fixedHeightContainer: {
    height: verticalScale(350),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
});
