import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import styles from "./styles";
import {
  AppButton,
  AppDropdown,
  AppLoader,
  AppTextInput,
  Header,
  HorizontalDatePicker,
  RNText,
  RNView,
} from "@components";
import { SVGS } from "@assets";
import { useNewReservation } from "./useNewReservation";
import { formatDate } from "@utils";
import { KeyboardBottomOffset, moderateScale } from "@utils/scale/scale";
import withSuccessScreen, {
  SuccessScreenController,
} from "../../../../hoc/withSuccessScreen";
import { Date_Format } from "@utils/constants";
import { TimeSlot } from "@store/slices/ownerTablesSlice";
import moment from "moment";

const { Backlogo, DateTimeIcon, IndiaFlag } = SVGS;

const NewReservation: React.FC<SuccessScreenController> = ({
  showSuccessScreen,
  hideSuccessScreen,
}) => {
  const {
    t,
    navigation,
    selectedDate,
    setLastVisibleDate,
    monthYear,
    selectedTimeSlot,
    setSelectedTimeSlot,
    fullName,
    setFullName,
    guestCount,
    setGuestCount,
    mobileNumber,
    mobileErrorText,
    handleMobileChange,
    reservationTypes,
    reservationType,
    setReservationType,
    sourceTypes,
    source,
    setSource,
    notes,
    setNotes,
    COUNTRY_CODE,
    timeSlots,
    isCreateReservationDisabled,
    handleCreateReservation,
    loading,
    reservationData,
    metaLoading,
    loadingTimeSlots,
    routeSlotId,
    handleDateChanged,
  } = useNewReservation({
    showSuccessScreen,
    hideSuccessScreen,
  });
  const insets = useSafeAreaInsets();

  const renderTimeSlotItem = ({ item: slot }: { item: TimeSlot }) => {
    const isSelected = selectedTimeSlot === slot.slot_id;
    const isDisabled = routeSlotId !== slot.slot_id && !slot.is_available;
    const slotTime = moment(slot.start_time, Date_Format.HH_mm_ss);
    const formattedTime = slotTime.format(Date_Format.hh_mm);
    const meridiem = slotTime.format("A");

    return (
      <Pressable
        onPress={() => setSelectedTimeSlot(slot?.slot_id)}
        style={[
          styles.timeSlotCard,
          isSelected && styles.selectedTimeSlotCard,
          isDisabled && styles.disabledCard,
        ]}
        disabled={isDisabled}
      >
        <RNText style={styles.timeText}>{formattedTime}</RNText>
        <RNText style={styles.timeText}>{meridiem}</RNText>
        <RNText style={styles.availableText}>
          {`${slot?.booked || 0}/${slot?.max_capacity ?? 0}`}
        </RNText>
      </Pressable>
    );
  };

  const renderGuestdetail = () => {
    return (
      <View style={styles.guestDetailsContainer}>
        <RNText style={styles.sectionTitle}>
          {t("owner.newReservation.guestDetail")}
        </RNText>
        <AppTextInput
          label={t("owner.newReservation.fullName")}
          placeholder={t("owner.newReservation.enterFullName")}
          value={fullName}
          onChangeText={setFullName}
          containerStyle={styles.fieldSpacing}
          labelStyle={styles.inputLabelStyle}
          inputContainerStyle={styles.inputViewContainer}
        />
        <AppTextInput
          label={t("owner.newReservation.guestCount")}
          placeholder={t("owner.newReservation.enterGuestCount")}
          value={guestCount}
          onChangeText={(text) => {
            setGuestCount(text.replace(/[^0-9]/g, ""));
          }}
          keyboardType="number-pad"
          containerStyle={styles.fieldSpacing}
          labelStyle={styles.inputLabelStyle}
          inputContainerStyle={styles.inputViewContainer}
        />
        <AppTextInput
          label={t("owner.newReservation.mobile")}
          placeholder={t("owner.newReservation.enterMobileNumber")}
          keyboardType="number-pad"
          maxLength={10}
          value={mobileNumber}
          onChangeText={handleMobileChange}
          error={mobileErrorText ?? undefined}
          leftAccessory={
            <RNView style={styles.flagContainer}>
              <IndiaFlag height={20} width={20} />
            </RNView>
          }
          prefix={`+${COUNTRY_CODE}`}
          prefixContainerStyle={styles.mobilePrefixView}
          containerStyle={styles.fieldSpacing}
          labelStyle={styles.inputLabelStyle}
          inputContainerStyle={[
            styles.inputViewContainer,
            styles.mobileInputSpacing,
          ]}
        />
        <AppDropdown
          label={t("owner.newReservation.reservationType")}
          data={reservationTypes as any}
          value={reservationType}
          onChange={(item) => setReservationType(item?.id as number)}
          labelKey="name"
          valueKey="id"
          containerStyle={styles.fieldSpacing}
          dropdownPosition="bottom"
          noDataText={t("owner.newReservation.error.typeError")}
        />
        <AppDropdown
          label={t("owner.newReservation.source")}
          data={sourceTypes as any}
          value={source}
          onChange={(item) => setSource((item as { id: number }).id)}
          labelKey="name"
          valueKey="id"
          containerStyle={styles.fieldSpacing}
          dropdownPosition="bottom"
          noDataText={t("owner.newReservation.error.sourceError")}
        />
        <AppTextInput
          label={t("owner.newReservation.notes")}
          placeholder={t("owner.newReservation.addSpecialNotes")}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          containerStyle={styles.fieldSpacing}
          labelStyle={styles.inputLabelStyle}
          inputContainerStyle={[
            styles.inputViewContainer,
            styles.notesInputContainer,
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <RNView style={styles.container}>
        {metaLoading || loadingTimeSlots ? <AppLoader /> : null}
        <Header
          title={`${!reservationData ? t("common.new") : t("common.edit")} ${t(
            "owner.newReservation.header.title",
          )}`}
          leftAction={{
            icon: <Backlogo />,
            onPress: () => navigation.goBack(),
            containerStyle: styles.headerAction,
          }}
          rightSlot={
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed,
              ]}
            >
              <RNView style={styles.headerIconWrap}>
                <DateTimeIcon />
              </RNView>
              <RNText style={styles.headerText}>{monthYear}</RNText>
            </Pressable>
          }
          containerStyle={styles.headerContainer}
          contentStyle={styles.headerContent}
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bottomOffset={KeyboardBottomOffset}
        >
          <RNView style={styles.dateViewContainer}>
            <HorizontalDatePicker
              numberOfWeeks={3}
              selectedDate={selectedDate}
              onDateSelect={handleDateChanged}
              onLastVisibleDateChange={setLastVisibleDate}
            />
          </RNView>
          <RNView style={styles.timeSlotContainer}>
            <RNView style={styles.timeDateSlotConatiner}>
              <RNText style={styles.timeSlotTitle}>
                {t("owner.newReservation.timeSlotTitle")}
              </RNText>
              {selectedDate && (
                <RNText style={styles.timeSlotDate}>
                  {formatDate(selectedDate, Date_Format.DD_MMMM_YYYY)}
                </RNText>
              )}
            </RNView>
            {!loadingTimeSlots && (
              <FlatList
                data={timeSlots}
                numColumns={4}
                scrollEnabled={false}
                keyExtractor={(slot) => String(slot.slot_id)}
                renderItem={renderTimeSlotItem}
                ListEmptyComponent={
                  <RNText style={styles.emptyText}>
                    {t("owner.reservation.reservedTable.noSlotsAvailable")}
                  </RNText>
                }
              />
            )}
          </RNView>
          {renderGuestdetail()}
        </KeyboardAwareScrollView>
        <RNView
          style={[
            styles.createReservationBtnView,
            { paddingBottom: insets.bottom + moderateScale(10) },
          ]}
        >
          <AppButton
            title={`${
              !reservationData ? t("common.create") : t("common.update")
            } ${t("owner.newReservation.header.title")}`}
            onPress={handleCreateReservation}
            loading={loading}
            disabled={isCreateReservationDisabled}
            testID="owner-login-continue"
          />
        </RNView>
      </RNView>
    </SafeAreaView>
  );
};

export default withSuccessScreen(NewReservation);
