import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { GlobalContext } from "../../../../contexts/global.provider";
import { AppDispatch, RootState } from "@store";
import { colors } from "@theme/colors";
import { fetchOwnerTables } from "@store/slices/ownerTablesSlice";
import { showToast } from "@utils/toastHelper";
import { ROUTES } from "@constants/routes";
import { TableGridItemStatus } from "@utils/constants";
import { TableGridItemData } from "@components/TableGridItem";

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
  const tables = useSelector(
    (state: RootState) => state.ownerTables.tables,
  ) as TableGridItemData[];
  const loading = useSelector((state: RootState) => state.ownerTables.loading);

  const fetchTables = useCallback(() => {
    dispatch(fetchOwnerTables());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchTables();
    }, [fetchTables]),
  );

  const getStatusCount = (status: string) =>
    tables.filter((table) => table.status?.toLowerCase() === status).length;

  const statusGuideCards: StatusGuideCard[] = [
    {
      id: "available",
      title: t("owner.tables.available"),
      description: t("owner.tables.availableDesc"),
      backgroundColor: colors.statusAvailableBG,
      iconColor: colors.statusAvailable,
      testID: "status-guide-card-available",
    },
    {
      id: "occupied",
      title: t("owner.tables.occupied"),
      description: t("owner.tables.occupiedDesc"),
      backgroundColor: colors.statusOccupiedBG,
      iconColor: colors.statusOccupied,
      testID: "status-guide-card-occupied",
    },
    {
      id: "reserved",
      title: t("owner.tables.reserved"),
      description: t("owner.tables.reservedDesc"),
      backgroundColor: colors.statusReservedBG,
      iconColor: colors.statusReserved,
      testID: "status-guide-card-reserved",
    },
    {
      id: "ready-to-pay",
      title: t("owner.tables.readyToPay"),
      description: t("owner.tables.readyToPayDesc"),
      backgroundColor: colors.statusReadyToPayBG,
      iconColor: colors.statusReadyToPay,
      testID: "status-guide-card-ready-to-pay",
    },
  ];

  const tabs = [
    {
      id: "1",
      title: t("owner.tables.all"),
      status: "all",
      count: tables.length,
      activeBorderColor: colors.primary,
    },
    {
      id: "2",
      title: t("owner.tables.available"),
      status: TableGridItemStatus.AVAILABLE,
      count: getStatusCount(TableGridItemStatus.AVAILABLE),
      dotColor: colors.statusAvailable,
      activeBorderColor: colors.statusAvailable,
      activeBackgroundColor: colors.statusAvailableBG,
    },
    {
      id: "3",
      title: t("owner.tables.occupied"),
      status: TableGridItemStatus.OCCUPIED,
      count: getStatusCount(TableGridItemStatus.OCCUPIED),
      dotColor: colors.statusOccupied,
      activeBorderColor: colors.statusOccupied,
      activeBackgroundColor: colors.statusOccupiedBG,
    },
    {
      id: "4",
      title: t("owner.tables.reserved"),
      status: TableGridItemStatus.RESERVED,
      count: getStatusCount(TableGridItemStatus.RESERVED),
      dotColor: colors.statusReserved,
      activeBorderColor: colors.statusReserved,
      activeBackgroundColor: colors.statusReservedBG,
    },
    {
      id: "5",
      title: t("owner.tables.readyToPay"),
      status: TableGridItemStatus.READY_TO_PAY,
      count: getStatusCount(TableGridItemStatus.READY_TO_PAY),
      dotColor: colors.statusReadyToPay,
      activeBorderColor: colors.statusReadyToPay,
      activeBackgroundColor: colors.statusReadyToPayBG,
    },
  ];

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    return dispatch(fetchOwnerTables()).finally(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

  const handleTablePress = useCallback(
    (table: TableGridItemData) => {
      if (table.status?.toLowerCase() === TableGridItemStatus.READY_TO_PAY) {
        navigation.navigate(ROUTES.BILL_SUMMARY, { tableId: table.table_id });
      }
    },
    [navigation],
  );

  const handleSearchClick = async () => {
    showToast("info", t("common.comingSoon"));
  };

  const handleFilterClick = () => {
    showToast("info", t("common.comingSoon"));
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
    handleFilterClick,
  };
};

export default useTableList;
