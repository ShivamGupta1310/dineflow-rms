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
import { SVGS, TableSVG } from "@assets";
import { SearchIcon } from "@assets/svgXML";
import { TableGridItemStatus } from "@utils/constants";
import { moderateScale } from "@utils/scale/scale";
import {
  AppLoader,
  Header,
  HorizontalStatusTabs,
  IconButton,
  NoDataView,
  RNText,
  RNView,
} from "@components";
import TableGridItem, { TableGridItemData } from "@components/TableGridItem";

const { FilterIcon, DineSetupLogo } = SVGS;

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
    handleFilterClick,
  } = useTableList();
  const showLoader = loading && !refreshing;

  const visibleTables =
    selectedStatus === "all"
      ? tables
      : tables.filter(
          (table) => table.status?.toLowerCase() === selectedStatus,
        );

  const renderItem = ({ item }: ListRenderItemInfo<TableGridItemData>) => (
    <RNView style={styles.activeTableContainer}>
      <TableGridItem
        item={item}
        onPress={
          item.status?.toLowerCase() === TableGridItemStatus.READY_TO_PAY
            ? handleTablePress
            : undefined
        }
      />
    </RNView>
  );

  return (
    <SafeAreaView
      testID="table-list-container"
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <Header
        title={t("owner.tables.tables")}
        subtitle={t("owner.tables.tableDesc")}
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
          {
            icon: (
              <IconButton
                icon={<FilterIcon />}
                onPress={handleFilterClick}
                backgroundColor={colors.white}
                testID="bill-summary-print-button"
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
          <RNView
            style={
              visibleTables.length === 0
                ? styles.listSectionEmpty
                : styles.listSection
            }
          >
            <FlatList
              data={visibleTables ?? []}
              renderItem={renderItem}
              keyExtractor={(item) => String(item.table_id)}
              numColumns={3}
              columnWrapperStyle={[
                styles.columnWrapper,
                isRTL && styles.columnWrapperRtl,
              ]}
              contentContainerStyle={[styles.listContent]}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                loading ? null : (
                  <NoDataView
                    image={
                      <DineSetupLogo
                        width={moderateScale(157)}
                        height={moderateScale(150)}
                      />
                    }
                    title={t("owner.tables.noTablesAvailable")}
                    message={t("owner.tables.noTablesFoundDesc")}
                  />
                )
              }
            />
          </RNView>

          <RNView style={styles.statusInfoContainer}>
            <RNText style={styles.statusTitle}>
              {t("owner.tables.statusGuide")}
            </RNText>
            <RNText style={styles.statusDesc}>
              {t("owner.tables.statusGuideDesc")}
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
    </SafeAreaView>
  );
};

export default TableList;
