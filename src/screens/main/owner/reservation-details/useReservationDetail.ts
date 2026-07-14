import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { GlobalContext } from "../../../../contexts/global.provider";
import type { CustomAlertController } from "../../../../hoc/withCustomAlert";
import type { SuccessScreenController } from "../../../../hoc/withSuccessScreen";
import { AppDispatch, RootState } from "@store";
import {
  OwnerStackNavigationProp,
  OwnerStackParamList,
} from "@navigation/types";
import { ROUTES } from "@constants";
import {
  fetchReservationDetails,
  markReservationListForRefresh,
  ReservationDetail,
  updateReservationStatus,
} from "@store/slices/reservationSlice";
import {
  formatDisplayDate,
  formatDisplayTime,
  openDialer,
  toSuperscriptOrdinal,
} from "@utils";
import { showToast } from "@utils/toastHelper";
import {
  Common_Values,
  Date_Format,
  ReservationStatus,
} from "@utils/constants";
import reservationStyles from "../reservation/styles";

type ReservationActionTarget = Pick<
  ReservationDetail,
  "reservation_id" | "customer_name"
>;

const noop = () => {};

export const useReservationDetail = (
  controller?: Partial<CustomAlertController & SuccessScreenController>,
) => {
  const { t } = useTranslation();
  const navigation = useNavigation<OwnerStackNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const route =
    useRoute<
      RouteProp<OwnerStackParamList, typeof ROUTES.RESERVATIONS_DETAILS>
    >();
  const contextData = useContext(GlobalContext);
  const isRTL = contextData?.isRTL ?? false;
  const reservationId = route.params?.reservationId;
  const { EMPTY_PLACEHOLDER } = Common_Values;
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const showAlert = controller?.showAlert ?? noop;
  const showSuccessScreen = controller?.showSuccessScreen ?? noop;

  const reservation = useSelector(
    (state: RootState) => state.reservation.reservationDetail,
  );
  const reservationActivities = useSelector(
    (state: RootState) => state.reservation.reservationActivities,
  );
  const loading = useSelector(
    (state: RootState) => state.reservation.detailLoading,
  );
  const ownerId = useSelector((state: RootState) => {
    const fallbackOwnerId = Number(
      (state.auth.user as { owner_id?: number } | null)?.owner_id,
    );

    return (
      state.auth.ownerId ??
      (Number.isFinite(fallbackOwnerId) ? fallbackOwnerId : null)
    );
  });

  useEffect(() => {
    if (!reservationId) {
      return;
    }
    dispatch(fetchReservationDetails(reservationId));
  }, [dispatch, reservationId]);

  const reservationTime = useMemo(
    () =>
      formatDisplayTime(
        reservation?.reservation_time,
        Date_Format.TIME_12_HOUR,
        false,
      ),
    [reservation?.reservation_time],
  );
  const reservationDetails = useMemo(
    () => [
      {
        label: t("owner.reservation.details.bookingId"),
        value: reservation?.reservation_number || EMPTY_PLACEHOLDER,
      },
      {
        label: t("owner.reservation.details.reservationType"),
        value: reservation?.reservation_type || EMPTY_PLACEHOLDER,
      },
      {
        label: t("owner.reservation.details.createdOn"),
        value: reservation?.created_at
          ? `${toSuperscriptOrdinal(
              formatDisplayDate(
                reservation?.created_at,
                Date_Format.Do_MMM_YY,
                null,
                Date_Format.TIME_12_HOUR,
                true,
              ),
            )}`
          : EMPTY_PLACEHOLDER,
      },
      {
        label: t("owner.reservation.details.source"),
        value: reservation?.source || EMPTY_PLACEHOLDER,
      },
      {
        label: t("owner.reservation.details.specialNotes"),
        value: reservation?.notes || EMPTY_PLACEHOLDER,
      },
    ],
    [EMPTY_PLACEHOLDER, reservation, t],
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCallGuest = useCallback(async () => {
    if (!reservation?.customer_phone) {
      return;
    }

    await openDialer(reservation.customer_phone);
  }, [reservation]);

  const handleEditReservation = useCallback(() => {
    if (!reservation) {
      return;
    }

    navigation.navigate(ROUTES.NEW_RESERVATION, {
      reservationData: reservation,
      slotId: (reservation as ReservationDetail & { slot_id?: number }).slot_id,
    });
  }, [navigation, reservation]);

  const refreshReservationDetails = useCallback(
    (targetReservationId?: number) => {
      if (!targetReservationId) {
        return;
      }

      dispatch(fetchReservationDetails(targetReservationId));
    },
    [dispatch],
  );

  const getSuccessContent = useCallback(
    (status: ReservationStatus, customerName: string) => {
      switch (status) {
        case ReservationStatus.Confirmed:
          return {
            title: t("owner.reservation.confirmReservation.successTitle"),
            subtitle: `${customerName} ${t(
              "owner.reservation.confirmReservation.successSubtitle",
            )}`,
          };
        case ReservationStatus.Cancelled:
        default:
          return {
            title: t("owner.reservation.cancelReservation.successTitle"),
            subtitle: t("owner.reservation.cancelReservation.successSubtitle"),
          };
      }
    },
    [t],
  );

  const handleUpdateStatus = useCallback(
    async (item: ReservationActionTarget, status: ReservationStatus) => {
      if (!ownerId) {
        showToast("error", String(t("common.unknownError")));
        return;
      }

      try {
        setStatusUpdateLoading(true);
        const response = await dispatch(
          updateReservationStatus({
            p_reservation_id: item.reservation_id,
            p_status: status,
            p_staff_id: ownerId,
          }),
        ).unwrap();

        if (!response.success) return;

        dispatch(markReservationListForRefresh());
        showSuccessScreen({
          ...getSuccessContent(status, item.customer_name),
          onPress: () => refreshReservationDetails(item.reservation_id),
        });
      } catch {
        showToast("error", String(t("common.unknownError")));
      } finally {
        setStatusUpdateLoading(false);
      }
    },
    [
      dispatch,
      getSuccessContent,
      ownerId,
      refreshReservationDetails,
      showSuccessScreen,
      t,
    ],
  );

  const showReservationAlert = useCallback(
    (
      item: ReservationActionTarget,
      status: ReservationStatus,
      titleKey: string,
      subtitleKey: string,
      titleStyle: any,
    ) => {
      showAlert({
        title: t(titleKey),
        subtitle: `${t(subtitleKey)} ${item.customer_name}${" "}${t(
          "common.questionMark",
        )}`,
        titleStyle,
        onOk: () => handleUpdateStatus(item, status),
      });
    },
    [handleUpdateStatus, showAlert, t],
  );

  const handleConfirmReservation = useCallback(() => {
    if (!reservation) {
      return;
    }

    showReservationAlert(
      reservation,
      ReservationStatus.Confirmed,
      "owner.reservation.confirmReservation.title",
      "owner.reservation.confirmReservation.subtitle",
      [reservationStyles.modalTitle, reservationStyles.confirmTitle],
    );
  }, [reservation, showReservationAlert]);

  const handleCancelReservation = useCallback(() => {
    if (!reservation) {
      return;
    }

    showReservationAlert(
      reservation,
      ReservationStatus.Cancelled,
      "owner.reservation.cancelReservation.title",
      "owner.reservation.cancelReservation.subtitle",
      [reservationStyles.modalTitle, reservationStyles.canelTitle],
    );
  }, [reservation, showReservationAlert]);

  const handleReservedReservation = useCallback(() => {
    if (!reservation) {
      return;
    }    
    navigation.navigate(ROUTES.RESERVE_TABLE, { item: reservation });
  }, [navigation, reservation]);

  return {
    t,
    isRTL,
    loading,
    statusUpdateLoading,
    reservation,
    reservationActivities,
    reservationTime,
    reservationDetails,
    EMPTY_PLACEHOLDER,
    handleBack,
    handleCallGuest,
    handleEditReservation,
    handleConfirmReservation,
    handleCancelReservation,
    handleReservedReservation,
  };
};
