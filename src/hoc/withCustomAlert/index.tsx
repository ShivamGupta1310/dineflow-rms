import React from "react";
import { Modal, Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";

import { styles } from "./styles";
import { CustomAlertController, useCustomAlert } from "./useCustomAlert";
import { RNView } from "@components";

const withCustomAlert = <P extends object>(
  WrappedComponent: React.ComponentType<P & CustomAlertController>,
) => {
  const ComponentWithCustomAlert = (props: P) => {
    const { t } = useTranslation();
    const {
      alertProps,
      isVisible,
      showAlert,
      hideAlert,
      handleCancel,
      handleOk,
    } = useCustomAlert();

    return (
      <>
        <WrappedComponent
          {...props}
          showAlert={showAlert}
          hideAlert={hideAlert}
        />

        <Modal
          animationType="fade"
          transparent
          statusBarTranslucent
          presentationStyle="overFullScreen"
          visible={isVisible}
          onRequestClose={handleCancel}
        >
          <RNView style={styles.overlay}>
            <RNView style={styles.alertCard}>
              <RNView style={[styles.titleContainer, styles.divider]}>
                <Text style={[styles.title, alertProps?.titleStyle]}>
                  {alertProps?.title}
                </Text>
              </RNView>
              <RNView style={[styles.subtitleContainer, styles.divider]}>
                <Text style={[styles.subtitle, alertProps?.subtitleStyle]}>
                  {alertProps?.subtitle}
                </Text>
              </RNView>
              <RNView style={styles.actionRow}>
                <Pressable
                  onPress={handleCancel}
                  style={styles.actionButton}
                  testID="custom-alert-cancel"
                >
                  <Text style={styles.cancelText}>{t("common.no")}</Text>
                </Pressable>
                <Pressable
                  onPress={handleOk}
                  style={styles.actionButton}
                  testID="custom-alert-ok"
                >
                  <Text style={styles.okText}>{t("common.yes")}</Text>
                </Pressable>
              </RNView>
            </RNView>
          </RNView>
        </Modal>
      </>
    );
  };

  return ComponentWithCustomAlert;
};

export type { CustomAlertController, CustomAlertProps } from "./useCustomAlert";
export default withCustomAlert;
