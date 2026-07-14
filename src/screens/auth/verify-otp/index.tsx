import React from "react";

import styles from "./styles";
import {
  ActionCard,
  AppButton,
  AppLayout,
  OTPInput,
  RNText,
  RNView,
} from "@components";
import { SVGS } from "@assets";
import useVerifyOtp from "./useVerifyOtp";

const { DineSetupLogo, DishIcon } = SVGS;

const OTPVerification = () => {
  const {
    t,
    otp,
    setOtp,
    isOtpValid,
    handleVerify,
    loading,
    isRTL,
    phoneNumber,
    countryCode,
    handleWaiterOnboarding,
  } = useVerifyOtp();

  const formattedPhoneNumber = phoneNumber
    ? `+${countryCode ?? ""} ${phoneNumber}`.trim()
    : "";

  return (
    <RNView style={styles.container}>
        <AppLayout
          title={t("common.dineflow")}
          subtitle={t("common.managementSubText")}
          logo={<DineSetupLogo />}
        >
          <RNText style={styles.title}>{t("auth.verifyOtp.title")}</RNText>
          <RNText style={styles.description}>
            {t("auth.verifyOtp.subtitle")}
            {formattedPhoneNumber && (
              <RNText style={styles.mobileNumber}>
                {" "}
                {formattedPhoneNumber}
              </RNText>
            )}
          </RNText>
          <RNText style={[styles.label, isRTL && styles.labelRtl]}>
            {t("auth.verifyOtp.enterOtpLabel")}
          </RNText>
          <OTPInput
            value={otp}
            onChangeText={setOtp}
            length={6}
            secureEntry={false}
            isRTL={isRTL}
          />
          <AppButton
            title={t("auth.verifyOtp.verifyButton")}
            onPress={handleVerify}
            loading={loading}
            disabled={!isOtpValid}
            variant="outlined"
            style={[
              styles.continueButton,
              !isOtpValid && styles.disabledButton,
            ]}
            testID="owner-login-continue"
          />

          <ActionCard
            icon={<DishIcon />}
            title={t("auth.login.waiterLogin")}
            onPress={() => {
              handleWaiterOnboarding();
            }}
            testID="owner-waiter-login-button"
          />
        </AppLayout>
    </RNView>
  );
};

export default OTPVerification;
