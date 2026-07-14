import React from "react";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
} from "react-native-confirmation-code-field";

import styles from "./OTPInput.styles";
import { RNText, RNView } from "@components";

interface OTPInputProps {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
  secureEntry?: boolean;
  isRTL?: boolean;
}

const OTPInput = ({
  value,
  onChangeText,
  length = 6,
  secureEntry = false,
  isRTL = false,
}: OTPInputProps) => {
  const ref = useBlurOnFulfill({
    value,
    cellCount: length,
  });

  return (
    <CodeField
      ref={ref}
      value={value}
      onChangeText={onChangeText}
      cellCount={length}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete="sms-otp"
      rootStyle={[styles.codeFieldRoot, isRTL && styles.codeFieldRootRtl]}
      autoFocus
      renderCell={({ index, symbol, isFocused }) => (
        <RNView
          key={index}
          style={[styles.cell, isFocused && styles.focusCell]}
        >
          <RNText style={styles.cellText}>
            {secureEntry && symbol
              ? "•"
              : symbol || (isFocused ? <Cursor /> : null)}
          </RNText>
        </RNView>
      )}
    />
  );
};

export default OTPInput;
