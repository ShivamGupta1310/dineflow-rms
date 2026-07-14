import React, {
  useState,
  useContext,
  useMemo,
  useImperativeHandle,
} from "react";
import { TextInput } from "react-native";
import { t } from "i18next";
import { RNTextInputProps } from "./text-input.props";
import { RNText, RNView } from "@components";
import {
  GlobalContext,
  GlobalContextType,
} from "../../contexts/global.provider";
import { colors } from "@theme/colors";
import styles from "./text-input.styles";

export interface RNTextInputRef {
  validate: () => boolean;
}

export const RNTextInput = React.forwardRef<RNTextInputRef, RNTextInputProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      label,
      validation,
      error: externalError,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      onValidationChange,
      showError = true,
      maxLength = 50,
      keyboardType = "default",
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const contextData: GlobalContextType | null = useContext(GlobalContext);

    // Avoid conditional hook execution
    const isRTL = contextData?.isRTL ?? false;

    const validateInput = (inputValue: string): string | null => {
      if (validation?.required && !inputValue.trim()) {
        return externalError?.requiredError || "validation.required";
      }

      if (validation?.maxLength && inputValue.length > validation.maxLength) {
        return externalError?.maxLengthError || "validation.maxLength";
      }

      if (validation?.minLength && inputValue.length < validation.minLength) {
        return externalError?.minLengthError || "validation.minLength";
      }

      if (
        validation?.pattern &&
        inputValue &&
        !validation.pattern.test(inputValue)
      ) {
        return externalError?.patternError || "validation.invalidFormat";
      }

      return null;
    };

    /**
     * Expose validate method
     */
    useImperativeHandle(ref, () => ({
      validate: () => {
        const validationError = validateInput(value);

        setError(validationError);
        onValidationChange?.(validationError);

        return !validationError;
      },
    }));

    const handleChangeText = (text: string) => {
      onChangeText(text);

      if (validation) {
        const validationError = validateInput(text);

        setError(validationError);

        onValidationChange?.(validationError);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);

      const validationError = validateInput(value);

      setError(validationError);

      onValidationChange?.(validationError);
    };

    const inputBorderStyle = useMemo(() => {
      if (error) {
        return styles.inputError;
      }

      if (isFocused) {
        return styles.inputFocused;
      }

      return {};
    }, [error, isFocused]);

    return (
      <RNView style={[styles.container, containerStyle]}>
        {label && <RNText style={[styles.label, labelStyle]}>{label}</RNText>}

        <TextInput
          ref={null}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.placeHolder}
          maxLength={maxLength}
          keyboardType={keyboardType}
          style={[
            styles.input,
            inputBorderStyle,
            isRTL && styles.rtlInput,
            inputStyle,
          ]}
          {...rest}
        />

        {showError && error && (
          <RNText style={[styles.errorText, errorStyle]}>{t(error)}</RNText>
        )}
      </RNView>
    );
  },
);

export default RNTextInput;
