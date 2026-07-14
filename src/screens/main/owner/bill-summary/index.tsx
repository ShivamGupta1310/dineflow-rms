import React from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { SVGS } from "@assets";
import {
  AppButton,
  AppLoader,
  Header,
  IconButton,
  RNText,
  RNView,
} from "@components";
import { colors } from "@theme/colors";

import styles from "./styles";
import { useBillSummary } from "./useBillSummary";
import { formatDate, toCurrency } from "@utils";
import { moderateScale } from "@utils/scale/scale";
import { Common_Values, Date_Format } from "@utils/constants";
import { SvgXml } from "react-native-svg";
import { ShareIcon } from "@assets/svgXML";

const {
  DishIcon,
  PrintIcon,
  Backlogo,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  PhoneIcon,
  CheckWhiteCircleIcon,
} = SVGS;

const BillSummaryScreen = () => {
  const {
    t,
    loading,
    response,
    billDetails,
    billSummary,
    orderItems,
    tableId,
    handleBack,
    handlePrint,
    handleShare,
    handleAddDiscount,
    handleMarkAsPaid,
    shareLoading,
  } = useBillSummary();
  const insets = useSafeAreaInsets();
  const isPaid = Boolean(billDetails?.is_paid);
  const resolvedBillSummary = billSummary ?? {
    subtotal: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
  };
  const generatedByInfo = response?.bill_details?.generated_by;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {loading ? <AppLoader /> : null}

      <Header
        title={`${t("owner.billSummary.tableNo")} - ${
          tableId ?? Common_Values.EMPTY_PLACEHOLDER
        }`}
        leftAction={{
          icon: <Backlogo />,
          onPress: handleBack,
          accessibilityLabel: "Back",
          containerStyle: styles.headerAction,
        }}
        rightSlot={
          <IconButton
            icon={<PrintIcon />}
            onPress={handlePrint}
            backgroundColor={colors.white}
            testID="bill-summary-print-button"
          />
        }
        containerStyle={styles.headerContainer}
        contentStyle={styles.headerContent}
      />

      <RNView style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <RNView style={styles.billHeaderCard}>
            <RNText style={styles.billHeaderLabel}>
              {t("owner.billSummary.billNo")}
            </RNText>

            <RNText style={styles.billHeaderValue}>
              {billDetails?.bill_number ?? Common_Values.EMPTY_PLACEHOLDER}
            </RNText>
          </RNView>

          <RNView style={styles.highlightedInfoContainer}>
            <RNView style={styles.highlightedInfoRow}>
              <CalendarIcon />
              <RNText style={styles.highlightedInfoText}>
                {formatDate(
                  response?.session_started_at ?? "",
                  Date_Format.DD_MM_YY,
                )}
              </RNText>

              <RNView style={styles.infoDivider} />

              <UserIcon />
              <RNText style={styles.highlightedInfoText}>
                {response?.total_guest ?? 0}
              </RNText>

              <RNView style={styles.infoDivider} />

              <ClockIcon />
              <RNText style={styles.highlightedInfoText}>
                {formatDate(
                  response?.session_started_at ?? "",
                  Date_Format.TIME_12_HOUR,
                )}
              </RNText>
            </RNView>

            <RNView
              style={[
                styles.highlightedInfoRow,
                styles.highlightedInfoRowSpacing,
              ]}
            >
              <UserIcon />
              <RNText style={styles.highlightedInfoText}>
                {response?.customer_name ?? Common_Values.EMPTY_PLACEHOLDER}
              </RNText>

              <RNView style={styles.infoDivider} />

              <PhoneIcon />
              <RNText style={styles.highlightedInfoText}>
                {response?.customer_mobile ?? Common_Values.EMPTY_PLACEHOLDER}
              </RNText>
            </RNView>

            <RNView
              style={[
                styles.highlightedInfoRow,
                styles.highlightedInfoRowSpacing,
              ]}
            >
              <UserIcon />
              <RNText style={styles.highlightedInfoText}>
                {generatedByInfo?.name ?? Common_Values.EMPTY_PLACEHOLDER} (
                {generatedByInfo?.employee_code ??
                  Common_Values.EMPTY_PLACEHOLDER}
                )
              </RNText>
            </RNView>
          </RNView>

          <RNView style={styles.sectionCard}>
            <RNText style={styles.sectionTitle}>
              {t("owner.billSummary.items")}
            </RNText>

            {orderItems.length > 0 ? (
              <RNView style={styles.itemsList}>
                {orderItems.map((item, index) => {
                  const isLast = index === orderItems.length - 1;

                  return (
                    <RNView
                      key={`${item.order_item_id}-${item.order_number}`}
                      style={[styles.itemRow, !isLast && styles.itemRowDivider]}
                    >
                      {item?.image_url ? (
                        <RNView style={styles.itemIconWrap}>
                          <Image
                            source={{ uri: item.image_url }}
                            style={styles.safeArea}
                          />
                        </RNView>
                      ) : (
                        <RNView style={styles.centerIcon}>
                          <DishIcon />
                        </RNView>
                      )}

                      <RNView style={styles.itemInfo}>
                        <RNText style={styles.itemName}>
                          {item.item_name}
                        </RNText>
                        <RNText style={styles.itemQuantity}>
                          {t("owner.billSummary.qty")} {item.quantity}
                        </RNText>
                      </RNView>

                      <RNText style={styles.itemPrice}>
                        {toCurrency(
                          (item.unit_price ?? 0) * (item.quantity ?? 0),
                        )}
                      </RNText>
                    </RNView>
                  );
                })}
              </RNView>
            ) : (
              <RNText style={styles.emptyText}>
                {t("common.noItemsFound")}
              </RNText>
            )}
          </RNView>

          <RNView style={[styles.sectionCard, styles.cardPadding]}>
            <RNText style={[styles.sectionTitle]}>
              {t("owner.billSummary.bill")}
            </RNText>

            <RNView style={[styles.billRow, styles.subTotalTopSpacing]}>
              <RNText style={styles.billRowLabel}>
                {t("owner.billSummary.subTotal")}
              </RNText>
              <RNText style={styles.billRowValue}>
                {toCurrency(resolvedBillSummary.subtotal ?? 0)}
              </RNText>
            </RNView>

            <RNView style={styles.billRow}>
              <RNText style={styles.billRowLabel}>
                {t("owner.billSummary.cgst")} ({response?.cgst_percentage ?? 0}
                %)
              </RNText>
              <RNText style={styles.billRowValue}>
                {toCurrency(resolvedBillSummary.cgstAmount ?? 0)}
              </RNText>
            </RNView>

            <RNView style={styles.billRow}>
              <RNText style={styles.billRowLabel}>
                {t("owner.billSummary.sgst")} ({response?.sgst_percentage ?? 0}
                %)
              </RNText>
              <RNText style={styles.billRowValue}>
                {toCurrency(resolvedBillSummary.sgstAmount ?? 0)}
              </RNText>
            </RNView>

            <RNView style={styles.billRow}>
              <RNText style={styles.billRowLabel}>
                {t("owner.billSummary.discount")}
              </RNText>
              {Number(billDetails?.discount_amount ?? 0) > 0 ? (
                <RNText style={styles.billRowValue}>
                  {toCurrency(billDetails?.discount_amount ?? 0)}
                </RNText>
              ) : (
                <TouchableOpacity
                  onPress={handleAddDiscount}
                  activeOpacity={0.8}
                >
                  <RNText style={styles.addDiscountText}>
                    + {t("owner.billSummary.add")}
                  </RNText>
                </TouchableOpacity>
              )}
            </RNView>

            <RNView style={styles.billDivider} />

            <RNView style={styles.totalRow}>
              <RNText style={styles.totalLabel}>
                {t("owner.billSummary.total")}
              </RNText>
              <RNText style={styles.totalValue}>
                {toCurrency(resolvedBillSummary.grandTotal ?? 0)}
              </RNText>
            </RNView>
          </RNView>
        </ScrollView>
      </RNView>

      <RNView
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + moderateScale(10) },
        ]}
      >
        <AppButton
          title={t("owner.billSummary.share")}
          variant="outlined"
          onPress={handleShare}
          leftIcon={<SvgXml xml={ShareIcon(colors.primary)} />}
          loading={shareLoading}
          loadingText={t("owner.billSummary.generatingInvoice")}
          style={[styles.content, styles.shareButtonSpacing]}
        />
        <AppButton
          title={t("owner.billSummary.markAsPaid")}
          onPress={handleMarkAsPaid}
          leftIcon={<CheckWhiteCircleIcon />}
          style={styles.content}
          disabled={isPaid}
        />
      </RNView>
    </SafeAreaView>
  );
};

export default BillSummaryScreen;
