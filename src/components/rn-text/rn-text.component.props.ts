import {StyleProp, TextStyle, TextProps as RNTextProps} from 'react-native';

/**
 * Props for a reusable RNText component
 */
export interface TextProps extends RNTextProps {
  /**
   * Children to render inside the Text component
   */
  children: React.ReactNode;

  /**
   * Optional style to apply to the Text component
   */
  style?: StyleProp<TextStyle>;

  /**
   * Text onpress method if you want to action perform on press of the text
   */
  onPress?: () => void;

  /** Max number of lines to display before truncating. */
  numberOfLines?: number;
}
