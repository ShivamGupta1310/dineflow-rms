import { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "@utils/toastHelper";
import { calculateBillSummary, groupBillSummaryItems } from "@utils";
import { AppDispatch, RootState } from "@store";
import { SuccessScreenController } from "../../../../hoc/withSuccessScreen";
import { clearOrder, generateBill } from "@store/slices/waiterOrderSlice";
import { ROUTES } from "@constants";
import { Common_Values } from "@utils/constants";
import styles from "./styles";

const getMobileValidationError = (mobileNumber: string) => {
  if (!mobileNumber.trim()) {
    return "required";
  }

  if (!/^\d+$/.test(mobileNumber) || mobileNumber.length !== 10) {
    return "invalid";
  }

  return null;
};

export const useBillGeneration = (
  controller?: Partial<SuccessScreenController>,
) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [mobileFieldError, setMobileFieldError] = useState<string | null>(null);

  const showSuccessScreen = useMemo(
    (): SuccessScreenController["showSuccessScreen"] | (() => void) =>
      controller?.showSuccessScreen ?? (() => {}),
    [controller?.showSuccessScreen],
  );
  const { selectedTable, orders, tableSession, billMetadata, loading, error } =
    useSelector((state: RootState) => state.waiterOrder);
  const [fullName, setFullName] = useState(tableSession?.customerName ?? "");

  const [mobileNumber, setMobileNumber] = useState(
    tableSession?.customerMobile ?? "",
  );

  const mobileErrorText = useMemo(() => {
    if (mobileFieldError === "required") {
      return t("auth.login.errors.mobileRequired");
    }

    if (mobileFieldError === "invalid") {
      return t("auth.login.errors.mobileInvalid");
    }

    return null;
  }, [mobileFieldError, t]);

  const handleFullNameChange = useCallback((value: string) => {
    setFullName(value);
  }, []);

  const handleMobileChange = useCallback(
    (value: string) => {
      const onlyDigits = value.replace(/\D/g, "");

      setMobileNumber(onlyDigits);

      if (mobileFieldError) {
        setMobileFieldError(null);
      }
    },
    [mobileFieldError],
  );

  const isGenerateBillDisabled = useMemo(() => {
    return !fullName.trim() || !!getMobileValidationError(mobileNumber);
  }, [fullName, mobileNumber]);

  const orderNumbers = useMemo(() => {
    const orderNumbersArr = orders
      .map((order) => order.order_number?.trim())
      .filter(Boolean);

    if (orderNumbersArr.length === 0) {
      return Common_Values.EMPTY_PLACEHOLDER;
    }

    return orderNumbersArr.map((orderNumber) => `#${orderNumber}`).join(", ");
  }, [orders]);

  const orderItems = useMemo(() => groupBillSummaryItems(orders), [orders]);

  const calculatedBillSummary = useMemo(() => {
    if (!billMetadata) {
      return null;
    }

    return calculateBillSummary(
      orders ?? [],
      billMetadata?.cgstPercentage ?? 0,
      billMetadata?.sgstPercentage ?? 0,
    );
  }, [billMetadata, orders]);

  const handleSuccessOkay = useCallback(() => {
    dispatch(clearOrder());
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ROUTES.MAIN_TABS,
          state: {
            routes: [{ name: ROUTES.TABLES }],
          },
        },
      ],
    });
  }, [dispatch, navigation]);

  const handleGenerateBill = useCallback(async () => {
    const result = await dispatch(
      generateBill({
        customerName: fullName,
        customerMobile: mobileNumber,
      }),
    );

    if (generateBill.fulfilled.match(result)) {
      showSuccessScreen({
        title: t("waiter.generateBill.billGenerated"),
        subtitle: t("waiter.generateBill.successMessage", {
          billNumber: result.payload.bill_number,
        }),
        isSuccessIconVisible: false,
        onPress: handleSuccessOkay,
        buttonText: t("waiter.generateBill.okay"),
        subtitleStyle: styles.successSubtitle,
      });
    }
  }, [
    fullName,
    mobileNumber,
    dispatch,
    showSuccessScreen,
    handleSuccessOkay,
    t,
  ]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddDiscount = useCallback(() => {
    // TODO: Add discount flow
    showToast("info", t("common.comingSoon"));
  }, [t]);

  return {
    t,
    loading,
    error,
    fullName,
    mobileNumber,
    mobileErrorText,
    orderNumbers,
    orderItems,
    tableSession,
    billMetadata,
    calculatedBillSummary,
    tableId: selectedTable?.table_id,
    isGenerateBillDisabled,
    handleBack,
    handleFullNameChange,
    handleMobileChange,
    handleAddDiscount,
    handleGenerateBill,
  };
};
