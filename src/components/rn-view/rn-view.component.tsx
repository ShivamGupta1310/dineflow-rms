import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import {
  GlobalContext,
  GlobalContextType,
} from "../../contexts/global.provider";
import { ViewProps } from "./rn-view.component.props";

const styles = StyleSheet.create({
  rtlDirection: {
    direction: "rtl",
  },
  ltrDirection: {
    direction: "ltr",
  },
});

export const RNView = ({ children, style, ...rest }: ViewProps) => {
  const contextData: GlobalContextType | null = useContext(GlobalContext);
  if (!contextData) return;
  const { isRTL } = contextData;

  return (
    <View
      {...rest}
      style={[style, isRTL ? styles.rtlDirection : styles.ltrDirection]}
    >
      {children}
    </View>
  );
};
