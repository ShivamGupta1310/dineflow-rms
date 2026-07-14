import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";

import { AppButton, RNText, RNView } from "@components";
import { styles } from "./styles";
import { moderateScale, scaledSize } from "@utils/scale/scale";
import { Common_Values, TableOrderStatus } from "@utils/constants";
import { t } from "i18next";
import { CookingSVG, ServedSVG, SVGS, TableSVG } from "@assets";
import { colors } from "@theme/colors";
import { FoodPlaceholderIcon } from "@assets/svgXML";
import { OrderListSheetItem, OrderListSheetProps, SORT_STATUS_PRIORITY } from "@appTypes/orderListSheet.types";
import { AppDispatch } from "@store";
import { updateWaiterOrderStatus } from "@store/slices/waiterOrderSlice";
import { markOrderItemsServed } from "@utils";

const getDisplayStatus = (...statuses: Array<string | null | undefined>) => {
  const normalizedStatuses = statuses
    .map((status) => status?.toLowerCase?.() ?? "")
    .filter(Boolean);

  return (
    SORT_STATUS_PRIORITY.find((status) =>
      normalizedStatuses.includes(status),
    ) ?? TableOrderStatus.ORDER_PLACED
  );
};

const getStatusPriority = (item: OrderListSheetItem) => {
  const status = getDisplayStatus(item.item_status);
  const index = SORT_STATUS_PRIORITY.indexOf(
    status as (typeof SORT_STATUS_PRIORITY)[number],
  );

  return index === -1 ? SORT_STATUS_PRIORITY.length : index;
};

const OrderListSheet = ({
  visible,
  setOrderSheetVisible,
  tableNumber,
  orders,
  handleAddItemClick,
  handleGenerateBillClick,
}: OrderListSheetProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [displayOrders, setDisplayOrders] = useState(orders);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    setDisplayOrders(orders);
  }, [orders]);

  const onCloseSheet = () => {
    setOrderSheetVisible(false);
  };

  const handleBill = () => {
    onCloseSheet();
    handleGenerateBillClick();
  };

  const onAddItem = () => {
    onCloseSheet();
    handleAddItemClick();
  };

  const orderNumbersText = useMemo(() => {
    const orderNumbers = displayOrders
      .map((order) => order.order_number?.trim())
      .filter(Boolean);

    if (orderNumbers.length === 0) {
      return Common_Values.EMPTY_PLACEHOLDER;
    }

    return orderNumbers.map((orderNumber) => `#${orderNumber}`).join(", ");
  }, [displayOrders]);

  const orderItems = useMemo<OrderListSheetItem[]>(() => {
    return displayOrders
      .flatMap((order) =>
        order.items.map((item) => ({
          ...item,
          order_id: order.order_id,
          order_number: order.order_number,
          created_at: order.created_at,
        })),
      )
      .sort((a, b) => getStatusPriority(a) - getStatusPriority(b));
  }, [displayOrders]);

  const getItemDisplayStatus = (item: OrderListSheetItem) =>
    getDisplayStatus(item.item_status);

  const readyToServeItem = orderItems.filter(
    (item) => getItemDisplayStatus(item) === TableOrderStatus.READY,
  );

  const shouldShowGenerateBill =
    orderItems.length > 0 &&
    orderItems.every(
      (item) => getItemDisplayStatus(item) === TableOrderStatus.SERVED,
    );

  const renderStatusIcon = (status: string) => {
    const iconProps = {
      width: scaledSize(20),
      height: scaledSize(20),
    };
    switch (status) {
      case TableOrderStatus.ORDER_PLACED:
        return <TableSVG color={colors.statusReserved} {...iconProps} />;
      case TableOrderStatus.PREPARING:
        return (
          <SvgXml
            xml={CookingSVG}
            width={`${scaledSize(20)}`}
            height={`${scaledSize(20)}`}
          />
        );
      case TableOrderStatus.READY:
        return <SVGS.DeskBell {...iconProps} color={colors.vibrantGreen} />;
      case TableOrderStatus.SERVED:
        return (
          <SvgXml
            xml={ServedSVG}
            width={`${scaledSize(20)}`}
            height={`${scaledSize(20)}`}
          />
        );
      default:
        return <TableSVG color={colors.statusReserved} {...iconProps} />;
    }
  };

  const handleOrderStatusUpdate = async (orderId: number) => {
    if (updatingOrderId !== null) {
      return;
    }

    setUpdatingOrderId(orderId);

    try {
      const resultAction = await dispatch(updateWaiterOrderStatus({ orderId }));

      if (updateWaiterOrderStatus.fulfilled.match(resultAction)) {
        setDisplayOrders((currentOrders) =>
          markOrderItemsServed(currentOrders, resultAction.payload.orderId),
        );
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const renderItem = ({ item }: { item: OrderListSheetItem }) => {
    const itemStatus = getItemDisplayStatus(item);
    const isReadyItem = itemStatus === TableOrderStatus.READY;
    const isUpdatingItem = updatingOrderId === item.order_id;

    return (
      <RNView style={styles.itemRow}>
        <RNView style={styles.itemImageView}>
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={styles.itemImageView}
              resizeMode="cover"
            />
          ) : (
            <RNView style={styles.itemFood}>
              <SvgXml
                xml={FoodPlaceholderIcon}
                width={moderateScale(20)}
                height={moderateScale(20)}
              />
            </RNView>
          )}
        </RNView>
        <RNView style={styles.itemMainView}>
          <RNText style={styles.itemsNameText}>{item.item_name}</RNText>
          <RNText style={styles.itemsQtyText}>
            {t("waiter.order.qty")}: {item.quantity}
          </RNText>
        </RNView>
        <RNView style={styles.itemStatusContainer}>
          {isReadyItem ? (
            <Pressable
              disabled={updatingOrderId !== null}
              onLongPress={() => handleOrderStatusUpdate(item.order_id)}
              style={styles.statusActionButton}
              testID={`order-status-action-${item.order_id}-${item.order_item_id}`}
            >
              {isUpdatingItem ? (
                <ActivityIndicator
                  color={colors.primary}
                  testID={`order-status-loader-${item.order_id}`}
                />
              ) : (
                renderStatusIcon(itemStatus)
              )}
            </Pressable>
          ) : (
            renderStatusIcon(itemStatus)
          )}
        </RNView>
      </RNView>
    );
  };
  const itemSaparatorComponent = () => <RNView style={styles.divider} />;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCloseSheet}
      testID={"language-sheet"}
      statusBarTranslucent
    >
      <RNView style={styles.backdrop}>
        <TouchableOpacity onPress={onCloseSheet} style={styles.flex} />

        <SafeAreaView
          style={styles.container}
          edges={["bottom"]}
          testID="order-list-sheet-container"
        >
          <RNView style={styles.header}>
            <RNView style={styles.tableNumberContainer}>
              <RNText style={styles.title}>{tableNumber}</RNText>
            </RNView>
            <RNView style={styles.orderNumberContainer}>
              <RNText style={styles.billNumber} numberOfLines={2}>
                {orderNumbersText}
              </RNText>
            </RNView>
          </RNView>
          {readyToServeItem.length > 0 && (
            <RNView style={styles.readyToServeCount}>
              <SVGS.DeskBell stroke={colors.primaryText} />
              <RNText style={styles.readyToServeText}>
                {readyToServeItem.length} {t("waiter.order.itemReadyForServe")}
              </RNText>
            </RNView>
          )}

          <RNText style={styles.itemsText}>{t("waiter.order.items")}</RNText>

          <ScrollView
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={orderItems}
              renderItem={renderItem}
              contentContainerStyle={styles.itemListContentContainer}
              ItemSeparatorComponent={itemSaparatorComponent}
              scrollEnabled={false}
              ListEmptyComponent={
                <RNText style={styles.emptyText}>
                  {t("waiter.order.emptyOrder")}
                </RNText>
              }
            />
          </ScrollView>

          <RNView style={styles.bottomBtnContainer}>
            <AppButton
              style={styles.applyBtn}
              title={t("waiter.order.generateBill")}
              onPress={handleBill}
              variant="outlined"
              disabled={!shouldShowGenerateBill}
              textStyle={styles.btnTextStyle}
            />
            <AppButton
              style={styles.applyBtn}
              title={t("waiter.order.addItem")}
              onPress={onAddItem}
              textStyle={styles.btnTextStyle}
            />
          </RNView>
        </SafeAreaView>
      </RNView>
    </Modal>
  );
};

export default OrderListSheet;
