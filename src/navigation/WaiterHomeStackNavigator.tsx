import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ROUTES } from "@constants/routes";
import DashboardScreen from "@screens/main/waiter/dashboard";

const Stack = createNativeStackNavigator();

const WaiterHomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.HOME} component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export default WaiterHomeStackNavigator;
