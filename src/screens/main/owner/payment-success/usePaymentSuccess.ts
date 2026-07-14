import { useCallback, useMemo, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { showToast } from "@utils/toastHelper";
import { generateAndSharePdf, generateHtml } from "@utils/generateAndSharePdf";
import { ROUTES } from "@constants/routes";
import { formatDate } from "@utils";
import { Common_Values, Date_Format, PAYMENT_METHODS } from "@utils/constants";
import { STRINGS } from "@constants";

export const usePaymentSuccess = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const paymentDetails = route.params?.paymentDetails;

  const [shareLoading, setShareLoading] = useState(false);

  const formattedPaidAt = useMemo(() => {
    if (!paymentDetails?.paidAt) return Common_Values.EMPTY_PLACEHOLDER;
    return formatDate(paymentDetails.paidAt, Date_Format.DD_MM_YY_HH_MM_A);
  }, [paymentDetails?.paidAt]);

  const handleBack = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ROUTES.MAIN_TABS,
          params: {
            screen: ROUTES.HOME,
          },
        },
      ],
    });
  }, [navigation]);

  const handlePrint = useCallback(() => {
    showToast("info", t("common.comingSoon"));
  }, [t]);

  const handleShare = useCallback(async () => {
    if (!paymentDetails) {
      showToast(
        "error",
        t("owner.billSummary.billSummary"),
        t("owner.billSummary.unableToLoadBillSummary"),
      );
      return;
    }

    if (shareLoading) {
      return;
    }

    try {
      setShareLoading(true);

      const html = generateHtml({
        billNumber: paymentDetails.billNumber,
        tableId: paymentDetails.tableId,
        customerName: paymentDetails.customerName,
        customerMobile: paymentDetails.customerMobile,
        sessionStartedAt: paymentDetails.sessionStartedAt,
        totalGuest: paymentDetails.totalGuest,
        cgstPercentage: paymentDetails.cgstPercentage,
        sgstPercentage: paymentDetails.sgstPercentage,
        discountAmount: paymentDetails.discount,
        paymentMethod: PAYMENT_METHODS.CASH,
        items: paymentDetails.items,
        summary: {
          subtotal: paymentDetails.subTotal,
          cgstAmount: paymentDetails.cgstAmount,
          sgstAmount: paymentDetails.sgstAmount,
          taxAmount: paymentDetails.cgstAmount + paymentDetails.sgstAmount,
          grandTotal: paymentDetails.grandTotal,
        },
        restaurant_details: paymentDetails.restaurant_details,
      });

      await generateAndSharePdf({
        html,
        fileName: `${STRINGS.DINEFLOW}-${
          paymentDetails.billNumber ?? paymentDetails.tableId ?? ""
        }`,
      });
    } catch (shareError) {
      const message =
        shareError instanceof Error
          ? shareError.message
          : t("common.unknownError");
      showToast("error", t("owner.billSummary.billSummary"), message);
    } finally {
      setShareLoading(false);
    }
  }, [paymentDetails, shareLoading, t]);

  return {
    t,
    paymentDetails,
    shareLoading,
    formattedPaidAt,
    handleBack,
    handlePrint,
    handleShare,
  };
};
