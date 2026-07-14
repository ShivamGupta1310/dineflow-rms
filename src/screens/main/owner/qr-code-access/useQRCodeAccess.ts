import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Clipboard from "@react-native-clipboard/clipboard";
import { OwnerStackNavigationProp } from "@navigation/types";
import { showToast } from "@utils/toastHelper";
import { getItem } from "@utils/storage";
import { StorageKeys } from "@utils/constants";

export const useQRCodeAccess = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<OwnerStackNavigationProp>();
  const ownerAccessCode = String(getItem(StorageKeys.OWNER_ACCESS_CODE) ?? "");

  const handleScanQRCode = useCallback(async () => {
    try {
      Clipboard.setString(ownerAccessCode);
      showToast("success", t("auth.qrCodeAccess.accessCodeCopied"));
    } catch (error) {
      console.error(error);
      showToast("error", t("auth.qrCodeAccess.errorAccessCodeCopied"));
    }
  }, [ownerAccessCode, t]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    t,
    ownerAccessCode,
    handleScanQRCode,
    handleGoBack,
  };
};
