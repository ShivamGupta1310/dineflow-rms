import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

import { SVGS, TableSVG } from "@assets";
import { RNText, RNView } from "@components";
import type { TableGridItemData } from "@components/TableGridItem";
import { colors } from "@theme/colors";
import { showToast } from "@utils/toastHelper";

import styles from "./styles";
import { LRI, PDI, TableGridItemStatus } from "@utils/constants";
import { formatNumber, statusTheme } from "@utils";
import { scaledSize } from "@utils/scale/scale";

interface WaiterTableGridItemProps {
  item: TableGridItemData;
  onPress?: (item: TableGridItemData) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const WaiterTableGridItem = ({
  item,
  onPress,
  style,
  testID,
}: WaiterTableGridItemProps) => {
  const { t } = useTranslation();

  if (item?.status === "") {
    return <RNView style={styles.card} />;
  }

  const normalizedStatus = item.status.toLowerCase() as TableGridItemStatus;

  const theme =
    statusTheme[normalizedStatus] ?? statusTheme[TableGridItemStatus.AVAILABLE];

  const handleItemPress = () => {
    if (onPress) {
      onPress(item);
      return;
    }

    showToast("info", t("common.comingSoon"));
  };

  return (
    <Pressable
      testID={testID ?? `table-grid-item-${item.table_id}`}
      onPress={handleItemPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundColor,
        },
        style,
      ]}
    >
      <RNView style={styles.topView}>
        <RNText style={styles.tableNumber}>{item.table_number}</RNText>
        {item.status !== TableGridItemStatus.AVAILABLE && (
          <RNText style={styles.tableNumber}>-</RNText>
        )}
      </RNView>

      <RNView style={styles.centerView}>
        <TableSVG
          color={colors.primaryText}
          height={scaledSize(20)}
          width={scaledSize(20)}
        />

        <RNView style={styles.capacityContainer}>
          <SVGS.ProfileIcon />
          <RNText style={styles.capacity}>
            {item.status !== TableGridItemStatus.AVAILABLE && `-/`}
            {item.capacity}
          </RNText>
        </RNView>
      </RNView>
      <RNView>
        {(item.status === TableGridItemStatus.READY_TO_PAY ||
          item.status === TableGridItemStatus.OCCUPIED) && (
          <RNText style={styles.bill}>
            {t("waiter.tables.bill")} -{" "}
            {`${LRI}₹${formatNumber(item.total_order_amount_with_tax)}${PDI}`}
          </RNText>
        )}
      </RNView>
    </Pressable>
  );
};

export default WaiterTableGridItem;
