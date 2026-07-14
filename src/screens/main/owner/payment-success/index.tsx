import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SVGS } from "@assets";
import { AppLoader, Header, IconButton, RNText, RNView } from "@components";
import { colors } from "@theme/colors";
import { toCurrency } from "@utils";
import { moderateScale } from "@utils/scale/scale";

import styles from "./styles";
import { usePaymentSuccess } from "./usePaymentSuccess";
import { SvgXml } from "react-native-svg";
import { ShareIcon, ThankYouBGIcon } from "@assets/svgXML";
import { Common_Values } from "@utils/constants";

const { Backlogo, PrintIcon, PaymentSuccessIcon, DineSetupLogo } = SVGS;

const PaymentSuccessScreen = () => {
  const {
    t,
    paymentDetails,
    shareLoading,
    formattedPaidAt,
    handleBack,
    handlePrint,
    handleShare,
  } = usePaymentSuccess();

  const subTotal = paymentDetails?.subTotal ?? 0;
  const cgstPer = paymentDetails?.cgstPercentage ?? 0;
  const sgstPer = paymentDetails?.sgstPercentage ?? 0;
  const cgstAmount = paymentDetails?.cgstAmount ?? 0;
  const sgstAmount = paymentDetails?.sgstAmount ?? 0;
  const discount = paymentDetails?.discount ?? 0;
  const grandTotal = paymentDetails?.grandTotal ?? 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {shareLoading ? <AppLoader /> : null}

      <Header
        leftAction={{
          icon: <Backlogo />,
          onPress: handleBack,
          accessibilityLabel: "Back",
          testID: "payment-success-back-button",
        }}
        rightSlot={
          <RNView style={styles.headerRightContainer}>
            <IconButton
              icon={<SvgXml xml={ShareIcon(colors.primaryText)} />}
              onPress={handleShare}
              backgroundColor={colors.appBackground}
              testID="payment-success-share-button"
            />
            <IconButton
              icon={<PrintIcon />}
              onPress={handlePrint}
              backgroundColor={colors.appBackground}
              style={styles.printIconSpacing}
              testID="payment-success-print-button"
            />
          </RNView>
        }
        containerStyle={styles.headerContainer}
      />

      <RNView style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <RNView style={styles.successIconContainer}>
            <PaymentSuccessIcon />
          </RNView>

          <RNText style={styles.successTitle}>
            {t("owner.billSummary.paymentSuccessful")}
          </RNText>

          <RNText style={styles.billNoLabel}>
            {t("owner.billSummary.billNo")}
          </RNText>
          <RNText style={styles.billNoValue}>
            {paymentDetails?.billNumber ?? Common_Values.EMPTY_PLACEHOLDER}
          </RNText>

          <RNText style={styles.paidTimestamp}>
            {t("owner.billSummary.paidOn")} {formattedPaidAt}
          </RNText>

          <RNView style={styles.card}>
            <RNText style={styles.cardTitle}>
              {t("owner.billSummary.bill")}
            </RNText>

            <RNView style={styles.row}>
              <RNText style={styles.rowLabel}>
                {t("owner.billSummary.subTotal")}
              </RNText>
              <RNText style={styles.rowValue}>{toCurrency(subTotal)}</RNText>
            </RNView>

            <RNView style={styles.row}>
              <RNText style={styles.rowLabel}>
                {t("owner.billSummary.cgst")} ({cgstPer}%)
              </RNText>
              <RNText style={styles.rowValue}>{toCurrency(cgstAmount)}</RNText>
            </RNView>

            <RNView style={styles.row}>
              <RNText style={styles.rowLabel}>
                {t("owner.billSummary.sgst")} ({sgstPer}%)
              </RNText>
              <RNText style={styles.rowValue}>{toCurrency(sgstAmount)}</RNText>
            </RNView>

            <RNView style={styles.row}>
              <RNText style={styles.rowLabel}>
                {t("owner.billSummary.discount")}
              </RNText>
              <RNText style={styles.rowValue}>{toCurrency(discount)}</RNText>
            </RNView>

            <RNView style={styles.divider} />

            <RNView style={styles.totalRow}>
              <RNText style={styles.totalLabel}>
                {t("owner.billSummary.total")}
              </RNText>
              <RNText style={styles.totalValue}>
                {toCurrency(grandTotal)}
              </RNText>
            </RNView>
          </RNView>

          <RNView style={styles.thankYouContainer}>
            <RNView style={styles.variableHeight} />
            <RNView style={styles.thankYouTextContainer}>
              <RNView style={styles.bgIconContainer}>
                <SvgXml xml={ThankYouBGIcon()} />
              </RNView>
              <RNText style={styles.thankYouText}>
                {`\u201C${t("owner.billSummary.thankYou")}\n${t(
                  "owner.billSummary.weLoveToSeeYouAgain",
                )}\u201D`}
              </RNText>
            </RNView>
          </RNView>

          <RNView style={styles.bottomIllustrationContainer}>
            <RNView style={styles.variableHeight} />
            <DineSetupLogo
              width={moderateScale(160)}
              height={moderateScale(150)}
            />
          </RNView>
        </ScrollView>
      </RNView>
    </SafeAreaView>
  );
};

export default PaymentSuccessScreen;
