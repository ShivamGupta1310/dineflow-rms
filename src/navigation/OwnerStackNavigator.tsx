import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ROUTES } from "@constants/routes";
import DashboardScreen from "@screens/main/owner/dashboard";
import ReservationScreen from "@screens/main/owner/reservation";
import TableList from "@screens/main/owner/tables";

const Stack = createNativeStackNavigator();

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.HOME} component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export const ReservationStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.RESERVATIONS} component={ReservationScreen} />
      </Stack.Navigator>
  );
};

export const TableStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.TABLES} component={TableList} />
    </Stack.Navigator>
  );
};
