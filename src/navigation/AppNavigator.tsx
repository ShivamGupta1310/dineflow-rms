import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import OwnerAppNavigator from "@navigation/OwnerAppNavigator";
import WaiterAppNavigator from "@navigation/WaiterAppNavigator";
import { CAPTAIN_ROLE, OWNER_ROLE } from "@utils/authSession";

const AppNavigator = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  if (role === OWNER_ROLE) {
    return <OwnerAppNavigator />;
  }

  if (role === CAPTAIN_ROLE) {
    return <WaiterAppNavigator />;
  }

  return null;
};

export default AppNavigator;
