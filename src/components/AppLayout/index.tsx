import React, { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { LanguageLabel } from "@appTypes";
import { SVGS } from "@assets";
import { RNText, RNView } from "@components";
import { KeyboardBottomOffset, scaledSize } from "@utils/scale/scale";
import styles from "./styles";

interface AppLayoutProps {
  title?: string;
  subtitle?: string;
  logo: ReactNode;
  children?: ReactNode;
  logoStyle?: object;
  titleLogo?: any;
  language?: LanguageLabel;
  onLanguagePress?: () => void;
}
const { UsFlag, ArFlag } = SVGS;

const AppLayout = ({
  title,
  subtitle,
  logo,
  children,
  logoStyle,
  titleLogo,
  language,
  onLanguagePress,
}: AppLayoutProps) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={KeyboardBottomOffset}
      >
        {language && (
          <RNView style={styles.chipView}>
            <Pressable
              style={styles.languageChip}
              onPress={onLanguagePress}
              testID="language-chip"
            >
              {language === "AR" ? (
                <ArFlag width={scaledSize(26)} height={scaledSize(26)} />
              ) : (
                <UsFlag width={scaledSize(26)} height={scaledSize(26)} />
              )}
              <RNText style={styles.languageText}>{language}</RNText>
            </Pressable>
          </RNView>
        )}
        <View style={styles.topContainer}>
          <View style={styles.mainContainer}>
            {titleLogo || <Text style={styles.title}>{title}</Text>}
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <View style={[logoStyle]}>{logo}</View>
        </View>
        <View style={styles.contentContainer}>{children}</View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AppLayout;
