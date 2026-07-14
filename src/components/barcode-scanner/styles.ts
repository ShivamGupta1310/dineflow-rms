import { colors } from "@theme/colors";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  frameContainer: {
    width: horizontalScale(260),
    height: verticalScale(260),
    alignItems: "center",
    justifyContent: "center",
  },
  scannerWrapper: {
    width: horizontalScale(250),
    height: horizontalScale(250),
    overflow: "hidden",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  torchContainer: {
    width: horizontalScale(60),
    height: verticalScale(60),
    borderRadius: horizontalScale(50),
    backgroundColor: colors.lightPink,
    justifyContent: "center",
    alignItems: "center",
  },
  torchWrapper: {
    marginTop: verticalScale(40),
    alignItems: "center",
  },
});

export default styles;
