import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { RNView } from "@components";
import { GlobalContext } from "../../contexts/global.provider";
import styles from "./styles";
import { SVGS } from "@assets";

interface AppHeaderProps {
  title?: string;
  onGoBack?: () => void;
  isLogo?: boolean;
}

const AppHeader = ({ title, onGoBack, isLogo }: AppHeaderProps) => {
  const contextData = React.useContext(GlobalContext);
  const isRTL = Boolean(contextData?.isRTL);
  return (
    <RNView style={styles.container}>
      {onGoBack && (
        <TouchableOpacity
          style={[styles.goBackContainer, isRTL && styles.iconRtl]}
          onPress={onGoBack}
        >
          <SVGS.Backlogo />
        </TouchableOpacity>
      )}
      <RNView style={[styles.titleContainer, isLogo && styles.logoContainer]}>
        {title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          isLogo && <SVGS.DineLogo />
        )}
      </RNView>
      <RNView style={styles.rightViewContainer} />
    </RNView>
  );
};

export default AppHeader;
