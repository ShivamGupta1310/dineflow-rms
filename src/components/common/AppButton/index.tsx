import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from "react-native";

import styles from "./styles";
import { RNText, RNView } from "@components";
import { colors } from "@theme/colors";

type ButtonVariant = "primary" | "outlined";

interface AppButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  loadingText?: string; 
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  leftIcon?: React.ReactNode;
}

const AppButton = ({
  title,
  onPress,
  loading = false,
  loadingText = "",
  disabled = false,
  variant = "primary",
  style,
  textStyle,
  testID,
  leftIcon,
}: AppButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        variant === "outlined" ? styles.outlinedButton : styles.primaryButton,
        isDisabled && styles.disabledButton,
        style,
      ]}
      testID={testID}
    >
      {loading ? (
        <RNView style={styles.flexRow}>
          <ActivityIndicator
            color={variant === "outlined" ? colors.primary : colors.white}
          />
          {loadingText?.length > 0 && (
            <RNText numberOfLines={1} style={styles.loadingTextSpacing}>
              {loadingText}
            </RNText>
          )}
        </RNView>
      ) : (
        <RNView style={styles.contentContainer}>
          {leftIcon ? (
            <RNView style={styles.iconContainer}>{leftIcon}</RNView>
          ) : null}

          <RNText
            style={[
              styles.buttonText,
              variant === "outlined"
                ? styles.outlinedButtonText
                : styles.primaryButtonText,
              textStyle,
            ]}
          >
            {title}
          </RNText>
        </RNView>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
