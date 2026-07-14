import React from "react";
import { ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import {
  CalendarIcon,
  CallIcon,
  ConfirmIcon,
  ReservedIcon,
  SVGS,
} from "@assets";
import {
  ActivityTimeline,
  AppButton,
  AppLoader,
  Header,
  IconButton,
  RNText,
  RNView,
} from "@components";
import { Date_Format, ReservationStatus } from "@utils/constants";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";

import styles from "./styles";
import { useReservationDetail } from "./useReservationDetail";
import { colors } from "@theme/colors";
import { formatDate, toTitleCase } from "@utils";
import withCustomAlert, {
  CustomAlertController,
} from "../../../../hoc/withCustomAlert";
import withSuccessScreen, {
  SuccessScreenController,
} from "../../../../hoc/withSuccessScreen";

const { Backlogo, ClockIcon, ProfileIcon, UserIcon } = SVGS;

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

const ReservationDetailScreen: React.FC<
  CustomAlertController & SuccessScreenController
> = ({ showAlert, showSuccessScreen }) => {
  const {
    t,
    loading,
    statusUpdateLoading,
    reservation,
    reservationActivities,
    reservationTime,
    reservationDetails,
    EMPTY_PLACEHOLDER,
    handleBack,
    handleCallGuest,
    handleEditReservation,
    handleConfirmReservation,
    handleCancelReservation,
    handleReservedReservation,
  } = useReservationDetail({
    showAlert,
    showSuccessScreen,
  });
  const insets = useSafeAreaInsets();
  const { DeleteIcon } = SVGS;
  const statusLabel = reservation
    ? t(`owner.reservation.status.${reservation.status}`)
    : "";
  const status = reservation?.status;

  const shouldShowFooter = !!status && status !== ReservationStatus.Cancelled;

  const shouldShowEditButton = status !== ReservationStatus.Reserved;
  const getRightActions = (reservationStatus?: ReservationStatus) => {
    switch (reservationStatus) {
      case ReservationStatus.Pending:
      case ReservationStatus.NeedConfirmation:
        return [
          {
            icon: (
              <IconButton
                icon={<DeleteIcon />}
                onPress={handleCancelReservation}
                backgroundColor={colors.white}
                testID="reservation-detail-cancel-button"
              />
            ),
          },
          {
            icon: (
              <IconButton
                icon={
                  <SvgXml
                    xml={ConfirmIcon}
                    width={`${horizontalScale(16)}`}
                    height={`${verticalScale(16)}`}
                  />
                }
                onPress={handleConfirmReservation}
                backgroundColor={colors.white}
                testID="reservation-detail-confirm-button"
              />
            ),
          },
        ];

      case ReservationStatus.Confirmed:
        return [
          {
            icon: (
              <IconButton
                icon={
                  <SvgXml
                    xml={ReservedIcon}
                    width={`${horizontalScale(16)}`}
                    height={`${verticalScale(16)}`}
                  />
                }
                onPress={handleReservedReservation}
                backgroundColor={colors.white}
                testID="reservation-detail-reserved-button"
              />
            ),
          },
        ];

      default:
        return [];
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {loading || statusUpdateLoading ? <AppLoader /> : null}
      <Header
        title={t("owner.reservation.details.title")}
        leftAction={{
          icon: <Backlogo />,
          onPress: handleBack,
          accessibilityLabel: "Back",
          containerStyle: styles.headerAction,
        }}
        rightActions={getRightActions(reservation?.status)}
        containerStyle={styles.headerContainer}
        contentStyle={styles.headerContent}
      />

      <RNView style={styles.content}>
        <>
          <RNView style={styles.mainContainer}>
            <RNView style={styles.personContainer}>
              <ProfileIcon width={20} height={20} />
            </RNView>

            <RNText style={styles.billHeaderValue}>
              {toTitleCase(reservation?.customer_name)}
            </RNText>
            {reservation?.status && (
              <RNView
                style={[
                  styles.statusChip,
                  getStatusChipStyle(reservation?.status),
                ]}
              >
                <RNText
                  style={[
                    styles.statusText,
                    getStatusTextStyle(reservation?.status),
                  ]}
                >
                  {statusLabel}
                </RNText>
              </RNView>
            )}

            <RNView
              style={[
                styles.highlightedInfoRow,
                styles.highlightedInfoRowSpacing,
              ]}
            >
              <SvgXml
                xml={CallIcon()}
                width={`${horizontalScale(14)}`}
                height={`${verticalScale(14)}`}
              />
              <RNText style={styles.highlightedInfoText}>
                {reservation?.customer_phone || EMPTY_PLACEHOLDER}
              </RNText>
            </RNView>
          </RNView>

          <RNView style={styles.highlightedInfoContainer}>
            <RNView style={styles.highlightedInfoRow}>
              <SvgXml
                xml={CalendarIcon}
                width={`${horizontalScale(14)}`}
                height={`${verticalScale(14)}`}
              />
              <RNText style={styles.highlightedInfoText}>
                {(reservation?.reservation_date &&
                  formatDate(
                    reservation?.reservation_date || "",
                    Date_Format.DD_MM_YY,
                    false,
                  )) ||
                  EMPTY_PLACEHOLDER}
              </RNText>

              <RNView style={styles.infoDivider} />

              <UserIcon
                width={`${horizontalScale(10)}`}
                height={`${verticalScale(14)}`}
              />
              <RNText style={styles.highlightedInfoText}>
                {reservation?.total_guest || EMPTY_PLACEHOLDER}
              </RNText>

              <RNView style={styles.infoDivider} />

              <ClockIcon
                width={`${horizontalScale(14)}`}
                height={`${verticalScale(14)}`}
              />
              <RNText style={styles.highlightedInfoText}>
                {reservationTime || EMPTY_PLACEHOLDER}
              </RNText>
            </RNView>
          </RNView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent]}
          >
            <RNView style={[styles.sectionCard, styles.cardPadding]}>
              <RNText style={[styles.sectionTitle]}>
                {t("owner.reservation.details.summaryTitle")}
              </RNText>

              {reservationDetails.map((detail, index) => (
                <RNView
                  key={detail.label}
                  style={[
                    styles.itemRow,
                    index < reservationDetails.length - 1 &&
                      styles.itemRowDivider,
                  ]}
                >
                  <RNText style={[styles.itemTitle]}>{detail.label}</RNText>
                  <RNText style={styles.itemValue}>
                    {detail.value || EMPTY_PLACEHOLDER}
                  </RNText>
                </RNView>
              ))}
            </RNView>

            <RNView style={[styles.sectionCard, styles.cardPadding]}>
              <RNText style={[styles.sectionTitle]}>
                {t("owner.reservation.details.activityTimeline")}
              </RNText>
              <ActivityTimeline activities={reservationActivities} />
            </RNView>
          </ScrollView>
        </>
      </RNView>
      {shouldShowFooter && (
        <RNView
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + moderateScale(10) },
          ]}
        >
          {shouldShowEditButton && (
            <AppButton
              title={t("owner.reservation.details.editReservation")}
              variant="outlined"
              onPress={handleEditReservation}
              style={[styles.content, styles.shareButtonSpacing]}
            />
          )}

          <AppButton
            title={t("owner.reservation.details.callGuest")}
            onPress={handleCallGuest}
            disabled={!reservation}
            style={styles.content}
          />
        </RNView>
      )}
    </SafeAreaView>
  );
};

export default withSuccessScreen(withCustomAlert(ReservationDetailScreen));
