import { useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { IMAGES } from "@assets";
import { GlobalContext } from "../../../../contexts/global.provider";
import type { CustomAlertController } from "../../../../hoc/withCustomAlert";
import { AppDispatch, RootState } from "@store";
import { clearAppSession } from "@utils/authSession";
import { showToast } from "@utils/toastHelper";

import { DashboardUser } from "@appTypes";
import {
  Common_Values,
  TableGridItemStatus,
  User_Role,
} from "@utils/constants";
import { fetchWaiterTables, type WaiterTable } from "@store/slices/waiterTablesSlice";
import { fetchWaiterDashboard } from "@store/slices/waiterDashboardSlice";
import { getSortedWaiterActiveTables } from "@utils";
import { ROUTES } from "@constants";
import useWaiterOrderSheet from "../useWaiterOrderSheet";
import {
  setSelectedTableData,
  setTableOrderSession,
} from "@store/slices/waiterOrderSlice";
import { TableGridItemData } from "@components/TableGridItem";

const noop = () => {};

export const useDashbaord = (
  alertController?: Partial<CustomAlertController>,
) => {
  const { t } = useTranslation();
  const contextData = useContext(GlobalContext);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const authUser = useSelector(
    (state: RootState) => state.auth.user,
  ) as DashboardUser | null;
  const {
    orders,
    orderLoading,
    orderSheetVisible,
    selectedOrder,
    selectedTable,
    setOrderSheetVisible,
    handleTableSelection,
    navigateToMenuScreen,
    navigateToGenerateBillScreen
  } = useWaiterOrderSheet();
  const dashboardLoader = useSelector(
    (state: RootState) =>
      state.waiterTables.loading ||
      state.waiterDashboard.loading ||
      orderLoading,
  );
  const dashboardData = useSelector(
    (state: RootState) => state.waiterDashboard.data,
  );
  const waiterTablesData = useSelector(
    (state: RootState) => state.waiterTables?.tables ?? [],
  );

  const showAlert = alertController?.showAlert ?? noop;
  const hideAlert = alertController?.hideAlert ?? noop;
  const isRTL = Boolean(contextData?.isRTL);

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchWaiterDashboard());
      dispatch(fetchWaiterTables());
    }, [dispatch]),
  );

  const activeTables = useMemo(
    () =>
      waiterTablesData?.length > 0
        ? getSortedWaiterActiveTables(waiterTablesData)
        : [],
    [waiterTablesData],
  );

  const headerName = useMemo(
    () => authUser?.first_name?.trim() ?? Common_Values.EMPTY_PLACEHOLDER,
    [authUser?.first_name],
  );
  const headerTitle = useMemo(
    () => t("waiter.dashboard.header.greeting", { name: headerName }),
    [headerName, t],
  );
  const headerSubtitle = useMemo(
    () =>
      authUser?.role === User_Role.CAPTAIN
        ? t("waiter.dashboard.header.role")
        : Common_Values.EMPTY_PLACEHOLDER,
    [t, authUser?.role],
  );

  const avatarSource = useMemo(
    () => (authUser?.avatar ? { uri: authUser.avatar } : IMAGES.userAvatar),
    [authUser?.avatar],
  );

  const handleLogoutConfirmed = useCallback(async () => {
    if (isLoading || dashboardLoader) {
      return;
    }

    try {
      setIsLoading(true);
      await clearAppSession();
    } catch (error) {
      showToast(
        "error",
        t("auth.logout"),
        error instanceof Error ? error.message : t("common.unknownError"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, dashboardLoader, t]);

  const handleLogout = useCallback(() => {
    showAlert({
      title: t("auth.logoutConfirmation.title"),
      subtitle: t("auth.logoutConfirmation.subtitle"),
      onOk: handleLogoutConfirmed,
      onCancel: hideAlert,
    });
  }, [handleLogoutConfirmed, hideAlert, showAlert, t]);

  const handleViewAllPress = () => {
    navigation.navigate(ROUTES.TABLES);
  };

  const handleTablePress = useCallback(
    async (table: TableGridItemData) => {
      if (table.status === TableGridItemStatus.AVAILABLE) {
        dispatch(setSelectedTableData(table));
        navigation.navigate(ROUTES.TABLE_MENU);
        return;
      }

      if (table.status === TableGridItemStatus.RESERVED) {
        dispatch(
          setTableOrderSession({
            table: table as WaiterTable,
            session: null,
          }),
        );
        navigation.navigate(ROUTES.TABLE_MENU);
        return;
      }

      await handleTableSelection(table);
    },
    [dispatch, navigation, handleTableSelection],
  );

  return {
    t,
    isRTL,
    isLoading,
    dashboardLoader,
    headerTitle,
    headerSubtitle,
    avatarSource,
    dashboardData,
    activeTables,
    orderSheetVisible,
    selectedOrder,
    selectedTable,
    orders,
    setOrderSheetVisible,
    handleTablePress,
    handleLogout,
    handleViewAllPress,
    navigateToMenuScreen,
    navigateToGenerateBillScreen
  };
};
