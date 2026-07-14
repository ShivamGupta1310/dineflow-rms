import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TableGridItemData } from "@components/TableGridItem";
import { AppDispatch, RootState } from "@store";
import { fetchTableOrderDetails } from "@store/slices/waiterOrderSlice";
import { TableGridItemStatus } from "@utils/constants";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "@constants";

const OPENABLE_TABLE_STATUSES = [
  TableGridItemStatus.OCCUPIED,
];

export const canOpenWaiterOrderSheet = (status?: string | null) =>
  OPENABLE_TABLE_STATUSES.includes(
    status?.toLowerCase() as TableGridItemStatus,
  );

const useWaiterOrderSheet = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [orderSheetVisible, setOrderSheetVisible] = useState(false);

  const { orders, selectedTable } = useSelector(
    (state: RootState) => state.waiterOrder,
  );
  const orderLoading = useSelector((state: RootState) =>
    Boolean(state.waiterOrder?.loading),
  );

  const handleOrderSheetVisible = useCallback((visible: boolean) => {
    setOrderSheetVisible(visible);
  }, []);

  const handleTableSelection = useCallback(
    async (table: TableGridItemData) => {
      if (!canOpenWaiterOrderSheet(table?.status)) {
        return;
      }

      const resultAction = await dispatch(
        fetchTableOrderDetails({ tableId: table.table_id, table }),
      );

      if (fetchTableOrderDetails.fulfilled.match(resultAction)) {
        handleOrderSheetVisible(true);
      }
    },
    [dispatch, handleOrderSheetVisible],
  );

  const navigateToMenuScreen = useCallback(() => {
    handleOrderSheetVisible(false);
    navigation.navigate(ROUTES.TABLE_MENU);
  }, [navigation, handleOrderSheetVisible]);

  const navigateToGenerateBillScreen = useCallback(() => {
    handleOrderSheetVisible(false);
    navigation.navigate(ROUTES.BILL_GENERATION);
  }, [navigation, handleOrderSheetVisible]);

  return {
    orders,
    orderLoading,
    orderSheetVisible,
    selectedOrder: orders?.[0],
    selectedTable,
    setOrderSheetVisible: handleOrderSheetVisible,
    handleTableSelection,
    navigateToMenuScreen,
    navigateToGenerateBillScreen,
  };
};

export default useWaiterOrderSheet;
