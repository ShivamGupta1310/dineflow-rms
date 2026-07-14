import React, { useEffect, useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t } from "i18next";

import { AppButton, RNText } from "@components";
import { LanguageLabel } from "@appTypes";
import { styles } from "./styles";
import { LANGUAGES } from "./languages";
import { scaledSize, verticalScale } from "@utils/scale/scale";

interface LanguageSheetProps {
  visible: boolean;
  selectedLanguage: LanguageLabel;
  onClose: (val: boolean) => void;
  onApply: (language: LanguageLabel) => void;
}

const LanguageSheet = ({
  visible,
  selectedLanguage,
  onClose,
  onApply,
}: LanguageSheetProps) => {
  const [language, setLanguage] = useState<LanguageLabel>(selectedLanguage);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setLanguage(selectedLanguage);
    }
  }, [visible, selectedLanguage]);

  const onCloseSheet = () => {
    onClose(false);
  };

  const handleApplyPress = () => {
    onApply(language);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCloseSheet}
      testID={"language-sheet"}
    >
      <Pressable style={styles.backdrop} onPress={onCloseSheet}>
        <Pressable
          style={[
            styles.container,
            { paddingBottom: (insets?.bottom || 0) + verticalScale(4) },
          ]}
        >
          <RNText style={styles.title}>
            {t("auth.language.changeLanguage")}
          </RNText>
          <View style={styles.languagesContainer}>
            {LANGUAGES.map((item, index) => {
              const isSelected = item.label === language;
              return (
                <View
                  style={styles.languagesContainer}
                  key={`langauge-item${index}`}
                >
                  <TouchableOpacity
                    style={styles.languageRow}
                    onPress={() => setLanguage(item.label)}
                    testID={`language-option-${item.label}`}
                  >
                    <View style={styles.languageInfo}>
                      <item.flag
                        width={scaledSize(30)}
                        height={scaledSize(30)}
                      />
                      <RNText style={styles.languageName}>{item.title}</RNText>
                    </View>

                    <View
                      style={[styles.radio, isSelected && styles.radioSelected]}
                    >
                      {isSelected && <View style={styles.selectedCircle} />}
                    </View>
                  </TouchableOpacity>
                  {index < LANGUAGES.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              );
            })}
          </View>

          <AppButton
            style={styles.applyBtn}
            title={t("auth.language.apply")}
            onPress={handleApplyPress}
            testID="language-apply-button"
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default LanguageSheet;
