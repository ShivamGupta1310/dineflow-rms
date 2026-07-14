import React from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  SVGS,
  ReservedIcon,
  ConfirmIcon,
  CalendarIcon,
  CallIcon,
} from "@assets";
import {
  AppLoader,
  AppTextInput,
  Header,
  HorizontalStatusTabs,
  NoDataView,
  RNText,
  RNView,
} from "@components";
import styles from "./styles";
import { useReservation } from "./useReservation";
import withCustomAlert, {
  CustomAlertController,
} from "../../../../hoc/withCustomAlert";
import withSuccessScreen, {
  SuccessScreenController,
} from "../../../../hoc/withSuccessScreen";
import { colors } from "@theme/colors";
import {
  formatDisplayDate,
  openDialer,
  toSuperscriptOrdinal,
  toTitleCase,
} from "@utils";
import { Date_Format, ReservationStatus } from "@utils/constants";
import { SvgXml } from "react-native-svg";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { ReservationItem } from "@store/slices/reservationSlice";

const getStatusChipStyle = (status: ReservationStatus) => {
  switch (status) {
    case ReservationStatus.Pending:
      return styles.statusChipPending;
    case ReservationStatus.NeedConfirmation:
      return styles.statusChipNeedConfirmation;
    case ReservationStatus.Confirmed:
      return styles.statusChipConfirmed;
    case ReservationStatus.Reserved:
      return styles.statusChipReserved;
    case ReservationStatus.Cancelled:
      return styles.statusChipCancelled;
  }
};

const getStatusTextStyle = (status: ReservationStatus) => {
  switch (status) {
    case ReservationStatus.Pending:
      return styles.statusTextPending;
    case ReservationStatus.NeedConfirmation:
      return styles.statusTextNeedConfirmation;
    case ReservationStatus.Confirmed:
      return styles.statusTextConfirmed;
    case ReservationStatus.Reserved:
      return styles.statusTextReserved;
    case ReservationStatus.Cancelled:
      return styles.statusTextCancelled;
  }
};

export const ReservationScreen: React.FC<
  CustomAlertController & SuccessScreenController
> = ({ showAlert, showSuccessScreen, hideSuccessScreen }) => {
  const { t } = useTranslation();
  const { CalendarPlusIcon, ProfileIcon, DeleteIcon, SearchIcon, DineSetupLogo } = SVGS;
  const {
    isRTL,
    reservationList,
    loading,
    searchText,
    setSearchText,
    tabContent,
    handleSelectedStatus,
    selectedStatus,
    onRefresh,
    refreshing,
    handleConfirmReservation,
    handleCancelReservation,
    handleReservedReservation,
    handleReservationDetails,
    handleNewReservation,
  } = useReservation({
    showAlert,
    showSuccessScreen,
    hideSuccessScreen,
  });
  const showLoader = loading && !refreshing;

  const STATUS_LABELS: Record<ReservationStatus, string> = {
    [ReservationStatus.Pending]: t("owner.reservation.status.pending"),
    [ReservationStatus.NeedConfirmation]: t(
      "owner.reservation.status.needConfirmation",
    ),
    [ReservationStatus.Confirmed]: t("owner.reservation.status.confirmed"),
    [ReservationStatus.Reserved]: t("owner.reservation.status.reserved"),
    [ReservationStatus.Cancelled]: t("owner.reservation.status.cancelled"),
  };

  const renderActionButton = (
    icon: React.ReactNode,
    buttonStyle: ViewStyle,
    onPress: () => void,
  ) => (
    <Pressable style={[styles.actionButton, buttonStyle]} onPress={onPress}>
      {icon}
    </Pressable>
  );

  const renderReservationCard = ({ item }: { item: ReservationItem }) => {
    const pendingReservation =
      item.status === ReservationStatus.Pending ||
      item.status === ReservationStatus.NeedConfirmation;
    return (
      <TouchableOpacity
        style={styles.reservationCard}
        onPress={() => handleReservationDetails(item.id)}
      >
        <RNView style={styles.reservationHeader}>
          <RNText style={[styles.guestName]}>
            {toTitleCase(item?.customer_name)}
          </RNText>
          <RNView style={[styles.statusChip, getStatusChipStyle(item.status)]}>
            <RNText
              style={[styles.statusText, getStatusTextStyle(item.status)]}
            >
              {STATUS_LABELS[item.status]}
            </RNText>
          </RNView>
        </RNView>

        <RNView style={styles.cardBody}>
          <RNView style={styles.actionDetailsContainer}>
            <RNView style={[styles.detailRow, styles.detailTextCompact]}>
              <ProfileIcon
                style={[styles.detailIcon, isRTL && styles.detailIconRTL]}
              />
              <RNText style={[styles.detailText]}>{item.total_guest}</RNText>
            </RNView>

            <RNView style={[styles.detailRow, styles.detailTextCompact]}>
              <SvgXml
                xml={CallIcon()}
                width={`${horizontalScale(12)}`}
                height={`${verticalScale(12)}`}
                style={[styles.detailIcon, isRTL && styles.detailIconRTL]}
              />
              <RNText style={[styles.detailText]}>{item.customer_phone}</RNText>
            </RNView>

            <RNView style={styles.detailRow}>
              <SvgXml
                xml={CalendarIcon}
                width={`${horizontalScale(12)}`}
                height={`${verticalScale(12)}`}
                style={[styles.detailIcon, isRTL && styles.detailIconRTL]}
              />
              <RNView
                style={[styles.dateContent, isRTL && styles.dateContentRTL]}
              >
                <RNText style={styles.detailText}>
                  {" "}
                  {`${toSuperscriptOrdinal(
                    formatDisplayDate(
                      item.reservation_date,
                      Date_Format.Do_MMM_YY,
                      item.reservation_time,
                      Date_Format.TIME_12_HOUR,
                      false,
                    ),
                  )}`}
                </RNText>
              </RNView>
            </RNView>
          </RNView>

          <RNView style={styles.actionConatiner}>
            <RNView style={styles.actionMainConatiner}>
              {pendingReservation && (
                <>
                  {renderActionButton(
                    <DeleteIcon />,
                    styles.actionButtonDelete,
                    () => handleCancelReservation(item),
                  )}
                  {renderActionButton(
                    <SvgXml
                      xml={ConfirmIcon}
                      width={`${horizontalScale(16)}`}
                      height={`${verticalScale(16)}`}
                    />,
                    styles.actionButtonConfirm,
                    () => handleConfirmReservation(item),
                  )}
                </>
              )}
              {item.status === ReservationStatus.Confirmed &&
                renderActionButton(
                  <SvgXml
                    xml={ReservedIcon}
                    width={`${horizontalScale(16)}`}
                    height={`${verticalScale(16)}`}
                  />,
                  styles.statusChipCancelled,
                  () => handleReservedReservation(item),
                )}
              {item.status !== ReservationStatus.Cancelled &&
                renderActionButton(
                  <SvgXml
                    xml={CallIcon(colors.statusReserved)}
                    width={`${horizontalScale(16)}`}
                    height={`${verticalScale(16)}`}
                  />,
                  styles.statusChipReserved,
                  () => openDialer(item.customer_phone),
                )}
            </RNView>
          </RNView>
        </RNView>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t("owner.reservation.header.title")}
        subtitle={t("owner.reservation.header.subtitle")}
        containerStyle={styles.headerContainer}
        rightActions={[
          {
            icon: <CalendarPlusIcon />,
            onPress: handleNewReservation,
            containerStyle: { backgroundColor: colors.white },
            testID: "reservation-calendar-button",
          },
        ]}
      />

      <RNView style={styles.mainContainer}>
        <AppTextInput
          placeholder={t("owner.reservation.searchPlaceholder")}
          value={searchText}
          onChangeText={setSearchText}
          leftAccessory={<SearchIcon />}
          containerStyle={styles.searchInputContainer}
          inputContainerStyle={styles.searchInputInner}
          placeholderColor={colors.gray500}
        />
      </RNView>

      <HorizontalStatusTabs
        tabs={tabContent}
        selectedStatus={selectedStatus}
        onTabPress={(tab) => {
          handleSelectedStatus(tab.status);
        }}
      />

      {showLoader ? <AppLoader /> : null}

      <View style={[styles.mainContainer, styles.listContainer]}>
        <FlatList
          data={reservationList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReservationCard}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={
            loading ? null : (
              <NoDataView
                image={
                  <DineSetupLogo
                    width={moderateScale(157)}
                    height={moderateScale(150)}
                  />
                }
                title={t("owner.reservation.noReservationAvailable")}
                message={t("owner.reservation.noReservationFoundDesc")}
              />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default withSuccessScreen(withCustomAlert(ReservationScreen));
