import React from "react";
import {
  AppButton,
  AppLoader,
  AppTextInput,
  Header,
  OrderItemCard,
  QuantitySelector,
  RNText,
  RNView,
} from "@components";
import { useOrderSummary } from "./useOrderSummary";
import styles from "./styles";
import { SVGS, TableSVG } from "@assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable } from "react-native";
import { colors } from "@theme/colors";
import {
  KeyboardBottomOffset,
  scaledSize,
  verticalScale,
} from "@utils/scale/scale";
import { MenuItemWithQuantity } from "@appTypes";
import { TableSelectionSheet } from "@components";
import { Common_Values } from "@utils/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const { Backlogo, IndiaFlag } = SVGS;

const OrderSummaryScreen = () => {
  const {
    t,
    selectedTable,
    loading,
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
    handleConfirmedOrder,
    handleBack,
    tables,
    tableSheetVisible,
    setTableSheetVisible,
    handleOpenTableSheet,
    handleSelectTable,
    tableLoading,
  } = useOrderSummary();

  const itemSaparatorComponent = () => <RNView style={styles.divider} />;

  const renderItem = ({ item }: { item: MenuItemWithQuantity }) => (
    <OrderItemCard
      itemName={item.name}
      description={item.description}
      imageUrl={item.image_url}
      trailingComponent={
        <QuantitySelector
          quantity={item.quantity}
          onAdd={() => handleAddItem(item)}
          onRemove={() => handleRemoveItem(item)}
        />
      }
    />
  );

  const renderGuestdetail = () => {
    return (
      <RNView style={styles.guestDetailsContainer}>
        <AppTextInput
          label={t("owner.newReservation.fullName")}
          placeholder={t("owner.newReservation.enterFullName")}
          value={fullName}
          onChangeText={setFullName}
          labelStyle={styles.inputLabelStyle}
          inputContainerStyle={styles.inputViewContainer}
        />
        <AppTextInput
          label={t("owner.newReservation.mobile")}
          placeholder={t("owner.newReservation.enterMobileNumber")}
          keyboardType="number-pad"
          maxLength={10}
          value={mobileNumber}
          onChangeText={handleMobileChange}
          error={mobileErrorText ?? undefined}
          leftAccessory={
            <RNView style={styles.flagContainer}>
              <IndiaFlag height={verticalScale(20)} width={verticalScale(20)} />
            </RNView>
          }
          prefix={`+${Common_Values.COUNTRY_CODE}`}
          prefixContainerStyle={styles.mobilePrefixView}
          labelStyle={styles.inputLabelStyle}
          inputContainerStyle={[
            styles.inputViewContainer,
            styles.mobileInputSpacing,
          ]}
        />
        <AppTextInput
          label={t("waiter.order.specialNotesOptional")}
          placeholder={t("owner.newReservation.addSpecialNotes")}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          labelStyle={styles.inputLabelStyle}
          inputContainerStyle={[
            styles.inputViewContainer,
            styles.notesInputContainer,
          ]}
        />
      </RNView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {loading && <AppLoader />}

      <Header
        title={t("waiter.order.orderSummary")}
        leftAction={{
          icon: <Backlogo />,
          onPress: handleBack,
          accessibilityLabel: t("common.back"),
          containerStyle: styles.headerAction,
        }}
        containerStyle={styles.headerContainer}
        contentStyle={styles.headerContent}
      />

      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={KeyboardBottomOffset}
      >
        <RNView style={styles.container}>
          <RNView style={styles.content}>
            <RNView style={styles.tableDetailViewContainer}>
              <RNView style={styles.tableDetailLeftView}>
                <RNView style={styles.tableIconContainer}>
                  <TableSVG
                    color={colors.primaryText}
                    height={scaledSize(20)}
                    width={scaledSize(20)}
                  />
                </RNView>
                {selectedTable && (
                  <RNView style={styles.tableDetailContainer}>
                    <RNText style={styles.textTableDetail}>
                      {selectedTable.table_number}
                    </RNText>
                    <RNText style={styles.textGuestCount}>
                      {t("waiter.order.guest", {
                        count: selectedTable.capacity,
                      })}
                    </RNText>
                  </RNView>
                )}
              </RNView>

              <Pressable onPress={handleOpenTableSheet}>
                <RNText style={styles.textChangeButton}>
                  {selectedTable
                    ? t("waiter.order.change")
                    : t("waiter.order.selectTable")}
                </RNText>
              </Pressable>
            </RNView>

            <RNView style={styles.cardContainerView}>
              <RNText style={styles.textCardHeading}>
                {t("waiter.order.items")}
              </RNText>
              <FlatList
                data={orderItems}
                renderItem={renderItem}
                ItemSeparatorComponent={itemSaparatorComponent}
                scrollEnabled={false}
                ListEmptyComponent={
                  <RNText style={styles.emptyText}>
                    {t("waiter.order.selectItemMessage")}
                  </RNText>
                }
              />
            </RNView>

            <RNView style={styles.cardContainerView}>
              <RNText style={styles.textCardHeading}>
                {t("owner.newReservation.guestDetail")}
              </RNText>
              {renderGuestdetail()}
            </RNView>
          </RNView>
        </RNView>
      </KeyboardAwareScrollView>

      <RNView style={styles.bottomButtonView}>
        <AppButton
          title={t("waiter.order.confirmedOrder")}
          onPress={handleConfirmedOrder}
          disabled={isConfirmOrderDisabled}
          style={styles.confirmButton}
        />
      </RNView>
      <TableSelectionSheet
        visible={tableSheetVisible}
        onCloseSheet={() => setTableSheetVisible(false)}
        tables={tables}
        selectedTableId={selectedTable?.table_id}
        onSelectTable={handleSelectTable}
        loading={tableLoading}
      />
    </SafeAreaView>
  );
};

export default OrderSummaryScreen;
