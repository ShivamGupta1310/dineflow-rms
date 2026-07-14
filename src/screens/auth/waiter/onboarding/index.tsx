import React from "react";
import styles from "./styles";
import { useOnBoarding } from "./useOnBoarding";
import { SVGS } from "@assets";
import { ActionCard, AppButton, AppLayout, RNText, RNTextInput, RNView } from "@components";

interface OnBoardingScreenProps {}

const OnBoardingScreen = ({}: OnBoardingScreenProps) => {
  const {
    t,
    passcode,
    loading,
    inputRef,
    handlePasscodeChange,
    handleVerify,
    handleScanQRCode,
  } = useOnBoarding();

  return (
    <RNView style={styles.container}>
        <AppLayout
          titleLogo={<SVGS.DineLogo />}
          subtitle={t("common.managementSubText")}
          logo={<SVGS.Waiterlogo />}
          logoStyle={styles.logo}
        >
          <RNText style={styles.title}>{t("auth.onBoarding.title")}</RNText>
          <RNText style={styles.description}>
            {t("auth.onBoarding.subtitle")}
          </RNText>

          <ActionCard
            icon={<SVGS.QRCodeLogo width={20} height={20} />}
            title={t("auth.onBoarding.scanQRCode")}
            subtitle={t("auth.onBoarding.scanDescription")}
            onPress={handleScanQRCode}
            testID="owner-waiter-login-button"
          />

          <RNText style={styles.passcodeOR}>{t("auth.onBoarding.or")}</RNText>
          <RNTextInput
            ref={inputRef}
            label={t("auth.onBoarding.label")}
            value={passcode}
            onChangeText={handlePasscodeChange}
            placeholder={t("auth.onBoarding.passcodeLabel")}
            error={{
              requiredError: t("auth.validation.accesscodeRequired"),
            }}
            showError={true}
            validation={{
              required: true,
            }}
            editable={!loading}
            containerStyle={styles.textInputContainer}
          />

          <AppButton
            title={t("common.continue")}
            onPress={handleVerify}
            loading={loading}
            variant="outlined"
            style={styles.continueButton}
            testID="owner-login-continue"
          />
        </AppLayout>
    </RNView>
  );
};

export default OnBoardingScreen;
