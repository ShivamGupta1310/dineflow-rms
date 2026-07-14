import { useCallback, useContext, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { GlobalContext } from "../../../contexts/global.provider";
import { ROUTES } from "@constants/routes";
import { AppDispatch, RootState } from "@store";
import { sendOwnerOtp } from "@store/slices/authSlice";
import { StorageKeys } from "@utils/constants";
import { getItem, removeItem, setItem } from "@utils/storage";
import { LanguageLabel, LanguagesTypes } from "@appTypes";
import i18next from "i18next";
import { changeAppLanguage } from "@utils/language";
const COUNTRY_CODE = 91;

type OwnerLoginStorage = {
  mobileNumber: string;
};

const getStoredOwnerLogin = (): OwnerLoginStorage | null => {
  const storedValue = getItem(StorageKeys.OWNER_LOGIN);

  if (!storedValue) {
    return null;
  }

  if (typeof storedValue === "string") {
    try {
      const parsed = JSON.parse(storedValue) as Partial<OwnerLoginStorage>;
      if (
        typeof parsed.mobileNumber !== "string" ||
        !/^\d{10}$/.test(parsed.mobileNumber)
      ) {
        return null;
      }

      return {
        mobileNumber: parsed.mobileNumber,
      };
    } catch {
      return null;
    }
  }

  if (typeof storedValue !== "object") {
    return null;
  }

  const parsed = storedValue as Partial<OwnerLoginStorage>;
  if (
    typeof parsed.mobileNumber !== "string" ||
    !/^\d{10}$/.test(parsed.mobileNumber)
  ) {
    return null;
  }

  return {
    mobileNumber: parsed.mobileNumber,
  };
};

const getMobileValidationError = (mobileNumber: string) => {
  if (!mobileNumber.trim()) {
    return "required";
  }

  if (!/^\d+$/.test(mobileNumber) || mobileNumber.length !== 10) {
    return "invalid";
  }

  return null;
};

export const useOwnerLogin = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const contextData = useContext(GlobalContext);

  const storedOwnerLogin = useMemo(() => getStoredOwnerLogin(), []);

  const [mobileNumber, setMobileNumber] = useState(
    storedOwnerLogin?.mobileNumber ?? "",
  );
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(Boolean(storedOwnerLogin));
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  const [language, setLanguage] = useState<LanguageLabel>(
    i18next.language === LanguagesTypes.ar ? "AR" : "EN",
  );

  const isRTL = contextData?.isRTL ?? false;

  const persistOwnerLogin = useCallback((nextMobileNumber: string) => {
    setItem(
      StorageKeys.OWNER_LOGIN,
      JSON.stringify({ mobileNumber: nextMobileNumber }),
    );
  }, []);

  const clearOwnerLogin = useCallback(() => {
    removeItem(StorageKeys.OWNER_LOGIN);
  }, []);

  const mobileErrorText = useMemo(() => {
    if (fieldError === "required") {
      return t("auth.login.errors.mobileRequired");
    }

    if (fieldError === "invalid") {
      return t("auth.login.errors.mobileInvalid");
    }

    return null;
  }, [fieldError, t]);

  const handleMobileChange = useCallback(
    (value: string) => {
      const onlyDigits = value.replace(/\D/g, "");
      setMobileNumber(onlyDigits);
      if (fieldError) {
        setFieldError(null);
      }
      if (submitError) {
        setSubmitError(null);
      }
    },
    [fieldError, submitError],
  );

  const handleContinue = useCallback(async () => {
    const validationError = getMobileValidationError(mobileNumber);

    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError(null);
    setSubmitError(null);

    try {
      const response = await dispatch(
        sendOwnerOtp({
          phone_number: mobileNumber,
          country_code: COUNTRY_CODE,
        }),
      );

      if (sendOwnerOtp.fulfilled.match(response)) {
        if (rememberMe) {
          persistOwnerLogin(mobileNumber);
        }
        navigation.navigate(ROUTES.VERIFICATION, {
          phoneNumber: mobileNumber,
          countryCode: COUNTRY_CODE,
          ownerId: response.payload.owner_id,
          otp: response.payload.otp,
        });
      }
    } catch (error) {
      const message =
        typeof error === "string" ? error : t("auth.login.errors.otpFailed");

      setSubmitError(message);
    }
  }, [dispatch, mobileNumber, navigation, persistOwnerLogin, rememberMe, t]);

  const toggleRememberMe = useCallback(() => {
    setRememberMe((currentValue) => {
      const nextValue = !currentValue;

      if (nextValue && mobileNumber.length === 10) {
        persistOwnerLogin(mobileNumber);
      }

      if (!nextValue) {
        clearOwnerLogin();
      }

      return nextValue;
    });
  }, [clearOwnerLogin, mobileNumber, persistOwnerLogin]);

  const handleWaiterOnboarding = () => {
    navigation.navigate(ROUTES.WAITER_ONBOARDING);
  };

  const toggleLanguageSheet = (val: boolean) => {
    setShowLanguageSheet(val);
  };
  const onLanguageChipPress = () => {
    toggleLanguageSheet(true);
  };

  const handleLanguageApply = async (selectedLanguage: LanguageLabel) => {
    await changeAppLanguage(selectedLanguage);

    const selectedLan =
      selectedLanguage.toLocaleLowerCase() === LanguagesTypes.ar
        ? LanguagesTypes.ar
        : LanguagesTypes.en;

    contextData?.setLanguage(selectedLan);
    contextData?.setIsRTL(selectedLan === LanguagesTypes.ar);

    setLanguage(selectedLanguage);
    toggleLanguageSheet(false);
  };
  return {
    COUNTRY_CODE,
    isRTL,
    loading,
    mobileNumber,
    mobileErrorText,
    submitError,
    rememberMe,
    t,
    handleMobileChange,
    handleContinue,
    toggleRememberMe,
    handleWaiterOnboarding,
    showLanguageSheet,
    language,
    toggleLanguageSheet,
    onLanguageChipPress,
    handleLanguageApply,
  };
};
