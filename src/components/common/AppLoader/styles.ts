import { colors } from "@theme/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.transparentBlack,
    zIndex: 999,
  },
});

export default styles;
