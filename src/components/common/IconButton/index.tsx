import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from "react-native";

import styles from "./styles";
import { colors } from "@theme/colors";
import { moderateScale } from "@utils/scale/scale";

interface IconButtonProps {
  icon: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  size?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  backgroundColor = colors.white,
  size = moderateScale(40),
  disabled = false,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default IconButton;
