import {
  MenuCategory,
  MenuCategoryType,
  MenuItem,
  MenuItemWithQuantity,
} from "@appTypes";
import { ROUTES } from "@constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppDispatch, RootState } from "@store";
import {
  clearItemsList,
  clearMenuConfigSelection,
  fetchMenuConfig,
  fetchMenuItems,
  setSelectedCategory,
  setSelectedFilter,
} from "@store/slices/waiterMenuSlice";
import {
  addItemToCart,
  clearOrder,
  clearOrderItems,
  removeItemFromCart,
} from "@store/slices/waiterOrderSlice";
import { showToast } from "@utils/toastHelper";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export const useMenu = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const dispatch = useDispatch<AppDispatch>();

  const {
    loading,
    filters,
    categories,
    items,
    selectedFilter,
    selectedCategory,
  } = useSelector((state: RootState) => state.waiterMenu);

  const { orderItems } = useSelector(
    (state: RootState) => state.waiterOrder,
  );

  useEffect(() => {
    if (filters.length === 0 || categories.length === 0) {
      dispatch(fetchMenuConfig());
    }
  }, [dispatch, filters.length, categories.length]);

  useEffect(() => {
    if (!selectedFilter && filters.length > 0) {
      dispatch(setSelectedFilter(filters[0]));
    }

    if (!selectedCategory && categories.length > 0) {
      dispatch(setSelectedCategory(categories[0]));
    }
  }, [dispatch, filters, categories, selectedFilter, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        dispatch(clearMenuConfigSelection());
        dispatch(clearItemsList());
      };
    }, [dispatch]),
  );

  useEffect(() => {
    dispatch(clearOrderItems());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory && selectedFilter) {
      dispatch(clearItemsList());
      dispatch(fetchMenuItems());
    }
  }, [dispatch, selectedCategory, selectedFilter]);

  const handleBack = useCallback(() => {
    dispatch(clearOrder());
    navigation.goBack();
  }, [navigation, dispatch]);

  const handleSearch = useCallback(() => {
    // To-do : Search food item in menu flow
    showToast("info", t("common.comingSoon"));
  }, [t]);

  const handleCategorySelection = useCallback(
    (category: MenuCategory) => {
      dispatch(setSelectedCategory(category));
    },
    [dispatch],
  );

  const handleOnToggleFilter = useCallback(
    (toggleValue: boolean) => {
      const nextKey = toggleValue
        ? MenuCategoryType.NON_VEG
        : MenuCategoryType.VEG;
      const filter = filters.find((item) => item.key === nextKey);
      if (filter) {
        dispatch(setSelectedFilter(filter));
      }
    },
    [dispatch, filters],
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

  const menuItemsWithQuantity: MenuItemWithQuantity[] = useMemo(() => {
    return items.map((item) => {
      const orderItem = orderItems.find((order) => order.id === item.id);
      return {
        ...item,
        quantity: orderItem?.quantity ?? 0,
      };
    });
  }, [items, orderItems]);

  const totalAddedItems = orderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleGoToOrderSummary = useCallback(() => {
    navigation.navigate(ROUTES.ORDER_SUMMARY);
  }, [navigation]);

  return {
    t,
    loading,
    filters,
    categories,
    items,
    menuItemsWithQuantity,
    totalAddedItems,
    selectedFilter,
    selectedCategory,
    handleOnToggleFilter,
    handleCategorySelection,
    handleAddItem,
    handleRemoveItem,
    handleBack,
    handleSearch,
    handleGoToOrderSummary,
  };
};
