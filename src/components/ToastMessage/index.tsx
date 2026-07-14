import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ToastConfig, ToastConfigParams } from "react-native-toast-message";

const MultilineToast = ({
  text1,
  text2,
  onPress,
  text1Style,
  text2Style,
  borderColor,
}: ToastConfigParams<any> & { borderColor: string }) => {
  const title = typeof text1 === "string" ? text1 : String(text1 ?? "");
  const message = typeof text2 === "string" ? text2 : String(text2 ?? "");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.base, { borderLeftColor: borderColor }]}
    >
      <View style={styles.contentContainer}>
        {title.trim().length > 0 && (
          <Text
            style={[styles.text1, text1Style]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        )}
        {message.trim().length > 0 && (
          <Text
            style={[styles.text2, text2Style]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {message}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createToast = (borderColor: string) =>
  function ToastVariant(params: ToastConfigParams<any>) {
    return <MultilineToast {...params} borderColor={borderColor} />;
  };

export const toastConfig: ToastConfig = {
  success: createToast(colors.success),
  error: createToast(colors.primary),
  info: createToast(colors.darkGray),
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    width: "90%",
    minHeight: verticalScale(60),
    borderRadius: 6,
    borderLeftWidth: horizontalScale(5),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(12),
    justifyContent: "center",
    alignItems: "flex-start",
  },
  text1: {
    ...typography.bold_12,
    width: "100%",
    color: colors.black,
    lineHeight: 16,
  },
  text2: {
    ...typography.medium_10,
    width: "100%",
    marginTop: verticalScale(4),
    color: colors.secondaryText,
    lineHeight: 14,
  },
});
