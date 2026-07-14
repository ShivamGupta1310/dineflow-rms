import React, { useState, useContext, useEffect } from "react";
import {
  FlatList,
  Modal,
  TouchableOpacity,
  ListRenderItemInfo,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { AppButton, NoDataView, RNText, RNView } from "@components";
import TableGridItem, { TableGridItemData } from "../TableGridItem";
import { styles } from "./styles";
import { moderateScale } from "@utils/scale/scale";
import { SVGS } from "@assets";
import { TableGridItemStatus } from "@utils/constants";
import { colors } from "@theme/colors";
import { GlobalContext } from "../../contexts/global.provider";
import { statusTheme } from "@utils";

interface TableSelectionSheetProps {
  visible: boolean;
  onCloseSheet: () => void;
  tables: TableGridItemData[];
  selectedTableId?: number;
  onSelectTable: (table: TableGridItemData) => void;
  loading?: boolean;
}

const TableSelectionSheet = ({
  visible,
  onCloseSheet,
  tables,
  selectedTableId: initialSelectedTableId,
  onSelectTable,
  loading = false,
}: TableSelectionSheetProps) => {
  const { DineSetupLogo } = SVGS;
  const { t } = useTranslation();
  const contextData = useContext(GlobalContext);
  const isRTL = contextData?.isRTL ?? false;

  const [localSelectedTableId, setLocalSelectedTableId] = useState<
    number | undefined
  >(initialSelectedTableId);

  useEffect(() => {
    if (visible) {
      setLocalSelectedTableId(initialSelectedTableId);
    }
  }, [visible, initialSelectedTableId]);

  const handleSelectPress = () => {
    const selectedTable = tables.find(
      (table) => table.table_id === localSelectedTableId,
    );
    if (selectedTable) {
      onSelectTable(selectedTable);
    }
    onCloseSheet();
  };

  const renderItem = ({ item }: ListRenderItemInfo<TableGridItemData>) => {
    const isSelected = localSelectedTableId === item.table_id;
    const normalizedStatus = item?.status?.toLowerCase() as TableGridItemStatus;

    const theme =
      statusTheme[normalizedStatus] ??
      statusTheme[TableGridItemStatus.AVAILABLE];
    return (
      <TableGridItem
        item={item}
        onPress={() => setLocalSelectedTableId(item.table_id)}
        style={[
          styles.tableCard,
          {
            borderColor: isSelected ? colors.primary : theme.backgroundColor,
          },
        ]}
        bottomViewStyle={styles.bottomBox}
        showTime={false}
      />
    );
  };

  const filteredTables = tables.filter((table) => {
    const status = table.status?.toLowerCase();
    return (
      status === TableGridItemStatus.AVAILABLE ||
      status === TableGridItemStatus.OCCUPIED
    );
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCloseSheet}
      statusBarTranslucent
    >
      <RNView style={styles.backdrop}>
        <TouchableOpacity onPress={onCloseSheet} style={styles.flex} />

        <SafeAreaView
          style={[
            styles.container,
            (loading || filteredTables.length === 0) &&
              styles.fixedHeightContainer,
          ]}
          edges={["bottom"]}
          testID="table-selection-sheet-container"
        >
          <RNText style={styles.title}>{t("waiter.menu.changeTable")}</RNText>

          {loading ? (
            <RNView style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </RNView>
          ) : (
            <FlatList
              data={filteredTables}
              renderItem={renderItem}
              keyExtractor={(item) => String(item.table_id)}
              numColumns={3}
              columnWrapperStyle={
                filteredTables.length > 0
                  ? [styles.columnWrapper, isRTL && styles.columnWrapperRtl]
                  : undefined
              }
              contentContainerStyle={[
                styles.listContentContainer,
                filteredTables.length === 0 && styles.flex,
              ]}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <RNView style={styles.centerContainer}>
                  <NoDataView
                    image={
                      <DineSetupLogo
                        width={moderateScale(120)}
                        height={moderateScale(110)}
                      />
                    }
                    title={t("owner.tables.noTablesAvailable")}
                    message={t("owner.tables.noTablesFoundDesc")}
                  />
                </RNView>
              }
            />
          )}

          <AppButton
            style={styles.selectButton}
            title={t("waiter.menu.select")}
            onPress={handleSelectPress}
            disabled={!localSelectedTableId || loading}
            textStyle={styles.btnTextStyle}
          />
        </SafeAreaView>
      </RNView>
    </Modal>
  );
};

export default TableSelectionSheet;
