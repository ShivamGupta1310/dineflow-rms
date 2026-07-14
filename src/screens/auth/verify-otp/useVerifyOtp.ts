import { showToast } from "@utils/toastHelper";
import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "@store";
import { useDispatch } from "react-redux";
import { Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { version as appVersion } from "../../../../package.json";
import { setOwnerId, verifyOwnerOtp } from "@store/slices/authSlice";
import { ROUTES } from "@constants/routes";
import { StorageKeys } from "@utils/constants";
import { GlobalContext } from "../../../contexts/global.provider";
import { setItem } from "@utils/storage";

type VerifyOtpRouteParams = {
  ownerId?: number;
  phoneNumber?: string;
  countryCode?: number;
  otp?: string;
};

const useVerifyOtp = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const contextData = useContext(GlobalContext);
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const {
    phoneNumber,
    countryCode,
    ownerId,
    otp: initialOtp,
  } = (route.params as VerifyOtpRouteParams) ?? {};
  const [otp, setOtp] = useState(initialOtp ?? "");
  const [loading, setLoading] = useState(false);

  const isRTL = contextData?.isRTL ?? false;

  const isOtpValid = otp.length === 6;

  const handleVerify = useCallback(async () => {
    if (!isOtpValid || loading || !ownerId) return;

    const payload = {
      owner_id: ownerId,
      otp,
      device_id: "android_123456",
      device_name: Platform.OS === "android" ? "Samsung S24" : "iPhone",
      device_type: Platform.OS === "android" ? "Android" : "iOS",
      app_version: appVersion,
    };

    try {
      setLoading(true);
      const result = await dispatch(verifyOwnerOtp(payload));
      const accessCode = result?.payload?.user?.passcode || "";
      if (verifyOwnerOtp.fulfilled.match(result)) {
        dispatch(setOwnerId(ownerId));
        setItem(StorageKeys.OWNER_ACCESS_CODE, accessCode);
        showToast(
          "success",
          result.payload.message ?? t("auth.verifyOtp.otpSuccessMsg"),
        );
        navigation.getParent()?.reset({
          index: 0,
          routes: [
            {
              name: ROUTES.APP,
              state: {
                index: 0,
                routes: [{ name: ROUTES.HOME }],
              },
            },
          ],
        });
        return;
      }

      if (verifyOwnerOtp.rejected.match(result)) {
        const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : t("auth.verifyOtp.invalidOtpErrMsg");

        showToast("error", errorMessage);
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      showToast("error", t("auth.verifyOtp.invalidOtpErrMsg"));
    } finally {
      setLoading(false);
    }
  }, [dispatch, isOtpValid, loading, navigation, otp, ownerId, t]);

  const handleWaiterOnboarding = () => {
    navigation.navigate(ROUTES.WAITER_ONBOARDING);
  };

  return {
    t,
    otp,
    setOtp,
    isOtpValid,
    handleVerify,
    loading,
    isRTL,
    phoneNumber,
    countryCode,
    handleWaiterOnboarding,
  };
};

export default useVerifyOtp;
