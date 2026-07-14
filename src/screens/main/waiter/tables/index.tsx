import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import useTableList from "./useTableList";
import { colors } from "@theme/colors";
import styles from "./styles";
import {
  AppLoader,
  Header,
  HorizontalStatusTabs,
  IconButton,
  OrderListSheet,
  RNText,
  RNView,
  WaiterTableGridItem,
} from "@components";
import { TableGridItemData } from "@components/TableGridItem";
import { STATUS_ALL } from "@utils/constants";
import { SearchIcon, TableSVG } from "@assets/svgXML";

const TableList = () => {
  const {
    t,
    isRTL,
    selectedStatus,
    setSelectedStatus,
    tabs,
    tables,
    loading,
    refreshing,
    handleRefresh,
    handleTablePress,
    statusGuideCards,
    handleSearchClick,
    getStatusTitle,
    orderSheetVisible,
    setOrderSheetVisible,
    orders,
    selectedTable,
    navigateToMenuScreen,
    navigateToGenerateBillScreen,
  } = useTableList();
  const showLoader = loading && !refreshing;

  const visibleTables =
    selectedStatus === STATUS_ALL
      ? tables
      : tables.filter(
          (table) => table.status?.toLowerCase() === selectedStatus,
        );
  const tablesData =
    visibleTables.length % 2 === 1
        ? [
          ...visibleTables,
          {
            capacity: 0,
            customer_mobile: null,
            customer_name: null,
            created_at: "",
            occupied_at: "",
            status: "",
            table_id: 0,
            table_number: "",
            total_order_amount: 0,
          },
        ]
      : visibleTables;
  const renderItem = ({ item }: ListRenderItemInfo<TableGridItemData>) => (
    <WaiterTableGridItem item={item} onPress={handleTablePress} />
  );

  return (
    <SafeAreaView
      testID="table-list-container"
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <Header
        title={t("waiter.tables.tables")}
        subtitle={t("waiter.tables.tableDesc")}
        rightActions={[
          {
            icon: (
              <IconButton
                icon={<SvgXml xml={SearchIcon} />}
                onPress={handleSearchClick}
                backgroundColor={colors.white}
                testID="search-table-button"
              />
            ),
          },
        ]}
        containerStyle={styles.headerContainer}
        contentStyle={styles.headerContent}
      />

      <HorizontalStatusTabs
        tabs={tabs}
        selectedStatus={selectedStatus}
        onTabPress={(tab) => {
          setSelectedStatus(tab.status);
        }}
      />
      <RNView testID="table-list-root" style={styles.container}>
        <ScrollView
          testID="table-list-scroll"
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <RNView style={styles.listSection}>
            <RNView style={styles.listHeader}>
              <RNText style={styles.allTablesText}>
                {getStatusTitle(selectedStatus)} {t("waiter.tables.tables")}
              </RNText>
              <RNText style={styles.tableCountText}>
                {visibleTables.length} {t("waiter.tables.tables")}
              </RNText>
            </RNView>
            <FlatList
              data={tablesData}
              extraData={visibleTables}
              renderItem={renderItem}
              keyExtractor={(item) => String(item.table_id)}
              numColumns={2}
              columnWrapperStyle={[
                styles.columnWrapper,
                isRTL && styles.columnWrapperRtl,
              ]}
              contentContainerStyle={[styles.listContent]}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <RNText style={[styles.emptyText]}>
                  {t("waiter.tables.noTableAvailable")}
                </RNText>
              }
            />
          </RNView>

          <RNView style={styles.statusInfoContainer}>
            <RNText style={styles.statusTitle}>
              {t("waiter.tables.statusGuide")}
            </RNText>
            <RNText style={styles.statusDesc}>
              {t("waiter.tables.statusGuideDesc")}
            </RNText>

            <RNView style={[styles.statusGrid]} testID="status-guide-grid">
              {statusGuideCards.map((card) => (
                <View
                  key={card.id}
                  testID={card.testID}
                  style={[
                    styles.statusCard,
                    {
                      backgroundColor: card.backgroundColor,
                    },
                  ]}
                >
                  <RNView style={styles.statusCardHeader}>
                    <RNView style={styles.statusIconWrap}>
                      <TableSVG color={card.iconColor} width={16} height={16} />
                    </RNView>
                    <RNText
                      style={[
                        styles.statusCardTitle,
                        {
                          color: card.iconColor,
                        },
                      ]}
                    >
                      {card.title}
                    </RNText>
                  </RNView>

                  <RNText style={[styles.statusCardDesc]}>
                    {card.description}
                  </RNText>
                </View>
              ))}
            </RNView>
          </RNView>
        </ScrollView>
      </RNView>
      {showLoader ? <AppLoader /> : null}

      <OrderListSheet
        visible={orderSheetVisible}
        setOrderSheetVisible={setOrderSheetVisible}
        tableNumber={selectedTable?.table_number}
        orders={orders}
        handleAddItemClick={navigateToMenuScreen}
        handleGenerateBillClick={navigateToGenerateBillScreen}
      />
    </SafeAreaView>
  );
};

export default TableList;
