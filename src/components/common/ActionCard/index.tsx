import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { RNText, RNView } from "@components";
import { GlobalContext } from "../../../contexts/global.provider";
import styles from "./styles";

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  subtitle?: string;
  rightContainer?: React.ReactNode;
  titleStyle?: StyleProp<ViewStyle>;
  subtitleStyle?: StyleProp<ViewStyle>;
}

const ActionCard = ({
  icon,
  title,
  onPress,
  style,
  testID,
  subtitle,
  rightContainer,
  titleStyle,
  subtitleStyle,
}: ActionCardProps) => {
  const contextData = React.useContext(GlobalContext);
  const isRTL = Boolean(contextData?.isRTL);

  return (
    <Pressable onPress={onPress} style={[styles.button, style]} testID={testID}>
      <RNView style={[styles.iconContainer]}>{icon}</RNView>
      <RNView style={styles.titleConatiner}>
        <RNView>
          <RNText style={titleStyle || styles.title}>{title}</RNText>
          {subtitle && (
            <RNText style={subtitleStyle || styles.subtitle}>{subtitle}</RNText>
          )}
        </RNView>
      </RNView>
      <RNView style={[styles.iconConatiner]}>
        {rightContainer || (
          <RNText style={[styles.arrow, isRTL && styles.arrowRtl]}>
            {"›"}
          </RNText>
        )}
      </RNView>
    </Pressable>
  );
};

export default ActionCard;
