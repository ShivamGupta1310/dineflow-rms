import React from "react";
import { Modal, Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";

import { SVGS } from "@assets";
import { styles } from "./styles";
import { SuccessScreenController, useSuccessScreen } from "./useSuccessScreen";
import { RNView } from "@components";

const withSuccessScreen = <P extends object>(
  WrappedComponent: React.ComponentType<P & SuccessScreenController>,
) => {
  const ComponentWithSuccessScreen = (props: P) => {
    const { t } = useTranslation();
    const {
      successScreenProps,
      isVisible,
      showSuccessScreen,
      hideSuccessScreen,
      handleContinue,
    } = useSuccessScreen();
    return (
      <>
        <WrappedComponent
          {...props}
          showSuccessScreen={showSuccessScreen}
          hideSuccessScreen={hideSuccessScreen}
        />

        <Modal
          animationType="fade"
          transparent
          statusBarTranslucent
          presentationStyle="overFullScreen"
          visible={isVisible}
          onRequestClose={hideSuccessScreen}
        >
          <RNView style={styles.overlay}>
            <RNView style={styles.alertCard}>
              <RNView style={[styles.titleContainer, styles.divider]}>
                <Text style={[styles.title, successScreenProps?.titleStyle]}>
                  {successScreenProps?.title}
                </Text>
              </RNView>

              <RNView
                style={[
                  styles.titleContainer,
                  styles.subtitleContainer,
                  styles.divider,
                ]}
              >
                {(successScreenProps?.isSuccessIconVisible ?? true) && (
                  <SVGS.SuccessConfirmIcons />
                )}
                <Text
                  style={[styles.subtitle, successScreenProps?.subtitleStyle]}
                >
                  {successScreenProps?.subtitle}
                </Text>
              </RNView>

              <Pressable
                style={styles.actionButton}
                onPress={handleContinue}
                testID="success-screen-done"
              >
                <Text style={styles.okText}>
                  {successScreenProps?.buttonText ?? t("common.done")}
                </Text>
              </Pressable>
            </RNView>
          </RNView>
        </Modal>
      </>
    );
  };

  return ComponentWithSuccessScreen;
};

export type {
  SuccessScreenController,
  SuccessScreenProps,
} from "./useSuccessScreen";
export default withSuccessScreen;
