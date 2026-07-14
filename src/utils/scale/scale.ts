import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Standard screen sizes
const SCREEN_HEIGHT = 874;
const SCREEN_WIDTH = 402;

const horizontalScale = (size: number) => (width / SCREEN_WIDTH) * size;
const verticalScale = (size: number) => (height / SCREEN_HEIGHT) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;
const fontScale = (size: number, factor: number = 0.2): number => {
  return PixelRatio.roundToNearestPixel(moderateScale(size, factor));
};
const KeyboardBottomOffset = Platform.OS === "ios" ? moderateScale(20) : -moderateScale(28);

export {
  width as SCREEN_WIDTH,
  height as SCREEN_HEIGHT,
  horizontalScale,
  verticalScale,
  moderateScale,
  fontScale,
  moderateScale as scaledSize,
  KeyboardBottomOffset,
};
