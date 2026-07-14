import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useTranslation } from "react-i18next";

import { SVGS } from "@assets";
import { ROUTES } from "@constants/routes";
import { RNText, RNView } from "@components";
import { colors } from "@theme/colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@utils/scale/scale";
import { typography } from "@theme/theme";
import { MenuActiveIcon, MenuInactiveIcon } from "@assets/svgXML";
import WaiterHomeStackNavigator from "./WaiterHomeStackNavigator";
import { GlobalContext } from "../contexts/global.provider";
import TableList from "@screens/main/waiter/tables";
import MenuScreen from "@screens/main/waiter/menu";
import OrderSummaryScreen from "@screens/main/waiter/order-summary";
import OrderConfirmedScreen from "@screens/main/waiter/order-summary/orderConfirmedScreen";
import BillGenerationScreen from "@screens/main/waiter/bill-generation";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICON_SIZE = moderateScale(24);
const tabLabelsKeys = {
  [ROUTES.WAITER_HOME_STACK]: "common.home",
  [ROUTES.MENU]: "common.menu",
  [ROUTES.TABLES]: "",
  [ROUTES.ORDERS]: "common.orders",
  [ROUTES.PROFILE]: "common.profile",
} as const;

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
    <ActiveIcon width={ICON_SIZE} height={ICON_SIZE} />
  ) : (
    <InactiveIcon width={ICON_SIZE} height={ICON_SIZE} />
  );
const MenuActive = (props: any) => <SvgXml xml={MenuActiveIcon} {...props} />;
const MenuInactive = (props: any) => (
  <SvgXml xml={MenuInactiveIcon} {...props} />
);
const PlaceholderScreen = ({ title }: { title: string }) => (
  <RNView style={styles.placeholderScreen}>
    <RNText style={styles.placeholderText}>{title}</RNText>
  </RNView>
);

const OrdersPlaceholder = () => <PlaceholderScreen title="Orders" />;
const ProfilePlaceholder = () => <PlaceholderScreen title="Profile" />;

const CustomTabBar = ({ state, navigation }: any) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const {
    TabBarBg,
    HomeActiveIcon,
    HomeTabIcon,
    ProfileActiveIcon,
    ProfileTabIcon,
    OrdersActiveIcon,
    OrdersInactiveIcon,
    TablesIcon,
  } = SVGS;

  const handleCenterAction = () => {
    navigation.navigate(ROUTES.TABLES);
  };

  const contextData = useContext(GlobalContext);
  const isRTL = contextData?.isRTL ?? false;

  return (
    <View style={styles.tabBarWrap}>
      <View style={[styles.tabBackgroundWrap, { width }]}>
        <TabBarBg width={width} height={85} style={styles.tabBackground} />
      </View>

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
            [ROUTES.WAITER_HOME_STACK]: {
              active: HomeActiveIcon,
              inactive: HomeTabIcon,
            },
            [ROUTES.MENU]: {
              active: MenuActive,
              inactive: MenuInactive,
            },
            [ROUTES.TABLES]: {
              active: () => null,
              inactive: () => null,
            },
            [ROUTES.ORDERS]: {
              active: OrdersActiveIcon,
              inactive: OrdersInactiveIcon,
            },
            [ROUTES.PROFILE]: {
              active: ProfileActiveIcon,
              inactive: ProfileTabIcon,
            },
          };
          const Icon = IconMap[route.name];
          const isPlaceholder = route.name === ROUTES.TABLES;

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
        <TablesIcon width={horizontalScale(56)} height={horizontalScale(56)} />
      </Pressable>
    </View>
  );
};

const renderWaiterTabBar = (props: any) => <CustomTabBar {...props} />;

const WaiterTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.WAITER_HOME_STACK}
      screenOptions={{ headerShown: false }}
      tabBar={renderWaiterTabBar}
    >
      <Tab.Screen
        name={ROUTES.WAITER_HOME_STACK}
        component={WaiterHomeStackNavigator}
      />
      <Tab.Screen name={ROUTES.MENU} component={MenuScreen} />
      <Tab.Screen name={ROUTES.TABLES} component={TableList} />
      <Tab.Screen name={ROUTES.ORDERS} component={OrdersPlaceholder} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfilePlaceholder} />
    </Tab.Navigator>
  );
};

const WaiterAppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.MAIN_TABS} component={WaiterTabs} />
      <Stack.Screen name={ROUTES.TABLE_MENU} component={MenuScreen} />
      <Stack.Screen
        name={ROUTES.ORDER_SUMMARY}
        component={OrderSummaryScreen}
      />
      <Stack.Screen
        name={ROUTES.ORDER_CONFIRMED}
        component={OrderConfirmedScreen}
      />
      <Stack.Screen
        name={ROUTES.BILL_GENERATION}
        component={BillGenerationScreen}
      />
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
    overflow: "visible",
  },
  tabBackgroundWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: verticalScale(85),
    backgroundColor: colors.transparent,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 14,
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
    top: verticalScale(-25),
    alignSelf: "center",
    width: horizontalScale(56),
    height: horizontalScale(56),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WaiterAppNavigator;
