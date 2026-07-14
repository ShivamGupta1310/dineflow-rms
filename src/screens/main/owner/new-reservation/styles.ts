import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { typography } from "@theme/theme";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  headerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(8),
  },
  headerContent: {
    minHeight: verticalScale(52),
  },
  headerAction: {
    backgroundColor: colors.white,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: horizontalScale(40),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    backgroundColor: colors.white,
  },
  headerButtonPressed: {
    opacity: 0.75,
  },
  headerIconWrap: {
    marginEnd: horizontalScale(6),
  },
  headerText: {
    ...typography.medium_12,
    color: colors.primaryText,
    includeFontPadding: false,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  dateViewContainer: {
    marginTop: verticalScale(15),
  },
  timeSlotContainer: {
    marginTop: verticalScale(10),
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(10),
    paddingStart: horizontalScale(16),
    paddingEnd: horizontalScale(10),
  },
  timeSlotTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
  },
  timeDateSlotConatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
    alignContent: "flex-end",
  },
  timeSlotDate: {
    ...typography.medium_16,
    color: colors.charcoalGray,
  },
  timeSlotCard: {
    marginEnd: horizontalScale(6),
    marginBottom: verticalScale(6),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.devider,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(76),
    width: horizontalScale(78),
  },
  selectedTimeSlotCard: {
    backgroundColor: colors.statusAvailableBG,
    borderColor: colors.availableBorder,
  },
  timeText: {
    ...typography.medium_12,
    color: colors.primaryText,
    textAlign: "center",
    lineHeight: verticalScale(18),
  },
  availableText: {
    marginTop: 5,
    ...typography.regular_12,
    color: colors.tableTimeText,
  },
  guestDetailsContainer: {
    marginTop: verticalScale(10),
    padding: moderateScale(16),
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    ...typography.semibold_16,
    color: colors.primaryText,
    marginBottom: verticalScale(6),
  },
  fieldSpacing: {
    marginTop: verticalScale(12),
  },
  inputLabelStyle: {
    ...typography.medium_14,
  },
  inputViewContainer: {
    minHeight: verticalScale(46),
    borderRadius: horizontalScale(50),
    paddingHorizontal: horizontalScale(16),
  },
  mobileInputSpacing: {
    paddingStart: horizontalScale(6),
  },
  mobilePrefixView: {
    borderEndWidth: 0,
    paddingEnd: horizontalScale(5),
    marginEnd: horizontalScale(5),
  },
  flagContainer: {
    width: horizontalScale(34),
    height: horizontalScale(34),
    borderRadius: horizontalScale(17),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightPink,
  },
  notesInputContainer: {
    minHeight: verticalScale(80),
    borderRadius: horizontalScale(20),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    alignItems: "flex-start",
  },
  createReservationBtnView: {
    backgroundColor: colors.white,
    padding: horizontalScale(20),
  },
  emptyText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    textAlign: "center",
    paddingVertical: verticalScale(20),
  },
    disabledCard: {
    opacity: 0.5,
  },
});

export default styles;
