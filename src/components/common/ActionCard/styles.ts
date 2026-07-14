import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { fontScale, horizontalScale, verticalScale } from "@utils/scale/scale";
import { typography } from "@theme/theme";

const styles = StyleSheet.create({
  button: {
    marginTop: verticalScale(36),
    minHeight: verticalScale(68),
    borderRadius: horizontalScale(50),
    backgroundColor: colors.lightPink,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(10),
  },
  buttonRtl: {
    flexDirection: "row-reverse",
  },
  iconContainer: {
    flex: 0.2,
    width: horizontalScale(50),
    height: horizontalScale(50),
    borderRadius: horizontalScale(40),
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: horizontalScale(12),
  },
  titleConatiner: {
    flexDirection: "row",
    flex: 0.9,
  },
  iconConatiner: { flex: 0.1 },
  iconContainerRtl: {
    marginEnd: 0,
    marginStart: horizontalScale(12),
  },
  title: {
    ...typography.medium_14,
    color: colors.primaryText,
    flex: 1,
  },
  subtitle: {
    flex: 1,
    fontSize: fontScale(12),
    color: colors.mediumGray,
    marginTop: verticalScale(5),
  },
  arrow: {
    fontSize: fontScale(28),
    color: colors.primaryText,
    marginStart: horizontalScale(12),
    marginBottom: verticalScale(4),
    marginTop: verticalScale(4),
  },
  arrowRtl: { transform: [{ rotate: "180deg" }] },
  titleConatinerRtl: {
    flexDirection: "row-reverse",
  },
});

export default styles;
