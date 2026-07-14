import React from "react";
import { RNView } from "@components/rn-view/rn-view.component";
import { RNText } from "@components/rn-text/rn-text.component";
import { styles } from "./styles";
import { SVGS } from "@assets";
import { t } from "i18next";
import { formatDate } from "@utils";
import { Date_Format, Common_Values } from "@utils/constants";
import { BillMetadata, TableSession } from "@appTypes/waiterOrder.types";

export interface Props {
  orderNumber: string;
  tableSession: TableSession | null;
  billMetadata: BillMetadata | null;
}

const { CalendarIcon, UserIcon, ClockIcon, PhoneIcon } = SVGS;

const OrderDetailTopInfoView = ({ orderNumber, tableSession, billMetadata }: Props) => {
  return (
    <RNView style={styles.container}>
      <RNView style={styles.headerCard}>
        <RNText style={styles.orderNoHeaderLabel} numberOfLines={3}>
          {t("waiter.generateBill.orderNo")}
        </RNText>

        <RNText style={styles.orderNoValue}>
          {orderNumber ?? Common_Values.EMPTY_PLACEHOLDER}
        </RNText>
      </RNView>

      <RNView style={styles.highlightedInfoContainer}>
        <RNView style={styles.highlightedInfoRow}>
          <CalendarIcon />
          <RNText style={styles.highlightedInfoText}>
            {formatDate(
              billMetadata?.sessionStartedAt ?? "",
              Date_Format.DD_MM_YY,
            )}
          </RNText>

          <RNView style={styles.infoDivider} />

          <UserIcon />
          <RNText style={styles.highlightedInfoText}>
            {billMetadata?.totalGuest ?? 0}
          </RNText>

          <RNView style={styles.infoDivider} />

          <ClockIcon />
          <RNText style={styles.highlightedInfoText}>
            {formatDate(
              billMetadata?.sessionStartedAt ?? "",
              Date_Format.TIME_12_HOUR,
            )}
          </RNText>
        </RNView>

        <RNView style={[styles.highlightedInfoRow]}>
          <UserIcon />
          <RNText style={styles.highlightedInfoText}>
            {tableSession?.customerName ?? Common_Values.EMPTY_PLACEHOLDER}
          </RNText>

          <RNView style={styles.infoDivider} />

          <PhoneIcon />
          <RNText style={styles.highlightedInfoText}>
            {tableSession?.customerMobile ?? Common_Values.EMPTY_PLACEHOLDER}
          </RNText>
        </RNView>
      </RNView>
    </RNView>
  );
};

export default OrderDetailTopInfoView;
