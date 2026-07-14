import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

export interface ValidationConfig {
  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Regex pattern to validate input
   */
  pattern?: RegExp;

  /**
   * Maximum length of input
   */
  maxLength?: number;

  /**
   * Minimum length of input
   */
  minLength?: number;

  /**
   * Custom validation function
   */
  customValidator?: (value: string) => boolean;
}

/**
 * Props for RNTextInput component
 */
export interface RNTextInputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Current input value
   */
  value: string;

  /**
   * Callback when input value changes
   */
  onChangeText: (value: string) => void;

  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  /**
   * Label text displayed above the input
   */
  label?: string;

  /**
   * Validation configuration
   */
  validation?: ValidationConfig;

  /**
   * Error message to display
   */
  error?: {
  requiredError?: string;
  minLengthError?: string;
  maxLengthError?: string;
  patternError?: string;
  customError?: string;
};

  /**
   * Optional style to apply to the container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Optional style to apply to the input
   */
  inputStyle?: StyleProp<TextInputStyle>;

  /**
   * Optional style to apply to label
   */
  labelStyle?: StyleProp<TextStyle>;

  /**
   * Optional style to apply to error text
   */
  errorStyle?: StyleProp<TextStyle>;

  /**
   * Callback to validate and return error message
   */
  onValidationChange?: (error: string | null) => void;

  /**
   * Whether to show error message
   */
  showError?: boolean;
}

export type TextInputStyle = TextStyle;
