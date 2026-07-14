import { useCallback, useContext, useMemo, useState } from "react";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../../contexts/global.provider";
import { AppDispatch, RootState } from "@store";
import { version as appVersion } from "../../../../package.json";
import { showToast } from "@utils/toastHelper";
import { verifyWaiterPasscode } from "@store/slices/authSlice";

export const useWaiterPasscode = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const contextData = useContext(GlobalContext);
  const selectedWaiter = useSelector(
    (state: RootState) => state.auth.selectedWaiter,
  );
  const ownerId = useSelector((state: RootState) => state.auth.ownerId);
  const waiterUser = useSelector((state: RootState) => state.auth.waiterUser);
  const loading = useSelector((state: RootState) => state.auth.loading);

  const [passcode, setPasscode] = useState("");
  const isPasscodeValid = passcode.length === 6;
  const isRTL = contextData?.isRTL ?? false;

  const waiterName = useMemo(() => {
    if (!selectedWaiter) return "";
    return `${selectedWaiter.first_name} ${selectedWaiter.last_name}`;
  }, [selectedWaiter]);

  const handleLogin = useCallback(async () => {
    if (!selectedWaiter || !isPasscodeValid || loading) return;

    const payload = {
      owner_id: ownerId ?? 1,
      staff_id: selectedWaiter.staff_id,
      passcode,
      role: selectedWaiter.role,
      device_id: "android_123456",
      device_name: Platform.OS === "android" ? "Samsung S24" : "iPhone",
      device_type: Platform.OS === "android" ? "Android" : "iOS",
      app_version: appVersion,
    };

    try {
      const result = await dispatch(verifyWaiterPasscode(payload));

      if (verifyWaiterPasscode.fulfilled.match(result)) {
        showToast(
          "success",
          t("waiter.waiterPasscode.loginSuccess"),
          result.payload.message ?? "",
        );
        return;
      }

      if (verifyWaiterPasscode.rejected.match(result)) {
        const message =
          typeof result.payload === "string"
            ? result.payload
            : t("common.unknownError");
        showToast("error", t("waiter.waiterPasscode.loginFailed"), message);
      }
    } catch (error) {
      console.error("Waiter passcode error:", error);
      showToast(
        "error",
        t("waiter.waiterPasscode.loginFailed"),
        t("common.unknownError"),
      );
    }
  }, [
    dispatch,
    isPasscodeValid,
    loading,
    ownerId,
    passcode,
    selectedWaiter,
    t,
  ]);

  return {
    t,
    selectedWaiter,
    ownerId,
    waiterUser,
    waiterName,
    passcode,
    setPasscode,
    isPasscodeValid,
    isRTL,
    loading,
    handleLogin,
  };
};
