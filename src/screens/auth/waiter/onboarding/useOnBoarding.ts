import { RNTextInputRef } from "@components";
import { useCameraPermission } from "@components/barcode-scanner/useCameraPermission";
import { ROUTES } from "@constants/routes";
import { useNavigation } from "@react-navigation/native";
import { AppDispatch, RootState } from "@store";
import { getStaffByRole } from "@store/slices/waiterAuthSlice";
import { StorageKeys } from "@utils/constants";
import { showToast } from "@utils/toastHelper";
import { setItem } from "@utils/storage";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "@store/slices/authSlice";
import { CAPTAIN_ROLE } from "@utils/authSession";

export const useOnBoarding = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [passcode, setPasscode] = useState("");
  const inputRef = useRef<RNTextInputRef>(null);
  const { requestCameraPermission } = useCameraPermission();
  const loading = useSelector((state: RootState) => state.waiterAuth.loading);

  const handlePasscodeChange = (value: string) => {
    setPasscode(value);
  };

  const handleVerify = async () => {
    const isValid = inputRef.current?.validate();
    if (!isValid) {
      return;
    }

    try {
      const result = await dispatch(
        getStaffByRole({
          passcode,
          role: "Captain",
        }),
      );

      if (getStaffByRole.fulfilled.match(result)) {
        if (result.payload.success) {
          setPasscode("");
          showToast("success", t("auth.onBoarding.restaurantLinkSuccess"));
          setItem(StorageKeys.RESTAURANT_ACCESS_CODE, passcode);
          dispatch(setRole(CAPTAIN_ROLE));
          navigation.reset({
            index: 0,
            routes: [{ name: ROUTES.WAITER_LIST }],
          });
        }
        return;
      }

      if (getStaffByRole.rejected.match(result)) {
        const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : t("auth.onBoarding.verificationFailedMessage");

        showToast(
          "error",
          t("auth.onBoarding.verificationFailedTitle"),
          errorMessage,
        );
      }
    } catch {
      showToast(
        "error",
        t("auth.onBoarding.verificationFailedTitle"),
        t("auth.onBoarding.verificationErrorMessage"),
      );
    }
  };

  const handleScanQRCode = async () => {
    if (loading) {
      return;
    }
    const hasPermission = await requestCameraPermission();

    if (hasPermission) {
      navigation.navigate(ROUTES.WAITER_SCANNER);
    }
  };

  return {
    t,
    passcode,
    inputRef,
    loading,
    handlePasscodeChange,
    handleVerify,
    handleScanQRCode,
  };
};
