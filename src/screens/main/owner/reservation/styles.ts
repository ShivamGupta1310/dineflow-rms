import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  headerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(6),
  },
  mainContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
    marginBottom: verticalScale(-40),
  },
  searchInputContainer: {
    marginTop: verticalScale(12),
  },
  searchInputInner: {
    borderWidth: 0,
    backgroundColor: colors.white,
    paddingHorizontal: horizontalScale(14),
  },
  reservationCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(18),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(10),
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  guestName: {
    ...typography.medium_16,
    color: colors.primaryText,
  },
  statusChip: {
    borderRadius: moderateScale(6),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(6),
    alignSelf: "flex-start",
  },
  statusChipPending: {
    backgroundColor: colors.warningBackgroundLight,
  },
  statusChipNeedConfirmation: {
    backgroundColor: colors.warningBackgroundSoft,
  },
  statusChipConfirmed: {
    backgroundColor: colors.successBackgroundLight,
  },
  statusChipReserved: {
    backgroundColor: colors.infoBackgroundLight,
  },
  statusChipCancelled: {
    backgroundColor: colors.lightOrange,
  },
  statusText: {
    ...typography.semibold_10,
    lineHeight: verticalScale(14),
    fontSize: 10,
  },
  statusTextPending: {
    color: colors.warningTextStrong,
  },
  statusTextNeedConfirmation: {
    color: colors.primary,
  },
  statusTextConfirmed: {
    color: colors.successText,
  },
  statusTextReserved: {
    color: colors.infoTextStrong,
  },
  statusTextCancelled: {
    color: colors.dangerTextStrong,
  },
  cardBody: {
    marginTop: verticalScale(15),
    flexDirection: "row",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    marginRight: horizontalScale(10),
  },
  detailIconRTL: {
    marginRight: 0,
    marginLeft: horizontalScale(10),
  },
  detailTextCompact: {
    marginBottom: verticalScale(14),
  },
  actionButton: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderateScale(50),
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDelete: {
    backgroundColor: colors.dangerBackgroundSoft,
  },
  actionButtonConfirm: {
    backgroundColor: colors.successBackgroundSoft,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...typography.regular_14,
    color: colors.grayDescText,
  },
  actionConatiner: {
    flex: 0.4,
    justifyContent: "flex-end",
  },
  actionMainConatiner: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    columnGap: 6,
  },
  actionDetailsContainer: {
    flex: 0.6,
  },
  reservationListContainer: {
    paddingBottom: verticalScale(28),
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: verticalScale(28),
  },
  detailText: {
    ...typography.regular_12,
    color: colors.primaryText,
  },
  dateSuffixText: {
    ...typography.medium_10,
    color: colors.primaryText,
    alignSelf: "flex-start",
    marginTop: -2,
  },
  dateContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateContentRTL: {
    flexDirection: "row-reverse",
  },
  modalTitle: {
    ...typography.medium_16,
  },
  canelTitle: {
    color: colors.red500,
  },
  confirmTitle: {
    color: colors.tableTimeText,
  },
});

export default styles;
