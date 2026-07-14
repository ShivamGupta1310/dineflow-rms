import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: horizontalScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImageContainer: {
    width: horizontalScale(46),
    height: verticalScale(46),
    borderRadius: horizontalScale(23),
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    marginStart: horizontalScale(10),
    flexShrink: 1,
  },
  greetingText: {
    ...typography.semibold_16,
    color: colors.primaryText,
  },
  designationText: {
    ...typography.regular_14,
    color: colors.darkGray,
    marginTop: verticalScale(2),
  },
  headerRightContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
