import {Platform} from "react-native";

export const FONTS = {
  SFProDisplayBold: Platform.select({
    ios: "SFProDisplay-Bold",
    android: "SF_Pro_Display_Bold",
  }),
  SFProDisplayMedium: Platform.select({
    ios: "SFProDisplay-Medium",
    android: "SF_Pro_Display_Medium",
  }),
  SFProDisplayRegular: Platform.select({
    ios: "SFProDisplay-Regular",
    android: "SF_Pro_Display_Regular",
  }),
  SFProDisplaySemibold: Platform.select({
    ios: "SFProDisplay-Semibold",
    android: "SF_Pro_Display_Semibold",
  }),
} as const;

export type FontType = keyof typeof FONTS;
