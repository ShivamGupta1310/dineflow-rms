import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { GlobalContext } from "../../../../contexts/global.provider";
import { AppDispatch, RootState } from "@store";
import { colors } from "@theme/colors";
import type { TableGridItemData } from "@components/TableGridItem";
import { showToast } from "@utils/toastHelper";
import { STATUS_ALL, TableGridItemStatus } from "@utils/constants";
import { fetchWaiterTables, type WaiterTable } from "@store/slices/waiterTablesSlice";
import useWaiterOrderSheet from "../useWaiterOrderSheet";
import { ROUTES } from "@constants";
import {
  setSelectedTableData,
  setTableOrderSession,
} from "@store/slices/waiterOrderSlice";

export type StatusGuideCard = {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  iconColor: string;
  testID: string;
};

const useTableList = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const contextData = useContext(GlobalContext);
  const dispatch = useDispatch<AppDispatch>();
  const isRTL = contextData?.isRTL ?? false;
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const {
    orders,
    orderLoading,
    orderSheetVisible,
    selectedOrder,
    selectedTable,
    setOrderSheetVisible,
    handleTableSelection,
    navigateToMenuScreen,
    navigateToGenerateBillScreen,
  } = useWaiterOrderSheet();
  const tables = useSelector(
    (state: RootState) => state.waiterTables.tables,
  ) as TableGridItemData[];
  const tableLoading = useSelector(
    (state: RootState) => state.waiterTables.loading,
  );
  const loading = tableLoading || orderLoading;
  const getStatusCount = (status: string) =>
    tables.filter((table) => table.status?.toLowerCase() === status).length;

  const statusGuideCards: StatusGuideCard[] = [
    {
      id: "available",
      title: t("waiter.tables.available"),
      description: t("waiter.tables.availableDesc"),
      backgroundColor: colors.statusAvailableBG,
      iconColor: colors.statusAvailable,
      testID: "status-guide-card-available",
    },
    {
      id: "occupied",
      title: t("waiter.tables.occupied"),
      description: t("waiter.tables.occupiedDesc"),
      backgroundColor: colors.statusOccupiedBG,
      iconColor: colors.statusOccupied,
      testID: "status-guide-card-occupied",
    },
    {
      id: "reserved",
      title: t("waiter.tables.reserved"),
      description: t("waiter.tables.reservedDesc"),
      backgroundColor: colors.statusReservedBG,
      iconColor: colors.statusReserved,
      testID: "status-guide-card-reserved",
    },
    {
      id: "ready-to-pay",
      title: t("waiter.tables.readyToPay"),
      description: t("waiter.tables.readyToPayDesc"),
      backgroundColor: colors.statusReadyToPayBG,
      iconColor: colors.statusReadyToPay,
      testID: "status-guide-card-ready-to-pay",
    },
  ];

  const tabs = [
    {
      id: "1",
      title: t("waiter.tables.all"),
      status: STATUS_ALL,
      count: tables.length,
      activeBorderColor: colors.primary,
    },
    {
      id: "2",
      title: t("waiter.tables.available"),
      status: TableGridItemStatus.AVAILABLE,
      count: getStatusCount(TableGridItemStatus.AVAILABLE),
      dotColor: colors.statusAvailable,
      activeBorderColor: colors.statusAvailable,
      activeBackgroundColor: colors.statusAvailableBG,
    },
    {
      id: "3",
      title: t("waiter.tables.occupied"),
      status: TableGridItemStatus.OCCUPIED,
      count: getStatusCount(TableGridItemStatus.OCCUPIED),
      dotColor: colors.statusOccupied,
      activeBorderColor: colors.statusOccupied,
      activeBackgroundColor: colors.statusOccupiedBG,
    },
    {
      id: "4",
      title: t("waiter.tables.reserved"),
      status: TableGridItemStatus.RESERVED,
      count: getStatusCount(TableGridItemStatus.RESERVED),
      dotColor: colors.statusReserved,
      activeBorderColor: colors.statusReserved,
      activeBackgroundColor: colors.statusReservedBG,
    },
    {
      id: "5",
      title: t("waiter.tables.readyToPay"),
      status: TableGridItemStatus.READY_TO_PAY,
      count: getStatusCount(TableGridItemStatus.READY_TO_PAY),
      dotColor: colors.statusReadyToPay,
      activeBorderColor: colors.statusReadyToPay,
      activeBackgroundColor: colors.statusReadyToPayBG,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchWaiterTables());
    }, [dispatch]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    return dispatch(fetchWaiterTables()).finally(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

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

  const handleSearchClick = async () => {
    showToast("info", t("common.comingSoon"));
  };

  const getStatusTitle = (status: string): string => {
    return tabs.find((tab) => tab.status === status)?.title ?? status;
  };

  return {
    t,
    navigation,
    isRTL,
    loading,
    selectedStatus,
    setSelectedStatus,
    tables,
    tabs,
    statusGuideCards,
    refreshing,
    handleRefresh,
    handleTablePress,
    handleSearchClick,
    getStatusTitle,
    orderSheetVisible,
    setOrderSheetVisible,
    orders,
    selectedOrder,
    selectedTable,
    navigateToMenuScreen,
    navigateToGenerateBillScreen,
  };
};

export default useTableList;
