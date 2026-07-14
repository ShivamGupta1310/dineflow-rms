import React, { useRef, useMemo, useContext, useEffect } from "react";
import { FlatList, ScrollView, TouchableOpacity } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { SVGS, CallIcon } from "@assets";
import {
  AppButton,
  AppLoader,
  Header,
  IconButton,
  RNText,
  RNView,
  TableGridItem,
} from "@components";
import { colors } from "@theme/colors";
import { formatDisplayTime, openDialer, formatDate } from "@utils";
import { Common_Values, Date_Format } from "@utils/constants";
import { moderateScale, horizontalScale } from "@utils/scale/scale";
import { GlobalContext } from "../../../../contexts/global.provider";
import withCustomAlert, {
  CustomAlertController,
} from "../../../../hoc/withCustomAlert";
import withSuccessScreen, {
  SuccessScreenController,
} from "../../../../hoc/withSuccessScreen";

import moment from "moment";
import styles from "./styles";
import { useReserveTable } from "./useReserveTable";
import {
  AvailableTableResponseItem,
  TimeSlot,
} from "@store/slices/ownerTablesSlice";

const { Backlogo, CalendarIcon, ProfileIcon, ClockIcon } = SVGS;
const ICON_SIZE = moderateScale(14);

const ReserveTableScreen: React.FC<
  CustomAlertController & SuccessScreenController
> = ({ showAlert, showSuccessScreen, hideSuccessScreen }) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const contextData = useContext(GlobalContext);
  const isRTL = contextData?.isRTL ?? false;
  const {
    t,
    item,
    timeSlots,
    selectedSlotId,
    availableTables,
    selectedTable,
    loadingTimeSlots,
    loadingTables,
    isSubmitting,
    handleTimeSlotSelect,
    handleTableSelect,
    handleBack,
    handleReservedTablePress,
  } = useReserveTable({
    showAlert,
    showSuccessScreen,
    hideSuccessScreen,
  });

  const initialIndex = useMemo(() => {
    if (!selectedSlotId || timeSlots.length === 0) return 0;
    const idx = timeSlots.findIndex((slot) => slot.slot_id === selectedSlotId);
    return idx >= 0 ? idx : 0;
  }, [selectedSlotId, timeSlots]);

  useEffect(() => {
    if (
      isRTL &&
      selectedSlotId &&
      timeSlots?.length > 0 &&
      flatListRef.current
    ) {
      const index = timeSlots?.findIndex(
        (slot) => slot.slot_id === selectedSlotId,
      );
      if (index >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: false,
            viewPosition: 0.5,
          });
        }, 150);
      }
    }
  }, [selectedSlotId, timeSlots, isRTL]);

  const renderTimeSlot = ({ item: slot }: { item: TimeSlot }) => {
    const isSelected = selectedSlotId === slot.slot_id;

    const isDisabled =
      ((item as any)?.slot_id ?? (item as any)?.slot?.id) !== slot.slot_id &&
      !slot.is_available;
    const formattedSlotTime = moment(
      slot.start_time,
      Date_Format.HH_mm_ss,
    ).format(Date_Format.TIME_12_HOUR);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isDisabled}
        onPress={() => handleTimeSlotSelect(slot.slot_id)}
        style={[
          styles.timeSlotCard,
          isSelected && styles.timeSlotCardSelected,
          isDisabled && styles.disabledCard,
        ]}
      >
        <RNText style={styles.timeSlotText}>{formattedSlotTime}</RNText>
        <RNText style={styles.timeSlotStatus}>
          {`${slot?.booked || 0}/${slot?.max_capacity ?? 0}`}
        </RNText>
      </TouchableOpacity>
    );
  };

  const renderTableCard = ({
    item: table,
  }: {
    item: AvailableTableResponseItem;
  }) => {
    const isSelected = selectedTable?.table_id === table.table_id;
    return (
      <RNView style={styles.activeTableContainer}>
        <TableGridItem
          item={table as any}
          onPress={() => table?.is_available && handleTableSelect(table)}
          style={[isSelected ? styles.tableCardSelected : styles.tableCard, !table?.is_available && styles.disabledCard]}
          bottomViewStyle={
            isSelected ? styles.selectedBottomViewStyle : styles.bottomViewStyle
          }
          status={
            table?.is_available
              ? t("owner.tables.available")
              : Common_Values.EMPTY_PLACEHOLDER
          }
          showTime={false}
        />
      </RNView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {loadingTimeSlots || loadingTables || isSubmitting ? <AppLoader /> : null}
      <Header
        title={t("owner.reservation.reservedTable.selectTable&Time")}
        leftSlot={
          <IconButton
            icon={<Backlogo />}
            onPress={handleBack}
            backgroundColor={colors.white}
            testID="reserve-table-back-button"
          />
        }
        rightSlot={
          <IconButton
            icon={
              <SvgXml
                xml={CallIcon(colors.statusReserved)}
                width={`${moderateScale(16)}`}
                height={`${moderateScale(16)}`}
              />
            }
            onPress={() => openDialer(item?.customer_phone)}
            backgroundColor={colors.white}
            testID="reserve-table-call-button"
          />
        }
        containerStyle={styles.headerContainer}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <RNView style={styles.infoCard}>
          <RNView style={styles.avatarContainer}>
            <ProfileIcon width={moderateScale(16)} height={moderateScale(16)} />
          </RNView>
          <RNText style={styles.customerName}>
            {item?.customer_name ?? Common_Values.EMPTY_PLACEHOLDER}
          </RNText>

          <RNView style={styles.statusBadge}>
            <RNText style={styles.statusText}>
              {t("owner.reservation.status.confirmed")}
            </RNText>
          </RNView>

          <RNView style={styles.phoneContainer}>
            <SvgXml
              xml={CallIcon(colors.secondaryText)}
              width={`${ICON_SIZE}`}
              height={`${ICON_SIZE}`}
            />
            <RNText style={styles.phoneText}>{item?.customer_phone}</RNText>
          </RNView>

          <RNView style={styles.detailsRow}>
            <RNView style={styles.detailItem}>
              <CalendarIcon width={ICON_SIZE} height={ICON_SIZE} />
              <RNText style={styles.detailText}>
                {formatDate(
                  item?.reservation_date || "",
                  Date_Format.DD_MM_YY,
                  false,
                )}
              </RNText>
            </RNView>

            <RNView style={styles.detailDivider} />

            <RNView style={styles.detailItem}>
              <ProfileIcon width={ICON_SIZE} height={ICON_SIZE} />
              <RNText style={styles.detailText}>{item?.total_guest}</RNText>
            </RNView>

            <RNView style={styles.detailDivider} />

            <RNView style={styles.detailItem}>
              <ClockIcon width={ICON_SIZE} height={ICON_SIZE} />
              <RNText style={styles.detailText}>
                {formatDisplayTime(
                  item?.reservation_time || "",
                  Date_Format.TIME_12_HOUR,
                  false,
                )}
              </RNText>
            </RNView>
          </RNView>
        </RNView>

        <RNView style={[styles.sectionContainer, styles.timeSlotTopSpacing]}>
          <RNView style={styles.sectionHeaderRow}>
            <RNText style={styles.sectionTitle}>
              {t("owner.reservation.reservedTable.availableTimeSlots")}
            </RNText>
          </RNView>

          {!loadingTimeSlots ? (
            <FlatList
              ref={flatListRef}
              horizontal
              data={timeSlots}
              renderItem={renderTimeSlot}
              keyExtractor={(slot) => String(slot.slot_id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeSlotsList}
              initialScrollIndex={isRTL ? undefined : initialIndex}
              getItemLayout={
                isRTL
                  ? undefined
                  : (_, index) => ({
                      length: horizontalScale(96),
                      offset: horizontalScale(96) * index,
                      index,
                    })
              }
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                    viewPosition: 0.5,
                  });
                }, 50);
              }}
              ListEmptyComponent={
                <RNText style={styles.emptyText}>
                  {t("owner.reservation.reservedTable.noSlotsAvailable")}
                </RNText>
              }
            />
          ) : null}
        </RNView>

        <RNView style={[styles.sectionContainer, styles.tableSpacing]}>
          <RNView style={styles.sectionHeaderRow}>
            <RNText style={styles.sectionTitle}>
              {t("owner.reservation.reservedTable.availableTable")}
            </RNText>
            <RNText style={styles.sectionRightText}>
              {availableTables.length === 1
                ? t("owner.reservation.reservedTable.tablesCount_one")
                : t("owner.reservation.reservedTable.tablesCount", {
                    count: availableTables.length,
                  })}
            </RNText>
          </RNView>

          {
            <FlatList
              data={availableTables}
              renderItem={renderTableCard}
              keyExtractor={(table) => String(table.table_id)}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.tablesListContainer}
              ListEmptyComponent={
                <RNText style={styles.emptyText}>
                  {t("owner.tables.noTableAvailable")}
                </RNText>
              }
            />
          }
        </RNView>
      </ScrollView>

      <RNView
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + moderateScale(10) },
        ]}
      >
        <AppButton
          title={t("owner.reservation.reservedTable.cancel")}
          variant="outlined"
          onPress={handleBack}
          style={[styles.content, styles.cancelButton]}
          testID="reserve-table-cancel-button"
        />

        <AppButton
          title={t("owner.reservation.reservedTable.reservedTableBtn")}
          onPress={handleReservedTablePress}
          disabled={!selectedSlotId || !selectedTable}
          style={styles.content}
          testID="reserve-table-confirm-button"
        />
      </RNView>
    </SafeAreaView>
  );
};

export default withSuccessScreen(withCustomAlert(ReserveTableScreen));
