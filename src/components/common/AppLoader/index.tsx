import React from "react";
import { ActivityIndicator } from "react-native";
import { colors } from "@theme/colors";
import { RNView } from "@components";
import styles from "./styles";

const AppLoader = () => {
  return (
    <RNView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
    </RNView>
  );
};

export default AppLoader;
