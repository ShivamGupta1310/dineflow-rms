import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { SVGS } from "@assets";
import {
  AppButton,
  AppLoader,
  AppTextInput,
  Header,
  OrderItemCard,
  RNText,
  RNView,
} from "@components";

import styles from "./styles";
import { useBillGeneration } from "./useBillGeneration";
import { toCurrency } from "@utils";
import {
  KeyboardBottomOffset,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { Common_Values } from "@utils/constants";
import { BillSummaryFlatItem } from "@appTypes";
import OrderDetailTopInfoView from "@components/OrderDetailTopInfoView";
import withSuccessScreen, {
  SuccessScreenController,
} from "../../../../hoc/withSuccessScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const { Backlogo, IndiaFlag } = SVGS;

const BillGenerationScreen: React.FC<SuccessScreenController> = ({
  showSuccessScreen,
  hideSuccessScreen,
}) => {
  const {
    t,
    loading,
    fullName,
    mobileNumber,
    mobileErrorText,
    orderNumbers,
    calculatedBillSummary,
    orderItems,
    tableSession,
    billMetadata,
    tableId,
    isGenerateBillDisabled,
    handleBack,
    handleFullNameChange,
    handleMobileChange,
    handleAddDiscount,
    handleGenerateBill,
  } = useBillGeneration({
    showSuccessScreen,
    hideSuccessScreen,
  });
  const insets = useSafeAreaInsets();

  const resolvedBillSummary = calculatedBillSummary ?? {
    subtotal: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
  };

  const renderGuestdetail = () => {
    return (
      <RNView style={styles.guestDetailsContainer}>
        <AppTextInput
          label={t("owner.newReservation.fullName")}
          placeholder={t("owner.newReservation.enterFullName")}
          value={fullName}
          onChangeText={handleFullNameChange}
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
      </RNView>
    );
  };
  const itemSaparatorComponent = () => <RNView style={styles.divider} />;

  const renderItem = ({ item }: { item: BillSummaryFlatItem }) => (
    <OrderItemCard
      itemName={item.item_name}
      description={t("waiter.order.quantityLabel", { count: item.quantity })}
      imageUrl={item.image_url}
      trailingComponent={
        <RNText style={styles.itemPrice}>
          {toCurrency((item.unit_price ?? 0) * (item.quantity ?? 0))}
        </RNText>
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {loading ? <AppLoader /> : null}

      <Header
        title={`${t("waiter.generateBill.tableNo")} - ${
          tableId ?? Common_Values.EMPTY_PLACEHOLDER
        }`}
        leftAction={{
          icon: <Backlogo />,
          onPress: handleBack,
          accessibilityLabel: "Back",
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
        <RNView style={styles.content}>
          <OrderDetailTopInfoView
            orderNumber={orderNumbers}
            tableSession={tableSession}
            billMetadata={billMetadata}
          />

          <RNView style={styles.detailsContainer}>
            <RNView style={styles.sectionCard}>
              <RNText style={styles.sectionTitle}>
                {t("waiter.generateBill.items")}
              </RNText>

              <FlatList
                data={orderItems}
                renderItem={renderItem}
                ItemSeparatorComponent={itemSaparatorComponent}
                scrollEnabled={false}
              />
            </RNView>

            <RNView style={styles.sectionCard}>
              <RNText style={[styles.sectionTitle]}>
                {t("waiter.generateBill.bill")}
              </RNText>

              <RNView style={[styles.billRow, styles.subTotalTopSpacing]}>
                <RNText style={styles.billRowLabel}>
                  {t("waiter.generateBill.subTotal")}
                </RNText>
                <RNText style={styles.billRowValue}>
                  {toCurrency(resolvedBillSummary.subtotal ?? 0)}
                </RNText>
              </RNView>

              <RNView style={styles.billRow}>
                <RNText style={styles.billRowLabel}>
                  {t("waiter.generateBill.cgst")} (
                  {billMetadata?.cgstPercentage ?? 0}
                  %)
                </RNText>
                <RNText style={styles.billRowValue}>
                  {toCurrency(resolvedBillSummary.cgstAmount ?? 0)}
                </RNText>
              </RNView>

              <RNView style={styles.billRow}>
                <RNText style={styles.billRowLabel}>
                  {t("waiter.generateBill.sgst")} (
                  {billMetadata?.sgstPercentage ?? 0}
                  %)
                </RNText>
                <RNText style={styles.billRowValue}>
                  {toCurrency(resolvedBillSummary.sgstAmount ?? 0)}
                </RNText>
              </RNView>

              <RNView style={styles.billRow}>
                <RNText style={styles.billRowLabel}>
                  {t("waiter.generateBill.discount")}
                </RNText>
                {Number(billMetadata?.billDetails?.discount_amount ?? 0) > 0 ? (
                  <RNText style={styles.billRowValue}>
                    {toCurrency(
                      billMetadata?.billDetails?.discount_amount ?? 0,
                    )}
                  </RNText>
                ) : (
                  <TouchableOpacity
                    onPress={handleAddDiscount}
                    activeOpacity={0.8}
                  >
                    <RNText style={styles.addDiscountText}>
                      + {t("waiter.generateBill.add")}
                    </RNText>
                  </TouchableOpacity>
                )}
              </RNView>

              <RNView style={styles.billDivider} />

              <RNView style={styles.totalRow}>
                <RNText style={styles.totalLabel}>
                  {t("waiter.generateBill.total")}
                </RNText>
                <RNText style={styles.totalValue}>
                  {toCurrency(resolvedBillSummary.grandTotal ?? 0)}
                </RNText>
              </RNView>
            </RNView>

            <RNView style={styles.sectionCard}>
              <RNText style={[styles.sectionTitle]}>
                {t("owner.newReservation.guestDetail")}
              </RNText>
              {renderGuestdetail()}
            </RNView>
          </RNView>
        </RNView>
      </KeyboardAwareScrollView>

      <RNView
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + moderateScale(10) },
        ]}
      >
        <AppButton
          title={t("waiter.generateBill.generatingBill")}
          onPress={handleGenerateBill}
          style={styles.content}
          disabled={isGenerateBillDisabled}
          loading={loading}
          loadingText={t("owner.billSummary.generatingInvoice")}
        />
      </RNView>
    </SafeAreaView>
  );
};

export default withSuccessScreen(BillGenerationScreen);
