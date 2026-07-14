import { ROUTES } from "@constants";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MenuItem } from "@appTypes";
import { WaiterStackParamList } from "@navigation/types";
import { AppDispatch, RootState } from "@store";
import {
  addItemToCart,
  createWaiterOrder,
  removeItemFromCart,
  setTableOrderSession,
  updateTableOrderSessionDraft,
} from "@store/slices/waiterOrderSlice";
import { showToast } from "@utils/toastHelper";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWaiterTables,
  type WaiterTable,
} from "@store/slices/waiterTablesSlice";
import type { TableGridItemData } from "@components/TableGridItem";


const getMobileValidationError = (mobileNumber: string) => {
  if (!mobileNumber.trim()) {
    return "required";
  }

  if (!/^\d+$/.test(mobileNumber) || mobileNumber.length !== 10) {
    return "invalid";
  }

  return null;
};

export const useOrderSummary = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<WaiterStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const [mobileFieldError, setMobileFieldError] = useState<string | null>(null);

  const { selectedTable, tableSession, orderItems, loading } = useSelector(
    (state: RootState) => state.waiterOrder,
  );
  const fullName = tableSession?.customerName ?? "";
  const mobileNumber = tableSession?.customerMobile ?? "";
  const notes = tableSession?.notes ?? "";

  const tables = useSelector(
    (state: RootState) => state.waiterTables?.tables ?? [],
  ) as TableGridItemData[];
  const tableLoading = useSelector(
    (state: RootState) => state.waiterTables?.loading ?? false,
  );

  const [tableSheetVisible, setTableSheetVisible] = useState(false);

  const handleOpenTableSheet = useCallback(() => {
    dispatch(fetchWaiterTables());
    setTableSheetVisible(true);
  }, [dispatch]);

  const handleSelectTable = useCallback(
    (table: TableGridItemData) => {
      dispatch(
        setTableOrderSession({
          table: table as WaiterTable,
          session: tableSession,
        }),
      );
      setMobileFieldError(null);
      setTableSheetVisible(false);
    },
    [dispatch, tableSession],
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const mobileErrorText = useMemo(() => {
    if (mobileFieldError === "required") {
      return t("auth.login.errors.mobileRequired");
    }

    if (mobileFieldError === "invalid") {
      return t("auth.login.errors.mobileInvalid");
    }

    return null;
  }, [mobileFieldError, t]);

  const setFullName = useCallback(
    (value: string) => {
      dispatch(updateTableOrderSessionDraft({ customerName: value, updatedCustomerName: true }));
    },
    [dispatch],
  );

  const setNotes = useCallback(
    (value: string) => {
      dispatch(updateTableOrderSessionDraft({ notes: value}));
    },
    [dispatch],
  );

  const handleMobileChange = useCallback(
    (value: string) => {
      const onlyDigits = value.replace(/\D/g, "");

      dispatch(updateTableOrderSessionDraft({ customerMobile: onlyDigits,  updatedCustomerMobileNumber: true  }));

      if (mobileFieldError) {
        setMobileFieldError(null);
      }
    },
    [dispatch, mobileFieldError],
  );

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      dispatch(addItemToCart(item));
    },
    [dispatch],
  );

  const handleRemoveItem = useCallback(
    (item: MenuItem) => {
      dispatch(removeItemFromCart(item));
    },
    [dispatch],
  );

  const isConfirmOrderDisabled = useMemo(() => {
    return (
      !fullName.trim() ||
      !!getMobileValidationError(mobileNumber) ||
      !selectedTable ||
      orderItems.length === 0
    );
  }, [fullName, mobileNumber, orderItems.length, selectedTable]);

  const handleConfirmedOrder = useCallback(async () => {
    const validationError = getMobileValidationError(mobileNumber);

    if (!fullName.trim() || !selectedTable) {
      return;
    }

    if (validationError) {
      setMobileFieldError(validationError);
      return;
    }

    setMobileFieldError(null);

    const resultAction = await dispatch(
      createWaiterOrder({
        tableId: selectedTable.table_id,
        customerName: fullName.trim(),
        customerMobile: mobileNumber.trim(),
        notes: notes.trim(),
        items: orderItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      }),
    );

    if (
      createWaiterOrder.fulfilled.match(resultAction) &&
      resultAction.payload.success
    ) {
      navigation.reset({
        index: 1,
        routes: [
          {
            name: ROUTES.MAIN_TABS,
            params: {
              screen: ROUTES.TABLES,
            },
          },
          {
            name: ROUTES.ORDER_CONFIRMED,
            params: {
              orderId: resultAction.payload.order_id,
              orderNumber: resultAction.payload.order_number,
              tableNumber: selectedTable.table_number,
              placedAt: new Date().toISOString(),
              fullName: fullName.trim(),
              mobileNumber: mobileNumber.trim(),
              orderItems,
            },
          },
        ],
      });
    }
  }, [
    dispatch,
    fullName,
    mobileNumber,
    navigation,
    notes,
    orderItems,
    selectedTable,
  ]);

  const handleEditOrder = useCallback(() => {
    // To-do : Search food item in menu flow
    showToast("info", t("common.comingSoon"));
  }, [t]);

  return {
    t,
    loading,
    selectedTable,
    orderItems,
    fullName,
    setFullName,
    notes,
    setNotes,
    mobileNumber,
    mobileErrorText,
    handleMobileChange,
    handleAddItem,
    handleRemoveItem,
    isConfirmOrderDisabled,
    handleBack,
    handleConfirmedOrder,
    handleEditOrder,
    tables,
    tableSheetVisible,
    setTableSheetVisible,
    handleOpenTableSheet,
    handleSelectTable,
    tableLoading,
  };
};
