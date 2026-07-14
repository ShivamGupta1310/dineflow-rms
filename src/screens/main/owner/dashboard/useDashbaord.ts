import moment from "moment";
import { useCallback, useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "@store";
import { fetchOwnerDashboard } from "@store/slices/ownerDashboardSlice";
import { fetchOwnerTables } from "@store/slices/ownerTablesSlice";
import { clearAppSession } from "@utils/authSession";
import { showToast } from "@utils/toastHelper";
import { getItem } from "@utils/storage";
import { StorageKeys, TableGridItemStatus } from "@utils/constants";
import type { CustomAlertController } from "../../../../hoc/withCustomAlert";
import { ROUTES } from "@constants";

import { GlobalContext } from "../../../../contexts/global.provider";
import { TableGridItemData } from "@components/TableGridItem";

const noop = () => {};

export type DashboardTrendVariant = "profit" | "loss";

export interface DashboardSummary {
  title: string;
  amount: string;
  change: number;
  period: string;
  variant: DashboardTrendVariant;
}

export interface DashboardStat {
  title: string;
  value: string;
  change: number;
  variant: DashboardTrendVariant;
}

export interface DashboardActiveTable {
  id: string;
  tableLabel: string;
  guestCount: string;
  startedAt: string;
  highlighted: boolean;
}
export const useDashbaord = (
  alertController?: Partial<CustomAlertController>,
) => {
  const currentDate = moment();
  const { t } = useTranslation();
  const contextData = useContext(GlobalContext);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [chartApproach, setChartApproach] = useState<"custom" | "gifted">("custom");
  const isRTL = contextData?.isRTL ?? false;

  const todayDate = {
    day: currentDate.format("D"),
    suffix: currentDate.format("Do").replace(currentDate.format("D"), ""),
    monthYear: isRTL
      ? currentDate.format("YYYY MMMM")
      : currentDate.format("MMMM YYYY"),
  };

  const ownerDashboardData = useSelector(
    (state: RootState) => state.ownerDashboard.data,
  );
  const tableLoader = useSelector(
    (state: RootState) => state.ownerTables.loading,
  );
  const ownerTablesData = useSelector(
    (state: RootState) => state.ownerTables?.tables ?? [],
  );
  const showAlert = alertController?.showAlert ?? noop;
  const hideAlert = alertController?.hideAlert ?? noop;

  const ownerAccessCode = useMemo(
    () => String(getItem(StorageKeys.OWNER_ACCESS_CODE) ?? ""),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchOwnerDashboard());
      dispatch(fetchOwnerTables());
    }, [dispatch]),
  );

  const getTrendVariant = useCallback(
    (trend?: string): DashboardTrendVariant =>
      trend === "DOWN" ? "loss" : "profit",
    [],
  );

  const dashboardSummary = useMemo<DashboardSummary>(
    () => ({
      title: t("owner.dashboard.summary.salesTitle"),
      amount: `₹ ${ownerDashboardData?.sales?.amount || 0}`,
      change: ownerDashboardData?.sales?.change_percentage || 0,
      period: t("owner.dashboard.summary.periodThisWeek"),
      variant: ownerDashboardData
        ? getTrendVariant(ownerDashboardData.sales.trend)
        : "profit",
    }),
    [getTrendVariant, ownerDashboardData, t],
  );

  const dashboardStats = useMemo<DashboardStat[]>(
    () => [
      {
        title: t("owner.dashboard.stats.reservedTable"),
        value: String(ownerDashboardData?.reservations?.count || 0),
        change: ownerDashboardData?.reservations?.change_percentage || 0,
        variant: ownerDashboardData
          ? getTrendVariant(ownerDashboardData?.reservations?.trend)
          : "profit",
      },
      {
        title: t("owner.dashboard.stats.availableTables"),
        value: String(ownerDashboardData?.tables?.available ?? 0),
        change: ownerDashboardData?.tables?.occupied || 0,
        variant: ownerDashboardData?.tables.occupied ? "loss" : "profit",
      },
      {
        title: t("owner.dashboard.stats.totalOrders"),
        value: String(ownerDashboardData?.orders.count ?? 0),
        change: ownerDashboardData?.orders?.change_percentage || 0,
        variant: ownerDashboardData
          ? getTrendVariant(ownerDashboardData.orders.trend)
          : "profit",
      },
    ],
    [getTrendVariant, ownerDashboardData, t],
  );

  const handleLogoutConfirmed = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await clearAppSession();
    } catch (error) {
      showToast(
        "error",
        t("auth.logout"),
        error instanceof Error ? error.message : t("common.unknownError"),
      );
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, t]);

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
    (table: TableGridItemData) => {
      if (table.status?.toLowerCase() === TableGridItemStatus.READY_TO_PAY) {
        navigation.navigate(ROUTES.BILL_SUMMARY, { tableId: table.table_id });
      }
    },
    [navigation],
  );
  return {
    t,
    isRTL,
    todayDate,
    isLoggingOut,
    dashboardSummary,
    dashboardStats,
    ownerTablesData,
    ownerAccessCode,
    tableLoader,
    handleLogout,
    handleViewAllPress,
    handleTablePress,
    chartApproach,
    setChartApproach,
    salesRevenue: ownerDashboardData?.sales_revenue,
  };
};
