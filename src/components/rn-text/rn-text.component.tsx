import React, {useContext} from 'react';
import {StyleSheet, Text} from 'react-native';
import {TextProps} from './rn-text.component.props';
import {GlobalContext, GlobalContextType} from '../../contexts/global.provider';

const styles = StyleSheet.create({
  rtlTextAlign: {
    textAlign: 'left',
  },
  noFontPadding: {
    includeFontPadding: false,
  },
});

export const RNText = ({children, style, ...rest}: TextProps) => {
  const contextData: GlobalContextType | null = useContext(GlobalContext);
  if (!contextData) return;
  const {isRTL} = contextData;
  const styleArray = Array.isArray(style) ? style : [style];
  const hasTextAlign = styleArray.some(
    s => s && typeof s === 'object' && 'textAlign' in s,
  );

  return (
    <Text
      {...rest}
      allowFontScaling={false}
      style={[
        style,
        !hasTextAlign && isRTL ? styles.rtlTextAlign : null,
        styles.noFontPadding,
      ]}>
      {children}
    </Text>
  );
};
