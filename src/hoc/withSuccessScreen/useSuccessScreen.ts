import { useCallback, useState } from "react";
import { StyleProp, TextStyle } from "react-native";

export interface SuccessScreenProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  isSuccessIconVisible?: boolean;
  onPress?: () => void;
}

export interface SuccessScreenController {
  showSuccessScreen: (props: SuccessScreenProps) => void;
  hideSuccessScreen: () => void;
}

export const useSuccessScreen = () => {
  const [successScreenProps, setSuccessScreenProps] =
    useState<SuccessScreenProps | null>(null);

  const hideSuccessScreen = useCallback(() => {
    setSuccessScreenProps(null);
  }, []);

  const showSuccessScreen = useCallback(
    (nextSuccessScreenProps: SuccessScreenProps) => {
      setSuccessScreenProps(nextSuccessScreenProps);
    },
    [],
  );

  const handleContinue = useCallback(() => {
    const nextAction = successScreenProps?.onPress;

    setSuccessScreenProps(null);
    nextAction?.();
  }, [successScreenProps]);

  return {
    successScreenProps,
    isVisible: Boolean(successScreenProps),
    showSuccessScreen,
    hideSuccessScreen,
    handleContinue,
  };
};
