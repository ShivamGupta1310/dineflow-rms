import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { SVGS, TableSVG } from "@assets";
import { RNText, RNView } from "@components";
import { colors } from "@theme/colors";
import { showToast } from "@utils/toastHelper";

import styles from "./styles";
import {
  Date_Format,
  Common_Values,
  TableGridItemStatus,
} from "@utils/constants";
import { statusTheme } from "@utils";

export interface TableGridItemData {
  table_id: number;
  table_number: string;
  capacity: number;
  status: TableGridItemStatus | string;
  customer_name: string | null;
  customer_mobile: string | null;
  occupied_at: string | null;
  total_order_amount: number;
  created_at: string;
  total_order_amount_with_tax: string
}

interface TableGridItemProps {
  item: TableGridItemData;
  onPress?: (item: TableGridItemData) => void;
  style?: StyleProp<ViewStyle>;
  bottomViewStyle?: StyleProp<ViewStyle>;
  status?: string;
  testID?: string;
  showTime?: boolean;
}

const formatTime = (value: string | null) => {
  if (!value) {
    return Common_Values.EMPTY_PLACEHOLDER;
  }

  const parsed = moment(value);
  return parsed.isValid()
    ? parsed.format(Date_Format.TIME_12_HOUR)
    : Common_Values.EMPTY_PLACEHOLDER;
};

const TableGridItem = ({
  item,
  onPress,
  style,
  bottomViewStyle,
  status,
  testID,
  showTime = true,
}: TableGridItemProps) => {
  const { t } = useTranslation();

  const normalizedStatus = item?.status?.toLowerCase() as TableGridItemStatus;

  const theme =
    statusTheme[normalizedStatus] ?? statusTheme[TableGridItemStatus.AVAILABLE];

  const displayTime = formatTime(item.occupied_at);

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
      <TableSVG color={colors.primaryText} />

      <RNView style={styles.capacityContainer}>
        <SVGS.ProfileIcon />
        <RNText style={styles.capacity}>{item.capacity}</RNText>
      </RNView>

      <RNView style={[styles.tableTimeContainer, bottomViewStyle]}>
        <RNText style={styles.tableNumber}>{item.table_number}</RNText>

        {status && <RNText style={styles.time}>{status}</RNText>}
        {showTime && <RNText style={styles.time}>{displayTime}</RNText>}
      </RNView>
    </Pressable>
  );
};

export default TableGridItem;
