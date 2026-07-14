import { useCallback, useState } from "react";
import { StyleProp, TextStyle } from "react-native";

export interface CustomAlertProps {
  title: string;
  subtitle: string;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  onOk?: () => void;
  onCancel?: () => void;
}

export interface CustomAlertController {
  showAlert: (props: CustomAlertProps) => void;
  hideAlert: () => void;
}

export const useCustomAlert = () => {
  const [alertProps, setAlertProps] = useState<CustomAlertProps | null>(null);

  const hideAlert = useCallback(() => {
    setAlertProps(null);
  }, []);

  const showAlert = useCallback((nextAlertProps: CustomAlertProps) => {
    setAlertProps(nextAlertProps);
  }, []);

  const handleCancel = useCallback(() => {
    const cancelAction = alertProps?.onCancel;

    setAlertProps(null);
    cancelAction?.();
  }, [alertProps]);

  const handleOk = useCallback(() => {
    const okAction = alertProps?.onOk;

    setAlertProps(null);
    okAction?.();
  }, [alertProps]);

  return {
    alertProps,
    isVisible: Boolean(alertProps),
    showAlert,
    hideAlert,
    handleCancel,
    handleOk,
  };
};
