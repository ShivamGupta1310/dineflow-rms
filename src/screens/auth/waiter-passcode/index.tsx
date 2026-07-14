import React from "react";
import { Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton, AppHeader, OTPInput, RNText, RNView } from "@components";
import { useWaiterPasscode } from "./useWaiterPasscode";
import styles from "./styles";
import { SVGS } from "@assets";

const { Waiterlogo } = SVGS;

const WaiterPasscode = () => {
  const navigation = useNavigation<any>();
  const {
    t,
    selectedWaiter,
    waiterName,
    passcode,
    setPasscode,
    isPasscodeValid,
    isRTL,
    loading,
    handleLogin,
  } = useWaiterPasscode();

  const avatarSource = selectedWaiter?.avatar
    ? { uri: selectedWaiter.avatar }
    : undefined;

  return (
    <SafeAreaView
      testID="waiter-passcode-container"
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <RNView style={styles.container}>
        <AppHeader onGoBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <View style={styles.profileSection}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <View style={styles.avatar} />
            )}
            <RNText style={styles.name}>
              {waiterName || t("waiter.waiterPasscode.defaultWaiter")}
            </RNText>
          </View>
          <RNText style={styles.label}>
            {t("waiter.waiterPasscode.enterPasscode")}
          </RNText>
          <OTPInput
            value={passcode}
            onChangeText={setPasscode}
            length={6}
            secureEntry={true}
            isRTL={isRTL}
          />
          <RNText style={styles.helper}>
            {t("waiter.waiterPasscode.passcodeDesc")}
          </RNText>
          <AppButton
            title={t("waiter.waiterPasscode.login")}
            onPress={handleLogin}
            disabled={!isPasscodeValid}
            loading={loading}
            variant="outlined"
            style={styles.button}
            testID="waiter-passcode-login"
          />
          <View style={styles.illustration}>
            <Waiterlogo />
          </View>
        </View>
      </RNView>
    </SafeAreaView>
  );
};

export default WaiterPasscode;
