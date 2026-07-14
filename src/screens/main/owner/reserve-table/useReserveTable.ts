import { useCallback, useEffect, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { ROUTES } from "@constants";
import { Date_Format } from "@utils/constants";
import { showToast } from "@utils/toastHelper";
import type { CustomAlertController } from "../../../../hoc/withCustomAlert";
import type { SuccessScreenController } from "../../../../hoc/withSuccessScreen";
import {
  ReservationItem,
  ReservationDetail,
} from "@store/slices/reservationSlice";
import { OwnerStackParamList } from "@navigation/types";
import { AppDispatch, RootState } from "@store";
import {
  fetchTimeSlots,
  fetchAvailableTables,
  confirmReservationWithTable,
  AvailableTableResponseItem,
} from "@store/slices/ownerTablesSlice";

export const useReserveTable = (
  controller?: Partial<CustomAlertController & SuccessScreenController>,
) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<OwnerStackParamList, typeof ROUTES.RESERVE_TABLE>>();
  const item: ReservationItem | ReservationDetail = route.params?.item;
  const dispatch = useDispatch<AppDispatch>();

  const timeSlots = useSelector(
    (state: RootState) => state.ownerTables.timeSlots,
  );
  const availableTables = useSelector(
    (state: RootState) => state.ownerTables.availableTables,
  );
  const loadingTimeSlots = useSelector(
    (state: RootState) => state.ownerTables.loadingTimeSlots,
  );
  const loadingTables = useSelector(
    (state: RootState) => state.ownerTables.loadingAvailableTables,
  );
  const isSubmitting = useSelector(
    (state: RootState) => state.ownerTables.loadingConfirmReservation,
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

  const showSuccessScreen = controller?.showSuccessScreen;

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] =
    useState<AvailableTableResponseItem | null>(null);

  const loadTimeSlots = useCallback(async () => {
    if (!item?.reservation_date || !ownerId || !sessionId) return;
    try {
      const formattedDate = moment(item.reservation_date).format(
        Date_Format.YYYY_MM_DD,
      );
      const payload = {
        p_owner_id: ownerId,
        p_session_id: sessionId,
        p_date: formattedDate,
      };
      await dispatch(fetchTimeSlots(payload));
    } catch (error) {
      console.error("Error loading time slots:", error);
      showToast(
        "error",
        t("owner.reservation.reservedTable.failFetchAvailableSlot"),
      );
    }
  }, [item?.reservation_date, ownerId, sessionId, dispatch, t]);

  const fetchTables = useCallback(
    async (slotId: number) => {
      if (!item || !ownerId) return;
      try {
        const formattedDate = moment(item.reservation_date).format(
          Date_Format.YYYY_MM_DD,
        );
        const payload = {
          p_owner_id: ownerId,
          p_slot_id: slotId,
          p_guest_count: item.total_guest,
          p_date: formattedDate,
        };

        const resultAction = await dispatch(fetchAvailableTables(payload));

        if (fetchAvailableTables.fulfilled.match(resultAction)) {
          const fetchedTables = resultAction.payload;
          const matchedTable = fetchedTables.find(
            (tbl) =>
              tbl.table_id === (item as any).table_id ||
              tbl.table_number === (item as any).table_number,
          );

          if (matchedTable?.is_available) {
            setSelectedTable(matchedTable);
          } else {
            setSelectedTable(null);
          }
        } else {
          setSelectedTable(null);
        }
      } catch (error) {
        setSelectedTable(null);
        console.error("Error fetching available tables:", error);
        showToast(
          "error",
          t("owner.reservation.reservedTable.failFetchAvailableTable"),
        );
      }
    },
    [item, ownerId, dispatch, t],
  );

  useEffect(() => {
    loadTimeSlots();
  }, [loadTimeSlots]);

  useEffect(() => {
    if (timeSlots.length > 0 && !selectedSlotId) {
      const targetSlotId = (item as any)?.slot_id ?? (item as any)?.slot?.id;
      const matchedSlot = targetSlotId
        ? timeSlots.find((slot) => slot.slot_id === targetSlotId)
        : null;

      if (matchedSlot) {
        setSelectedSlotId(matchedSlot.slot_id);
      }
    }
  }, [timeSlots, selectedSlotId, item]);

  useEffect(() => {
    if (selectedSlotId) {
      fetchTables(selectedSlotId);
    }
  }, [selectedSlotId, fetchTables]);

  const handleTimeSlotSelect = (slotId: number) => {
    setSelectedSlotId(slotId);
  };

  const handleTableSelect = (table: AvailableTableResponseItem) => {
    setSelectedTable(table);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleReservedTablePress = async () => {
    if (!selectedSlotId || !selectedTable) {
      return;
    }

    try {
      const payload = {
        p_reservation_id: "id" in item ? item.id : item.reservation_id,
        p_table_id: selectedTable.table_id,
        p_slot_id: selectedSlotId,
      };
      const resultAction = await dispatch(confirmReservationWithTable(payload));

      if (confirmReservationWithTable.fulfilled.match(resultAction)) {
        if (showSuccessScreen) {
          showSuccessScreen({
            title: t("owner.reservation.reservedTable.successTitle"),
            subtitle: t("owner.reservation.reservedTable.successSubtitle", {
              name: item?.customer_name || "",
            }),
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ROUTES.MAIN_TABS,
                    params: {
                      screen: ROUTES.RESERVATIONS,
                    },
                  },
                ],
              });
            },
          });
        }
      }
    } catch (error) {
      console.error("Error confirming reservation:", error);
      showToast(
        "error",
        t("owner.reservation.reservedTable.failReservedTable"),
      );
    }
  };

  return {
    t,
    item,
    timeSlots,
    selectedSlotId,
    availableTables,
    selectedTable,
    loadingTimeSlots,
    loadingTables,
    isSubmitting,
    handleTimeSlotSelect,
    handleTableSelect,
    handleBack,
    handleReservedTablePress,
  };
};
