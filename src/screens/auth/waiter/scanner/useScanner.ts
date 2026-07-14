import { RNTextInputRef } from "@components";
import {
  BarcodeScannerRef,
  ScanResult,
} from "@components/barcode-scanner/barcode-scanner.props";
import { AppDispatch } from "@store";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "@constants/routes";
import { setRole } from "@store/slices/authSlice";
import { getStaffByRole } from "@store/slices/waiterAuthSlice";
import { StorageKeys } from "@utils/constants";
import { setItem } from "@utils/storage";
import { showToast } from "@utils/toastHelper";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { CAPTAIN_ROLE } from "@utils/authSession";

type VerifySource = "scan" | "button";

export const useScanner = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [passcode, setPasscode] = useState("");
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const inputRef = useRef<RNTextInputRef>(null);
  const dispatch = useDispatch<AppDispatch>();
  const barcodeScannerRef = useRef<BarcodeScannerRef>(null);
  const isScanVerificationInProgressRef = useRef(false);
  const isScanSessionLockedRef = useRef(false);

  const handleScan = (result: ScanResult) => {
    handleBarcodeScan(result);
  };

  const handlePasscodeChange = (value: string) => {
    setPasscode(value);
  };

  const resetScanSession = () => {
    isScanVerificationInProgressRef.current = false;
    isScanSessionLockedRef.current = false;
    barcodeScannerRef.current?.scanAgain();
  };

  const handleBarcodeScan = (result: ScanResult) => {
    if (!result.success) {
      barcodeScannerRef.current?.scanAgain();
      return;
    }
    if (
      isScanVerificationInProgressRef.current ||
      isScanSessionLockedRef.current
    ) {
      return;
    }
    setPasscode(result.value);
    handleVerify(result.value, "scan");
  };

  const handleVerify = async (
    value: string,
    source: VerifySource = "button",
  ) => {
    const isScanSource = source === "scan";

    if (source === "button") {
      const isValid = inputRef.current?.validate();
      if (!isValid) {
        return;
      }
    }

    if (isScanSource) {
      if (
        isScanVerificationInProgressRef.current ||
        isScanSessionLockedRef.current
      ) {
        return;
      }
      isScanVerificationInProgressRef.current = true;
      setIsScanLoading(true);
    } else {
      setIsButtonLoading(true);
    }

    try {
      const result = await dispatch(
        getStaffByRole({
          passcode: value,
          role: "Captain",
        }),
      );

      if (getStaffByRole.fulfilled.match(result)) {
        if (result.payload.success) {
          setPasscode("");
          showToast("success", t("auth.onBoarding.restaurantLinkSuccess"));
          setItem(StorageKeys.RESTAURANT_ACCESS_CODE, value);
          dispatch(setRole(CAPTAIN_ROLE));
          navigation.reset({
            index: 0,
            routes: [{ name: ROUTES.WAITER_LIST }],
          });
        }
        if (isScanSource) {
          isScanSessionLockedRef.current = true;
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
        if (isScanSource) {
          isScanSessionLockedRef.current = true;
        }
      }
    } catch {
      showToast(
        "error",
        t("auth.onBoarding.verificationFailedTitle"),
        t("auth.onBoarding.verificationErrorMessage"),
      );
      if (isScanSource) {
        isScanSessionLockedRef.current = true;
      }
    } finally {
      if (isScanSource) {
        isScanVerificationInProgressRef.current = false;
        setIsScanLoading(false);
      } else {
        setIsButtonLoading(false);
      }
      resetScanSession();
    }
  };

  return {
    t,
    passcode,
    isScanLoading,
    isButtonLoading,
    inputRef,
    handlePasscodeChange,
    handleBarcodeScan,
    handleVerify,
    handleScan,
    barcodeScannerRef,
  };
};
