import React, { useContext } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

import styles from "./styles";
import { RNText, RNView } from "@components";
import { colors } from "@theme/colors";
import { GlobalContext } from "../../../contexts/global.provider";

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  leftAccessory?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  prefixContainerStyle?: StyleProp<TextStyle>;
  placeholderColor?: string
}

const AppTextInput = ({
  label,
  error,
  prefix,
  leftAccessory,
  rightIcon,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  editable = true,
  placeholderColor,
  ...rest
}: AppTextInputProps) => {
  const contextData = useContext(GlobalContext);
  const isRTL = contextData?.isRTL ?? false;

  return (
    <RNView style={[styles.wrapper, containerStyle]}>
      {!!label && <RNText style={styles.label}>{label}</RNText>}
      <RNView
        style={[
          styles.inputContainer,
          !!error && styles.inputContainerError,
          !editable && styles.disabledInput,
          inputContainerStyle,
        ]}
      >
        {!!leftAccessory && <RNView style={styles.leftAccessory}>{leftAccessory}</RNView>}
        {!!prefix && (
          <RNView style={styles.prefixContainer}>
            <RNText style={styles.prefixText}>{prefix}</RNText>
          </RNView>
        )}
        <TextInput
          {...rest}
          editable={editable}
          placeholderTextColor={placeholderColor || colors.placeHolder}
          style={[
            styles.input,
            isRTL && styles.alignRight,
            inputStyle,
          ]}
        />
        {!!rightIcon && <RNView style={styles.rightAccessory}>{rightIcon}</RNView>}
      </RNView>
      {!!error && <RNText style={styles.errorText}>{error}</RNText>}
    </RNView>
  );
};

export default AppTextInput;
