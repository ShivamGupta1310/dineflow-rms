import { ThemeTypography, ThemeSpacing } from "@theme/types";
import { fontScale, scaledSize } from "@utils/scale/scale";
import { FONTS } from "@theme/fonts";
import { Platform } from "react-native";

export const typography: ThemeTypography = {
  semibold_36: {
    fontSize: fontScale(36),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  h1: {
    fontSize: fontScale(28),
    fontFamily: FONTS.SFProDisplayBold,
  },
  h2: {
    fontSize: fontScale(24),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  h3: {
    fontSize: fontScale(20),
    fontFamily: FONTS.SFProDisplayMedium,
  },
  semibold_20: {
    fontSize: fontScale(20),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  semibold_18: {
    fontSize: fontScale(18),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  medium_16: {
    fontSize: fontScale(16),
    fontFamily: FONTS.SFProDisplayMedium,
  },
  semibold_16: {
    fontSize: fontScale(16),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  regular_14: {
    fontSize: fontScale(14),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  medium_14: {
    fontSize: fontScale(14),
    fontFamily: FONTS.SFProDisplayMedium,
  },
  regular_12: {
    fontSize: fontScale(12),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  regular_16: {
    fontSize: fontScale(16),
    fontFamily: FONTS.SFProDisplayRegular,
  },
  medium_20: {
    fontSize: fontScale(20),
    fontFamily: FONTS.SFProDisplayMedium,
  },
  bold_12: {
    fontSize: fontScale(12),
    fontFamily: FONTS.SFProDisplayBold,
  },
  medium_10: {
    fontSize: fontScale(10),
    fontFamily: FONTS.SFProDisplayMedium,
  },
  semibold_12: {
    fontSize: fontScale(12),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  semibold_26: {
    fontSize: fontScale(26),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
  medium_12: {
    fontSize: fontScale(12),
    fontFamily: FONTS.SFProDisplayMedium,
  },
  semibold_10: {
    fontSize: fontScale(10),
    fontFamily: FONTS.SFProDisplaySemibold,
  },
};

export const spacing: ThemeSpacing = {
  xs: scaledSize(4),
  s: scaledSize(8),
  m: scaledSize(16),
  l: scaledSize(24),
  xl: scaledSize(32),
};

// Platform flags
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
