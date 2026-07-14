import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import AppNavigator from "@navigation/AppNavigator";
import AuthNavigator from "@navigation/AuthNavigator";
import { ROUTES } from "@constants/routes";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { sessionId, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const shouldShowAppNavigator = isAuthenticated && Boolean(sessionId);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {shouldShowAppNavigator ? (
          <Stack.Screen name={ROUTES.APP} component={AppNavigator} />
        ) : (
          <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
