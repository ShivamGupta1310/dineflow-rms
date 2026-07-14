import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { BackHandler } from "react-native";

import { GlobalContext } from "../../../contexts/global.provider";
import { CustomAlertController } from "../../../hoc/withCustomAlert";
import { AppDispatch, RootState } from "@store";
import { StorageKeys } from "@utils/constants";
import { setRole } from "@store/slices/authSlice";
import {
  fetchWaiterList,
  setSelectedWaiter,
  WaiterStaff,
} from "@store/slices/authSlice";
import { unlinkRestaurant } from "@store/slices/waiterAuthSlice";
import { getItem, removeItem } from "@utils/storage";
import { showToast } from "@utils/toastHelper";
import { ROUTES } from "@constants/routes";

export type Staff = WaiterStaff;

const NUM_COLUMNS = 3;
const noop = () => {};

const getStoredWaiterPasscode = () => {
  const storedValue = getItem(StorageKeys.RESTAURANT_ACCESS_CODE);

  if (typeof storedValue === "number") {
    return storedValue;
  }

  if (typeof storedValue === "string") {
    const parsed = Number(storedValue);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const useWaiterList = (
  alertController?: Partial<CustomAlertController>,
) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const ownerId = useSelector((state: RootState) => state.auth.ownerId);
  const staffListData = useSelector(
    (state: RootState) => state.auth.waiterList,
  );
  const loading = useSelector(
    (state: RootState) => state.auth.waiterListLoading,
  );
  const error = useSelector((state: RootState) => state.auth.waiterListError);
  const unlinkLoading = useSelector(
    (state: RootState) => state.waiterAuth.loading,
  );
  const contextData = useContext(GlobalContext);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const isRTL = contextData?.isRTL ?? false;
  const showAlert = alertController?.showAlert ?? noop;
  const hideAlert = alertController?.hideAlert ?? noop;
  const storedOwnerAccessCode = getItem(StorageKeys.RESTAURANT_ACCESS_CODE);

  useEffect(() => {
    const passcode = getStoredWaiterPasscode();

    if (passcode === null) {
      return;
    }

    const waiterListPayload = {
      passcode: Number(storedOwnerAccessCode),
      role: "Captain",
    };
    dispatch(fetchWaiterList(waiterListPayload));
  }, [dispatch, storedOwnerAccessCode]);

  const getFullName = useCallback(
    (staff: Staff) => `${staff.first_name} ${staff.last_name}`,
    [],
  );

  const handleSelect = useCallback((id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedId) return;

    const selected = staffListData.find(
      (staff) => staff.staff_id === selectedId,
    );
    dispatch(setSelectedWaiter(selected ?? null));
    navigation.navigate(ROUTES.WAITER_PASSCODE);
  }, [dispatch, navigation, selectedId, staffListData]);

  const handleConfiremd = useCallback(async () => {
    if (!ownerId) return;
    const result = await dispatch(
      unlinkRestaurant({
        owner_id: ownerId,
        role: "Captain",
      }),
    );

    if (unlinkRestaurant.fulfilled.match(result) && result.payload.success) {
      removeItem(StorageKeys.RESTAURANT_ACCESS_CODE);
      dispatch(setRole(null));
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.LOGIN }],
      });
      return;
    }

    if (unlinkRestaurant.rejected.match(result)) {
      showToast(
        "error",
        t("auth.onBoarding.verificationFailedTitle"),
        typeof result.payload === "string"
          ? result.payload
          : t("common.unknownError"),
      );
    }
  }, [dispatch, navigation, t, ownerId]);

  const handleUnlink = useCallback(() => {
    setSelectedId(null);
    showAlert({
      title: t("waiter.waiterList.unlinkWaiterTitle"),
      subtitle: t("waiter.waiterList.unlinkWaiterSubtitle"),
      onOk: handleConfiremd,
      onCancel: hideAlert,
    });
  }, [handleConfiremd, hideAlert, showAlert, t]);

  const showExitConfirmation = useCallback(() => {
    showAlert({
      title: t("waiter.waiterList.exitConfirmTitle"),
      subtitle: t("waiter.waiterList.exitConfirmSubtitle"),
      onOk: () => BackHandler.exitApp(),
      onCancel: hideAlert,
    });
  }, [hideAlert, showAlert, t]);

  const handleBackPress = useCallback(() => {
    showExitConfirmation();
    return true;
  }, [showExitConfirmation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress,
      );

      return () => subscription.remove();
    }, [handleBackPress]),
  );

  const paddedList = useMemo<(Staff | null)[]>(() => {
    const remainder = staffListData.length % NUM_COLUMNS;

    if (remainder === 0) {
      return staffListData;
    }

    const padding = NUM_COLUMNS - remainder;
    return [...staffListData, ...Array.from({ length: padding }, () => null)];
  }, [staffListData]);

  return {
    t,
    loading,
    unlinkLoading,
    error,
    isRTL,
    staffList: paddedList,
    selectedId,
    NUM_COLUMNS,
    getFullName,
    handleSelect,
    handleContinue,
    handleUnlink,
    handleBackPress,
  };
};
