import { colors } from "@theme/colors";
import { typography } from "@theme/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  safeAreaRtl: {
    direction: "rtl",
  },
  headerContainer: {
    paddingHorizontal: verticalScale(20),
    paddingTop: verticalScale(8),
  },
  headerContent: {
    minHeight: verticalScale(40),
  },
  headerAction: {
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    gap: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
  },

  tableDetailViewContainer: {
    flexDirection: "row",
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(6),
    paddingStart: verticalScale(6),
    paddingEnd: verticalScale(20),
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    boxShadow: `0px 0px 20px 0px ${colors.menuCardShadow}`,
  },
  tableIconContainer: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: moderateScale(8),
    backgroundColor: colors.lightPink,
    justifyContent: "center",
    alignItems: "center",
  },
  tableDetailLeftView: {
    flexDirection: "row",
    gap: verticalScale(10),
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tableDetailContainer: {
    gap: verticalScale(5),
  },
  textTableDetail: {
    ...typography.medium_14,
    color: colors.lightBlack,
    includeFontPadding: false,
  },
  textGuestCount: {
    ...typography.regular_12,
    color: colors.mediumGray,
    includeFontPadding: false,
  },
  textChangeButton: {
    ...typography.regular_16,
    color: colors.primary,
  },

  cardContainerView: {
    borderRadius: moderateScale(16),
    padding: verticalScale(16),
    gap: verticalScale(20),
    backgroundColor: colors.white,
    boxShadow: `0px 0px 20px 0px ${colors.menuCardShadow}`,
  },
  textCardHeading: {
    ...typography.semibold_16,
    color: colors.primaryText,
  },
  divider: {
    height: verticalScale(1),
    marginVertical: verticalScale(10),
    backgroundColor: colors.dividerColor,
  },
  guestDetailsContainer: {
    gap: verticalScale(14),
  },
  inputLabelStyle: {
    ...typography.medium_14,
    color: colors.primaryText,
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
    borderEndWidth: verticalScale(0),
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

  bottomButtonView: {
    backgroundColor: colors.white,
    paddingBottom: verticalScale(32),
  },
  confirmButton: {
    marginTop: verticalScale(24),
    marginHorizontal: verticalScale(20),
  },

  orderConfirmContent: {
    gap: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
  },
  successIcon: {
    alignSelf: "center",
  },
  textOrderConfirmed: {
    ...typography.medium_20,
    color: colors.primaryText,
  },
  itemsNameText: {
    ...typography.medium_14,
    color: colors.primaryText,
  },
  highlightedInfoContainer: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(14),
  },
  infoContainer: {
    gap: verticalScale(10),
  },
  highlightedInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "40%",
  },
  highlightedInfoText: {
    ...typography.regular_14,
    color: colors.secondaryText,
    marginStart: horizontalScale(4),
  },
  textRight: {
    textAlign: "right",
  },
  infoDivider: {
    width: verticalScale(1),
    height: verticalScale(16),
    backgroundColor: colors.grayBorder,
    marginHorizontal: horizontalScale(16),
  },

  quoteSection: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  quoteMark: {
    position: "absolute",
  },
  quoteText: {
    textAlign: "center",
    color: colors.primaryText,
    ...typography.regular_16,
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(18),
  },
  emptyText: {
    ...typography.regular_14,
    color: colors.primaryText,
    textAlign: "center",
  },
});

export default styles;
