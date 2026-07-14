import React, { useContext } from "react";
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";

import { SVGS, TableSVG } from "@assets";
import { ROUTES } from "@constants/routes";
import QRCodeAccessScreen from "@screens/main/owner/qr-code-access";
import { RNText } from "@components";
import { colors } from "@theme/colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { typography } from "@theme/theme";
import { useTranslation } from "react-i18next";
import BillSummaryScreen from "@screens/main/owner/bill-summary";
import PaymentSuccessScreen from "@screens/main/owner/payment-success";
import {
  HomeStackNavigator,
  ReservationStackNavigator,
  TableStackNavigator,
} from "./OwnerStackNavigator";
import { GlobalContext } from "../contexts/global.provider";
import ReservationDetailScreen from "@screens/main/owner/reservation-details";
import NewReservation from "@screens/main/owner/new-reservation";
import ReserveTableScreen from "@screens/main/owner/reserve-table";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabLabelsKeys = {
  [ROUTES.HOME]: "common.home",
  [ROUTES.TABLES]: "common.table",
  [ROUTES.CENTER_PLACEHOLDER]: "",
  [ROUTES.RESERVATIONS]: "common.reservation",
  [ROUTES.PROFILE]: "common.employee",
} as const;

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.placeholderScreen}>
    <RNText style={styles.placeholderText}>{title}</RNText>
  </View>
);

const InactiveTableIcon = (props: React.ComponentProps<typeof TableSVG>) => (
  <TableSVG {...props} color={colors.primaryText} width={24} height={24} />
);

const TabIcon = ({
  ActiveIcon,
  InactiveIcon,
  isFocused,
  isPlaceholder,
}: {
  ActiveIcon: React.ComponentType<any>;
  InactiveIcon: React.ComponentType<any>;
  isFocused: boolean;
  isPlaceholder?: boolean;
}) =>
  isPlaceholder ? (
    <View />
  ) : isFocused ? (
    <ActiveIcon width={24} height={24} />
  ) : (
    <InactiveIcon width={24} height={24} />
  );

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const {
    QRCodeWhiteLogo,
    TabBarBg,
    HomeActiveIcon,
    HomeTabIcon,
    TableActiveIcon,
    ProfileActiveIcon,
    ProfileTabIcon,
    ReservationActiveIcon,
    ReservationTabIcon,
  } = SVGS;

  const handleCenterAction = () => {
    navigation.navigate(ROUTES.OWNER_QR_CODE_ACCESS);
  };

  const contextData = useContext(GlobalContext);
  const isRTL = contextData?.isRTL ?? false;

  return (
    <View style={styles.tabBarWrap}>
      <TabBarBg
        width={width}
        height={moderateScale(85)}
        style={styles.tabBackground}
      />

      <View style={[styles.tabBar, isRTL && styles.tabBarRTL]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const labelKey =
            tabLabelsKeys[route.name as keyof typeof tabLabelsKeys];
          const label = labelKey ? t(labelKey) : "";
          const IconMap: Record<
            string,
            {
              active: React.ComponentType<any>;
              inactive: React.ComponentType<any>;
            }
          > = {
            [ROUTES.HOME]: {
              active: HomeActiveIcon,
              inactive: HomeTabIcon,
            },
            [ROUTES.TABLES]: {
              active: TableActiveIcon,
              inactive: InactiveTableIcon,
            },
            [ROUTES.CENTER_PLACEHOLDER]: {
              active: ProfileTabIcon,
              inactive: ProfileTabIcon,
            },
            [ROUTES.RESERVATIONS]: {
              active: ReservationActiveIcon,
              inactive: ReservationTabIcon,
            },
            [ROUTES.PROFILE]: {
              active: ProfileActiveIcon,
              inactive: ProfileTabIcon,
            },
          };
          const Icon = IconMap[route.name];
          const isPlaceholder = route.name === ROUTES.CENTER_PLACEHOLDER;

          const onPress = () => {
            if (isPlaceholder) {
              return;
            }
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
              {Icon && (
                <TabIcon
                  ActiveIcon={Icon.active}
                  InactiveIcon={Icon.inactive}
                  isFocused={isFocused}
                  isPlaceholder={isPlaceholder}
                />
              )}
              <RNText
                style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}
              >
                {label}
              </RNText>
            </Pressable>
          );
        })}
      </View>
      <Pressable style={styles.centerAction} onPress={handleCenterAction}>
        <View style={styles.centerActionInner}>
          <QRCodeWhiteLogo width={30} height={30} />
        </View>
      </Pressable>
    </View>
  );
};

const renderOwnerTabBar = (props: BottomTabBarProps) => (
  <CustomTabBar {...props} />
);

const OwnerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={renderOwnerTabBar}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeStackNavigator} />
      <Tab.Screen name={ROUTES.TABLES} component={TableStackNavigator} />
      <Tab.Screen name={ROUTES.CENTER_PLACEHOLDER} children={() => <View />} />
      <Tab.Screen
        name={ROUTES.RESERVATIONS}
        component={ReservationStackNavigator}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        children={() => <PlaceholderScreen title="Employee" />}
      />
    </Tab.Navigator>
  );
};

const OwnerAppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.MAIN_TABS} component={OwnerTabs} />
      <Stack.Screen
        name={ROUTES.OWNER_QR_CODE_ACCESS}
        component={QRCodeAccessScreen}
      />
      <Stack.Screen
        name={ROUTES.PAYMENT_SUCCESS}
        component={PaymentSuccessScreen}
      />
      <Stack.Screen
        name={ROUTES.RESERVATIONS_DETAILS}
        component={ReservationDetailScreen}
      />
      <Stack.Screen name={ROUTES.BILL_SUMMARY} component={BillSummaryScreen} />
      <Stack.Screen name={ROUTES.NEW_RESERVATION} component={NewReservation} />
      <Stack.Screen name={ROUTES.RESERVE_TABLE} component={ReserveTableScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholderScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.appBackground,
  },
  placeholderText: {
    fontSize: moderateScale(18),
    color: colors.primaryText,
    fontWeight: "600",
  },
  tabBarWrap: {
    backgroundColor: colors.appBackground,
    height: verticalScale(85),
  },
  tabBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(18),
  },
  tabBarRTL: {
    flexDirection: "row-reverse",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(7),
    paddingTop: verticalScale(17),
  },
  tabLabel: {
    ...typography.regular_12,
    color: colors.primaryText,
    lineHeight: 16,
  },
  tabLabelFocused: {
    ...typography.semibold_12,
    color: colors.primary,
    lineHeight: 16,
  },
  centerAction: {
    position: "absolute",
    top: verticalScale(-30),
    alignSelf: "center",
    width: horizontalScale(56),
    height: horizontalScale(56),
    borderRadius: horizontalScale(41),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  centerActionInner: {
    width: horizontalScale(52),
    height: horizontalScale(52),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OwnerAppNavigator;
