import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "@utils/toastHelper";
import { calculateBillSummary, groupBillSummaryItems } from "@utils";
import { BillSummaryResponse } from "@appTypes";
import { AppDispatch, RootState } from "@store";
import { BillSummaryRouteProp } from "@navigation/types";
import { generateAndSharePdf, generateHtml } from "@utils/generateAndSharePdf";
import {
  fetchBillSummary,
  markBillPaid,
} from "@store/slices/ownerBillSummarySlice";
import { ROUTES } from "@constants/routes";
import { Common_Values, PAYMENT_METHODS } from "@utils/constants";
import { STRINGS } from "@constants";

export const useBillSummary = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<BillSummaryRouteProp>();
  const tableId = route.params?.tableId;
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector(
    (state: RootState) => state.ownerBillSummary,
  );
  const [shareLoading, setShareLoading] = useState(false);
  const [response, setResponse] = useState<BillSummaryResponse | null>(null);

  const loadBillSummary = useCallback(async () => {
    if (!tableId) return;

    try {
      const resultAction = await dispatch(fetchBillSummary({ tableId }));

      if (fetchBillSummary.fulfilled.match(resultAction)) {
        setResponse(resultAction.payload);
      } else {
        const message =
          (resultAction.payload as string) ||
          t("owner.billSummary.unableToLoadBillSummary");
        showToast("error", t("owner.billSummary.billSummary"), message);
      }
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : t("owner.billSummary.unableToLoadBillSummary");
      showToast("error", t("owner.billSummary.billSummary"), message);
    }
  }, [t, tableId, dispatch]);

  useEffect(() => {
    loadBillSummary().catch(() => undefined);
  }, [loadBillSummary]);

  const billDetails = response?.bill_details ?? null;

  const orderItems = useMemo(
    () => groupBillSummaryItems(response?.orders ?? []),
    [response?.orders],
  );

  const billSummary = useMemo(() => {
    if (!response) {
      return null;
    }

    return calculateBillSummary(
      response?.orders ?? [],
      response?.cgst_percentage ?? 0,
      response?.sgst_percentage ?? 0,
    );
  }, [response]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePrint = useCallback(() => {
    // TODO: Print bill flow
    showToast("info", t("common.comingSoon"));
  }, [t]);

  const handleShare = useCallback(async () => {
    if (!response || !billSummary) {
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
        billNumber: billDetails?.bill_number ?? null,
        tableId: response.table_id,
        customerName: response.customer_name,
        customerMobile: response.customer_mobile,
        sessionStartedAt: response.session_started_at,
        totalGuest: response.total_guest,
        cgstPercentage: response.cgst_percentage,
        sgstPercentage: response.sgst_percentage,
        discountAmount: billDetails?.discount_amount ?? 0,
        paymentMethod: billDetails?.payment_method ?? null,
        items: orderItems,
        summary: billSummary,
        restaurant_details: response?.restaurant_details ?? null,
      });

      await generateAndSharePdf({
        html,
        fileName: `${STRINGS.DINEFLOW}-${
          billDetails?.bill_number ?? response?.table_id ?? ""
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
  }, [billDetails, billSummary, orderItems, response, shareLoading, t]);

  const handleAddDiscount = useCallback(() => {
    // TODO: Add discount flow
    showToast("info", t("common.comingSoon"));
  }, [t]);

  const handleMarkAsPaid = useCallback(async () => {
    if (!billDetails?.bill_id) {
      showToast(
        "error",
        t("owner.billSummary.billSummary"),
        t("common.unknownError"),
      );
      return;
    }

    try {
      const resultAction = await dispatch(
        markBillPaid({
          billId: billDetails.bill_id,
          paymentMethod: PAYMENT_METHODS.CASH,
        }),
      );

      if (markBillPaid.fulfilled.match(resultAction)) {
        const responseData = resultAction.payload;
        const paidAt = responseData?.paid_at || new Date().toISOString();

        const paymentDetails = {
          billNumber:
            billDetails?.bill_number ?? Common_Values.EMPTY_PLACEHOLDER,
          subTotal: billSummary?.subtotal ?? 0,
          cgstAmount: billSummary?.cgstAmount ?? 0,
          sgstAmount: billSummary?.sgstAmount ?? 0,
          cgstPercentage: response?.cgst_percentage ?? 0,
          sgstPercentage: response?.sgst_percentage ?? 0,
          discount: Number(billDetails?.discount_amount ?? 0),
          grandTotal: billSummary?.grandTotal ?? 0,
          paidAt: paidAt,

          tableId: response?.table_id ?? "",
          customerName: response?.customer_name ?? "",
          customerMobile: response?.customer_mobile ?? "",
          sessionStartedAt: response?.session_started_at ?? "",
          totalGuest: response?.total_guest ?? 0,
          items: orderItems,
          restaurant_details: response?.restaurant_details,
        };

        navigation.navigate(ROUTES.PAYMENT_SUCCESS, { paymentDetails });
      } else {
        const errorMsg =
          (resultAction.payload as string) || t("common.unknownError");
        showToast("error", t("owner.billSummary.billSummary"), errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : t("common.unknownError");
      showToast("error", t("owner.billSummary.billSummary"), errorMsg);
    }
  }, [dispatch, billDetails, billSummary, response, orderItems, navigation, t]);

  return {
    t,
    loading,
    error,
    response,
    billDetails,
    orderItems,
    billSummary,
    tableId: response?.table_id,
    tableSessionId: response?.table_session_id ?? null,
    handleBack,
    handlePrint,
    handleShare,
    handleAddDiscount,
    handleMarkAsPaid,
    shareLoading,
  };
};
