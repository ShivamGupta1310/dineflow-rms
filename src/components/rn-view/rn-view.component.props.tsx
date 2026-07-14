import {StyleProp, ViewStyle, ViewProps as RNViewProps} from 'react-native';

/**
 * Props for a reusable RNText component
 */
export interface ViewProps extends RNViewProps {
  /**
   * Children to render inside the Text component
   */
  children?: React.ReactNode;

  /**
   * Optional style to apply to the Text component
   */
  style?: StyleProp<ViewStyle>;
}
