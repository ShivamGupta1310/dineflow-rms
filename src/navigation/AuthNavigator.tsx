import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import Login from "@screens/auth/owner";
import { ROUTES } from "@constants/routes";
import VerifyOtp from "@screens/auth/verify-otp";
import WaiterSelection from "@screens/auth/waiter-selection";
import OnBoardingScreen from "@screens/auth/waiter/onboarding";
import ScannerScreen from "@screens/auth/waiter/scanner";
import WaiterPasscode from '@screens/auth/waiter-passcode';
import { RootState } from "@store";
import { StorageKeys } from "@utils/constants";
import { getItem } from "@utils/storage";
import { CAPTAIN_ROLE } from "@utils/authSession";

const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  const waiterPasscode = getItem(StorageKeys.RESTAURANT_ACCESS_CODE);
  const isCaptainLoggedIn = !!waiterPasscode && role === CAPTAIN_ROLE;
  const initialRouteName = isCaptainLoggedIn
    ? ROUTES.WAITER_LIST
    : ROUTES.LOGIN;
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={ROUTES.VERIFICATION} component={VerifyOtp} />
      <Stack.Screen name={ROUTES.WAITER_LIST} component={WaiterSelection} />
      <Stack.Screen
        name={ROUTES.WAITER_ONBOARDING}
        component={OnBoardingScreen}
      />
      <Stack.Screen name={ROUTES.WAITER_SCANNER} component={ScannerScreen} />
      <Stack.Screen name={ROUTES.WAITER_PASSCODE} component={WaiterPasscode} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
