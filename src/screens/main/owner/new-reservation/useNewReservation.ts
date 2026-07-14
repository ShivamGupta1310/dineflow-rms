import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { GlobalContext } from "../../../../contexts/global.provider";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AppDispatch, RootState } from "@store";
import {
  createReservation,
  fetchReservationMeta,
  markReservationListForRefresh,
} from "@store/slices/reservationSlice";
import { clearTimeSlots, fetchTimeSlots } from "@store/slices/ownerTablesSlice";
import { useDispatch, useSelector } from "react-redux";
import type { SuccessScreenController } from "../../../../hoc/withSuccessScreen";
import { Date_Format, Locales } from "@utils/constants";
import {
  OwnerStackNavigationProp,
  OwnerStackParamList,
} from "@navigation/types";
import { ROUTES } from "@constants";
import { showToast } from "@utils/toastHelper";

const COUNTRY_CODE = 91;

const getMobileValidationError = (mobileNumber: string) => {
  if (!mobileNumber.trim()) {
    return "required";
  }

  if (!/^\d+$/.test(mobileNumber) || mobileNumber.length !== 10) {
    return "invalid";
  }

  return null;
};

export const useNewReservation = (
  controller?: Partial<SuccessScreenController>,
) => {
  const { t } = useTranslation();
  const navigation = useNavigation<OwnerStackNavigationProp>();
  const route =
    useRoute<RouteProp<OwnerStackParamList, typeof ROUTES.NEW_RESERVATION>>();
  const dispatch = useDispatch<AppDispatch>();
  const contextData = useContext(GlobalContext);
  const isRTL = contextData?.isRTL ?? false;
  const reservationData = route.params?.reservationData;
  const routeSlotId = route.params?.slotId;
  const showSuccessScreen = useMemo(
    (): SuccessScreenController["showSuccessScreen"] | (() => void) =>
      controller?.showSuccessScreen ?? (() => {}),
    [controller?.showSuccessScreen],
  );
  const loading = useSelector(
    (state: RootState) => state.reservation.createLoading,
  );
  const metaLoading = useSelector(
    (state: RootState) => state.reservation.metaLoading,
  );
  const reservationTypes = useSelector(
    (state: RootState) => state.reservation.reservationMeta.reservationTypes,
  );
  const sourceTypes = useSelector(
    (state: RootState) => state.reservation.reservationMeta.reservationSources,
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
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);
  const timeSlots = useSelector(
    (state: RootState) => state.ownerTables.timeSlots,
  );
  const loadingTimeSlots = useSelector(
    (state: RootState) => state.ownerTables.loadingTimeSlots,
  );
  const reservationDate = useMemo(() => {
    if (!reservationData?.reservation_date) {
      return null;
    }

    return moment(
      reservationData.reservation_date,
      Date_Format.YYYY_MM_DD,
    ).toDate();
  }, [reservationData?.reservation_date]);
  const defaultSelectedDate = reservationDate ?? new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultSelectedDate,
  );
  const [lastVisibleDate, setLastVisibleDate] = useState(defaultSelectedDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [fullName, setFullName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileFieldError, setMobileFieldError] = useState<string | null>(null);
  const [reservationType, setReservationType] = useState<number | null>(null);
  const [source, setSource] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const displayDate = selectedDate ?? lastVisibleDate;

  useEffect(() => {
    dispatch(fetchReservationMeta());
  }, [dispatch]);

  useEffect(() => {
    const loadTimeSlots = async () => {
      await dispatch(clearTimeSlots());
      if (!ownerId || !sessionId || !selectedDate) {
        return;
      }

      try {
        await dispatch(
          fetchTimeSlots({
            p_owner_id: ownerId,
            p_session_id: sessionId,
            p_date: moment(selectedDate).format(Date_Format.YYYY_MM_DD),
          }),
        ).unwrap();
      } catch (error) {
        showToast("error", t("owner.newReservation.error.timeSlotError"));
        console.error("time slot error", error);
      }
    };
    loadTimeSlots();
  }, [dispatch, ownerId, sessionId, selectedDate, t]);

  const isCreateReservationDisabled = useMemo(() => {
    const parsedGuestCount = Number(guestCount);
    return (
      !fullName.trim() ||
      !guestCount.trim() ||
      Number.isNaN(parsedGuestCount) ||
      parsedGuestCount <= 0 ||
      !mobileNumber.trim() ||
      !!mobileFieldError ||
      !reservationType ||
      !source ||
      !selectedDate ||
      !selectedTimeSlot
    );
  }, [
    fullName,
    guestCount,
    mobileNumber,
    mobileFieldError,
    reservationType,
    source,
    selectedDate,
    selectedTimeSlot,
  ]);

  useEffect(() => {
    if (!reservationData) {
      return;
    }

    if (
      reservationDate &&
      (!selectedDate || !moment(selectedDate).isSame(reservationDate, "day"))
    ) {
      setSelectedDate(reservationDate);
    }

    setSelectedTimeSlot(routeSlotId || 0);

    if (
      reservationDate &&
      !moment(lastVisibleDate).isSame(reservationDate, "day")
    ) {
      setLastVisibleDate(reservationDate);
    }

    setFullName(reservationData?.customer_name);
    setGuestCount(String(reservationData.total_guest));
    setMobileNumber(reservationData.customer_phone);
    setMobileFieldError(null);
    setReservationType(
      reservationTypes.find(
        (item) => item.id === reservationData?.reservation_type_id,
      )?.id ?? null,
    );
    setSource(
      sourceTypes.find(
        (item) => item.id === reservationData.reservation_source_id,
      )?.id ?? null,
    );
    setNotes(reservationData.notes || "");
  }, [
    lastVisibleDate,
    reservationData,
    reservationDate,
    reservationTypes,
    routeSlotId,
    selectedDate,
    sourceTypes,
  ]);

  useEffect(() => {
    if (reservationData) {
      return;
    }

    if (reservationType === null && reservationTypes.length > 0) {
      setReservationType(reservationTypes[0].id);
    }

    if (source === null && sourceTypes.length > 0) {
      setSource(sourceTypes[0].id);
    }
  }, [reservationData, reservationType, reservationTypes, source, sourceTypes]);

  const monthYear = useMemo(() => {
    const month = displayDate.toLocaleDateString(Locales.EN_US, {
      month: "long",
    });
    const year = displayDate.getFullYear();
    return `${month} ${year}`;
  }, [displayDate]);

  const mobileErrorText = useMemo(() => {
    if (mobileFieldError === "required") {
      return t("auth.login.errors.mobileRequired");
    }

    if (mobileFieldError === "invalid") {
      return t("auth.login.errors.mobileInvalid");
    }

    return null;
  }, [mobileFieldError, t]);

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

  const handleSuccessGoBack = useCallback(() => {
    const reservationIdToPass = reservationData?.reservation_id;

    if (reservationData && reservationIdToPass) {
      navigation.reset({
        index: 1,
        routes: [
          {
            name: ROUTES.MAIN_TABS,
            params: {
              screen: ROUTES.RESERVATIONS,
            },
          },
          {
            name: ROUTES.RESERVATIONS_DETAILS,
            params: {
              reservationId: reservationIdToPass,
            },
          },
        ],
      });
      return;
    }
    navigation.goBack();
  }, [navigation, reservationData]);

  const handleCreateReservation = useCallback(async () => {
    if (
      isCreateReservationDisabled ||
      loading ||
      !selectedDate ||
      !selectedTimeSlot
    ) {
      return;
    }

    const validationError = getMobileValidationError(mobileNumber);

    if (validationError) {
      setMobileFieldError(validationError);
      return;
    }

    setMobileFieldError(null);
    const result = await dispatch(
      createReservation({
        customerName: fullName.trim(),
        customerPhone: mobileNumber.trim(),
        reservationDate: selectedDate,
        reservationTime: selectedTimeSlot,
        totalGuest: Number(guestCount),
        notes: notes.trim(),
        reservationTypeId: reservationType,
        reservationSourceId: source,
        reservationId: reservationData?.reservation_id,
      }),
    );

    if (createReservation.fulfilled.match(result)) {
      dispatch(markReservationListForRefresh());
      showSuccessScreen({
        title: t("owner.newReservation.successTitle", {
          status: reservationData
            ? t("common.updated")
            : t("common.successful"),
        }),
        subtitle: t("owner.newReservation.reservationCreatedSuccess", {
          name: fullName.trim(),
          status: reservationData ? t("common.updated") : "",
        }),
        onPress: handleSuccessGoBack,
      });
    }
  }, [
    dispatch,
    fullName,
    guestCount,
    isCreateReservationDisabled,
    loading,
    mobileNumber,
    notes,
    reservationData,
    reservationType,
    selectedDate,
    selectedTimeSlot,
    showSuccessScreen,
    source,
    t,
    handleSuccessGoBack,
  ]);

  const handleDateChanged = (value: Date | null) => {
    setSelectedDate(value);

    if (
      value &&
      reservationDate &&
      routeSlotId &&
      moment(value).isSame(reservationDate, "day")
    ) {
      setSelectedTimeSlot(routeSlotId);
      return;
    }

    setSelectedTimeSlot(null);
  };
  return {
    t,
    isRTL,
    navigation,
    selectedDate,
    setSelectedDate,
    setLastVisibleDate,
    monthYear,
    selectedTimeSlot,
    setSelectedTimeSlot,
    fullName,
    setFullName,
    guestCount,
    setGuestCount,
    mobileNumber,
    mobileErrorText,
    handleMobileChange,
    reservationTypes,
    reservationType,
    setReservationType,
    sourceTypes,
    source,
    setSource,
    notes,
    setNotes,
    COUNTRY_CODE,
    loadingTimeSlots,
    isCreateReservationDisabled,
    handleCreateReservation,
    loading,
    reservationData,
    metaLoading: metaLoading,
    timeSlots,
    routeSlotId,
    handleDateChanged,
  };
};
