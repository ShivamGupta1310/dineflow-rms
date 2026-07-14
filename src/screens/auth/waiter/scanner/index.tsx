import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import styles from "./styles";
import {
  AppButton,
  AppHeader,
  AppLoader,
  BarcodeScanner,
  RNText,
  RNTextInput,
  RNView,
} from "@components";
import { useScanner } from "./useScanner";
import { KeyboardBottomOffset } from "@utils/scale/scale";

const ScannerScreen = () => {
  const navigation = useNavigation<any>();
  const {
    t,
    passcode,
    isScanLoading,
    isButtonLoading,
    inputRef,
    handlePasscodeChange,
    barcodeScannerRef,
    handleVerify,
    handleScan,
  } = useScanner();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {isScanLoading ? <AppLoader /> : null}
        <KeyboardAwareScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          bottomOffset={KeyboardBottomOffset}
        >
          <AppHeader isLogo onGoBack={() => navigation.goBack()} />
          <RNView style={styles.container}>
            <RNText style={styles.description}>
              {t("auth.barcodeScanner.description")}
            </RNText>
            <View style={styles.barCodeContainer}>
              <BarcodeScanner ref={barcodeScannerRef} onScan={handleScan} />
              <RNText style={styles.passcodeOR}>
                {t("auth.onBoarding.or")}
              </RNText>
            </View>
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
              editable={!isScanLoading && !isButtonLoading}
              containerStyle={styles.textInputContainer}
            />
            <AppButton
              title={t("common.continue")}
              onPress={() => handleVerify(passcode, "button")}
              loading={isButtonLoading}
              disabled={isScanLoading}
              variant="outlined"
              style={styles.button}
              testID="scanner-continue-button"
            />
          </RNView>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ScannerScreen;
