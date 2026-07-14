import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionCard, AppHeader, RNText, RNView } from "@components";
import { SVGS } from "@assets";
import QRCode from "react-native-qrcode-svg";

import styles from "./styles";
import { useQRCodeAccess } from "./useQRCodeAccess";
import { moderateScale } from "@utils/scale/scale";

const QRCodeAccessScreen = () => {
  const { t, ownerAccessCode, handleScanQRCode, handleGoBack } =
    useQRCodeAccess();
  const { DishIcon, DineSetupLogo, QuotationMark } = SVGS;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader isLogo onGoBack={handleGoBack} />

        <RNView style={styles.container}>
          <RNText style={styles.description}>
            {t("auth.qrCodeAccess.description")}
          </RNText>
          {ownerAccessCode && (
            <RNView style={styles.qrContainer}>
              <RNView style={styles.qrMainContainer}>
                <QRCode value={ownerAccessCode} size={moderateScale(190)} />
              </RNView>
            </RNView>
          )}

          {ownerAccessCode && (
            <RNText style={styles.passcodeOR}>{t("auth.onBoarding.or")}</RNText>
          )}

          <ActionCard
            icon={<DishIcon />}
            title={t("auth.qrCodeAccess.accessCode")}
            subtitle={ownerAccessCode || ""}
            onPress={handleScanQRCode}
            rightContainer={<SVGS.CopyLogo />}
            titleStyle={styles.title}
            subtitleStyle={styles.subTitle}
            testID="owner-waiter-login-button"
            style={styles.actionCard}
          />

          <RNView style={styles.bottomSection}>
            <RNView style={styles.quoteSection}>
              <RNView style={styles.quoteMark}>
                <QuotationMark />
              </RNView>
              <RNText style={styles.quoteText}>
                {t("auth.qrCodeAccess.welcomeQuote")}
              </RNText>
            </RNView>

            <RNView style={styles.logoSection}>
              <DineSetupLogo
                width={moderateScale(157)}
                height={moderateScale(150)}
              />
            </RNView>
          </RNView>
        </RNView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRCodeAccessScreen;
