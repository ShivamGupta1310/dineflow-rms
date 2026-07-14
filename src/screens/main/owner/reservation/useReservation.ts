import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import type { CustomAlertController } from "../../../../hoc/withCustomAlert";
import type { SuccessScreenController } from "../../../../hoc/withSuccessScreen";
import { AppDispatch, RootState } from "@store";
import {
  fetchReservations,
  ReservationItem,
  updateReservationStatus,
} from "@store/slices/reservationSlice";
import { ReservationStatus } from "@utils/constants";
import { colors } from "@theme/colors";
import { GlobalContext } from "../../../../contexts/global.provider";
import styles from "./styles";
import { showToast } from "@utils/toastHelper";
import { openDialer } from "@utils";
import { ROUTES } from "@constants";
const noop = () => {};

export const useReservation = (
  _controller?: Partial<CustomAlertController & SuccessScreenController>,
) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const contextData = useContext(GlobalContext);
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);
  const showAlert = _controller?.showAlert ?? noop;
  const showSuccessScreen = _controller?.showSuccessScreen ?? noop;
  const reservationData = useSelector(
    (state: RootState) => state.reservation.reservations,
  );
  const loading = useSelector((state: RootState) => state.reservation.loading);
  const listNeedsRefresh = useSelector(
    (state: RootState) => state.reservation.listNeedsRefresh,
  );
  const isRTL = contextData?.isRTL ?? false;
  const hasFetchedInitiallyRef = useRef(false);
  const ownerId = useSelector((state: RootState) => {
    const fallbackOwnerId = Number(
      (state.auth.user as { owner_id?: number } | null)?.owner_id,
    );

    return (
      state.auth.ownerId ??
      (Number.isFinite(fallbackOwnerId) ? fallbackOwnerId : null)
    );
  });
  const refreshReservations = useCallback(() => {
    return dispatch(fetchReservations());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (!hasFetchedInitiallyRef.current) {
        hasFetchedInitiallyRef.current = true;
        refreshReservations();
        return;
      }

      if (!listNeedsRefresh) {
        return;
      }

      refreshReservations();
    }, [listNeedsRefresh, refreshReservations]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refreshReservations();
    } finally {
      setRefreshing(false);
    }
  }, [refreshReservations]);

  const reservationTabsConfig = useMemo(
    () => [
      {
        title: t("owner.reservation.status.pending"),
        status: ReservationStatus.Pending,
        dotColor: colors.warningTextStrong,
        activeBorderColor: colors.warningTextStrong,
        activeBackgroundColor: colors.warningBackgroundLight,
      },
      {
        title: t("owner.reservation.status.needConfirmation"),
        status: ReservationStatus.NeedConfirmation,
        dotColor: colors.primary,
        activeBorderColor: colors.primary,
        activeBackgroundColor: colors.warningBackgroundSoft,
      },
      {
        title: t("owner.reservation.status.confirmed"),
        status: ReservationStatus.Confirmed,
        dotColor: colors.successText,
        activeBorderColor: colors.successText,
        activeBackgroundColor: colors.successBackgroundLight,
      },
      {
        title: t("owner.reservation.status.reserved"),
        status: ReservationStatus.Reserved,
        dotColor: colors.infoTextStrong,
        activeBorderColor: colors.infoTextStrong,
        activeBackgroundColor: colors.infoBackgroundLight,
      },
      {
        title: t("owner.reservation.status.cancelled"),
        status: ReservationStatus.Cancelled,
        dotColor: colors.dangerTextStrong,
        activeBorderColor: colors.dangerTextStrong,
        activeBackgroundColor: colors.dangerBackgroundLight,
      },
    ],
    [t],
  );

  const normalizedSearchText = searchText.trim().toLowerCase();

  const searchFilteredReservations = useMemo(() => {
    return reservationData.filter((item) => {
      const normalizedPhone = item.customer_phone.toLowerCase();
      const matchesSearch =
        !normalizedSearchText ||
        item.customer_name.toLowerCase().includes(normalizedSearchText) ||
        normalizedPhone.includes(normalizedSearchText);

      return matchesSearch;
    });
  }, [normalizedSearchText, reservationData]);

  const reservationList = useMemo(() => {
    return searchFilteredReservations.filter((item) => {
      return selectedStatus === "all" || item.status === selectedStatus;
    });
  }, [searchFilteredReservations, selectedStatus]);

  const tabContent = useMemo(
    () => [
      {
        id: "1",
        title: t("owner.reservation.tabs.all"),
        status: "all",
        count: searchFilteredReservations.length,
        activeBorderColor: colors.primary,
      },
      ...reservationTabsConfig.map((tab, index) => ({
        id: `${index + 2}`,
        title: tab.title,
        status: tab.status,
        dotColor: tab.dotColor,
        activeBorderColor: tab.activeBorderColor,
        activeBackgroundColor: tab.activeBackgroundColor,
        count: searchFilteredReservations.filter(
          (item) => item.status === tab.status,
        ).length,
      })),
    ],
    [reservationTabsConfig, searchFilteredReservations, t],
  );

  const handleSelectedStatus = useCallback(
    (value: string) => {
      if (value === selectedStatus) {
        return;
      }
      setSelectedStatus(value);
    },
    [selectedStatus],
  );

  const handleUpdateStatus = useCallback(
    async (item: ReservationItem, status: ReservationStatus) => {
      if (!ownerId) {
        showToast("error", String(t("common.unknownError")));
        return;
      }

      try {
        const response = await dispatch(
          updateReservationStatus({
            p_reservation_id: item.id,
            p_status: status,
            p_staff_id: ownerId,
          }),
        ).unwrap();

        if (!response.success) return;

        const isConfirmed = status === ReservationStatus.Confirmed;

        showSuccessScreen({
          title: t(
            isConfirmed
              ? "owner.reservation.confirmReservation.successTitle"
              : "owner.reservation.cancelReservation.successTitle",
          ),
          subtitle: isConfirmed
            ? `${item?.customer_name} ${t(
                "owner.reservation.confirmReservation.successSubtitle",
              )}`
            : t("owner.reservation.cancelReservation.successSubtitle"),
        });
      } catch {
        showToast("error", String(t("common.unknownError")));
        // Errors are handled through thunk rejection and toast messaging.
      }
    },
    [dispatch, ownerId, showSuccessScreen, t],
  );

  const showReservationAlert = useCallback(
    (
      item: ReservationItem,
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

  const handleConfirmReservation = useCallback(
    (item: ReservationItem) => {
      showReservationAlert(
        item,
        ReservationStatus.Confirmed,
        "owner.reservation.confirmReservation.title",
        "owner.reservation.confirmReservation.subtitle",
        [styles.modalTitle, styles.confirmTitle],
      );
    },
    [showReservationAlert],
  );

  const handleCancelReservation = useCallback(
    (item: ReservationItem) => {
      showReservationAlert(
        item,
        ReservationStatus.Cancelled,
        "owner.reservation.cancelReservation.title",
        "owner.reservation.cancelReservation.subtitle",
        [styles.modalTitle, styles.canelTitle],
      );
    },
    [showReservationAlert],
  );

  const handleReservedReservation = useCallback(
    (item: ReservationItem) => {
      navigation.navigate(ROUTES.RESERVE_TABLE, { item });
    },
    [navigation],
  );

  const handleReservationDetails = useCallback(
    (reservationId: number) => {
      navigation.navigate(ROUTES.RESERVATIONS_DETAILS, {
        reservationId,
      });
    },
    [navigation],
  );

  const handleNewReservation = () => {
    navigation.navigate(ROUTES.NEW_RESERVATION);
  };

  return {
    isRTL,
    loading,
    searchText,
    tabContent,
    setSearchText,
    reservationList,
    selectedStatus,
    handleSelectedStatus,
    openDialer,
    onRefresh,
    refreshing,
    handleConfirmReservation,
    handleCancelReservation,
    handleReservedReservation,
    handleReservationDetails,
    handleNewReservation,
  };
};
