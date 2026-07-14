import React, { useMemo } from "react";
import {
  Pressable,
  View,
} from "react-native";

import { SVGS } from "@assets";
import {
  ActionCard,
  AppButton,
  AppLayout,
  AppTextInput,
  LanguageSheet,
  RNText,
  RNView,
} from "@components";
import { useOwnerLogin } from "./useOwnerLogin";
import { styles } from "./styles";

const { DineSetupLogo, IndiaFlag, TickedIcon, DishIcon } = SVGS;

const Login = () => {
  const {
    COUNTRY_CODE,
    isRTL,
    loading,
    mobileNumber,
    mobileErrorText,
    submitError,
    rememberMe,
    t,
    language,
    showLanguageSheet,
    handleMobileChange,
    handleContinue,
    toggleRememberMe,
    handleWaiterOnboarding,
    toggleLanguageSheet,
    onLanguageChipPress,
    handleLanguageApply,
  } = useOwnerLogin();

  const logo = useMemo(() => <DineSetupLogo />, []);

  return (
    <RNView style={styles.root}>
        <AppLayout
          title={t("common.dineflow")}
          subtitle={t("common.managementSubText")}
          logo={logo}
          language={language}
          onLanguagePress={onLanguageChipPress}
        >
          <RNView
            style={[
              styles.formContainer,
              isRTL && styles.formContainerRtl,
            ]}
          >
            <RNText style={styles.welcomeTitle}>
              {t("auth.login.welcomeTitle")}
            </RNText>
            <RNText style={styles.welcomeSubtitle}>
              {t("auth.login.welcomeSubtitle")}
            </RNText>

            <View style={styles.inputSection}>
              <AppTextInput
                label={t("auth.login.mobileLabel")}
                placeholder={t("auth.login.mobilePlaceholder")}
                keyboardType="number-pad"
                maxLength={10}
                value={mobileNumber}
                onChangeText={handleMobileChange}
                editable={!loading}
                error={mobileErrorText ?? undefined}
                leftAccessory={
                  <View style={styles.flagContainer}>
                    <IndiaFlag />
                  </View>
                }
                prefix={`+${COUNTRY_CODE}`}
                containerStyle={styles.mobileInputWrapper}
              />
            </View>

            <Pressable onPress={toggleRememberMe} style={[styles.rememberRow]}>
              <View
                style={[
                  styles.checkbox,
                  rememberMe && styles.checkboxChecked,
                  isRTL && styles.checkboxRtl,
                ]}
              >
                {rememberMe && <TickedIcon />}
              </View>
              <RNText style={styles.rememberText}>
                {t("auth.login.rememberMe")}
              </RNText>
            </Pressable>

            {!!submitError && (
              <RNText style={styles.submitError}>{submitError}</RNText>
            )}

            <AppButton
              title={t("auth.login.continue")}
              onPress={handleContinue}
              loading={loading}
              disabled={loading}
              variant="outlined"
              style={styles.continueButton}
              testID="owner-login-continue"
            />

            <ActionCard
              icon={<DishIcon />}
              title={t("auth.login.waiterLogin")}
              onPress={() => {
                handleWaiterOnboarding();
                // TODO: Navigate to waiter login flow
              }}
              testID="owner-waiter-login-button"
            />
          </RNView>
        </AppLayout>
      <LanguageSheet
        visible={showLanguageSheet}
        selectedLanguage={language}
        onClose={toggleLanguageSheet}
        onApply={handleLanguageApply}
      />
    </RNView>
  );
};

export default Login;
