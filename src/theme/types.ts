export interface ThemeColors {
  error: string;
  success: string;
  transparent: string;
  primary: string;
  white: string;
  black: string;
  gray: string;
  appBackground: string;
  lightBlack: string;
  darkGray: string;
  primaryText: string;
  secondaryText: string;
  grayBorder: string;
  lightPink: string;
  placeHolder: string;
  mediumGray: string;
  transparentBlack: string;
  neutral600: string;
  grayDescText: string;
  devider: string;
  ownerHeaderDateText: string;
  successBackground: string;
  successText: string;
  errorBackground: string;
  errorText: string;
  statusAvailable: string;
  statusOccupied: string;
  statusReserved: string;
  statusConfirmed: string;
  statusReadyToPay: string;
  statusAvailableBG: string;
  statusOccupiedBG: string;
  statusReservedBG: string;
  statusReadyToPayBG: string;
  cardShadow: string;
  warningBackgroundLight: string;
  warningBackgroundSoft: string;
  successBackgroundLight: string;
  infoBackgroundLight: string;
  dangerBackgroundLight: string;
  warningTextStrong: string;
  infoTextStrong: string;
  dangerTextStrong: string;
  dangerBackgroundSoft: string;
  successBackgroundSoft: string;
  tableTimeText: string;
  gray500: string;
  lightOrange: string;
  red500: string;
  backdropColor: string;
  dividerColor: string;
  detailsDividerColor: string;
  dateDayText: string;
  availableBorder: string;
  availableBG: string;
  shadowColor: string;
  cherryRed: string;
  charcoalGray: string
  menuChipBackground: string;
  descriptionText: string;
  cartIconBg: string;
  menuCardShadow: string;
  vibrantGreen: string;
  atlanticBlue: string;
}

export interface TypographyVariant {
  fontSize: number;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  lineHeight?: number;
  fontFamily?: string;
}

export interface ThemeTypography {
  semibold_36: TypographyVariant;
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  semibold_20: TypographyVariant;
  semibold_18: TypographyVariant;
  medium_16: TypographyVariant;
  semibold_16: TypographyVariant;
  regular_14: TypographyVariant;
  medium_14: TypographyVariant;
  regular_12: TypographyVariant;
  regular_16: TypographyVariant;
  medium_20: TypographyVariant;
  bold_12: TypographyVariant;
  medium_10: TypographyVariant;
  semibold_12: TypographyVariant;
  semibold_26: TypographyVariant;
  medium_12: TypographyVariant;
  semibold_10: TypographyVariant;
}

export interface ThemeSpacing {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
}

export interface AppTheme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  isDark: boolean;
}
