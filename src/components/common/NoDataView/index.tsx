import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { SvgXml } from "react-native-svg";

import { RNText, RNView } from "@components";
import AppButton from "../AppButton";
import styles from "./styles";
import { RefreshIcon } from "@assets/svgXML";

interface NoDataViewProps {
  image?: React.ReactNode;
  title: string;
  message?: string;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const NoDataView = ({
  image,
  title,
  message,
  showRefreshButton = false,
  onRefresh,
  style,
  testID = "no-data-view",
}: NoDataViewProps) => {
  const { t } = useTranslation();

  return (
    <RNView style={[styles.container, style]} testID={testID}>
      {!!image && <RNView style={styles.imageContainer}>{image}</RNView>}
      <RNText style={styles.title} testID={`${testID}-title`}>
        {title}
      </RNText>
      {!!message && (
        <RNText style={styles.message} testID={`${testID}-message`}>
          {message}
        </RNText>
      )}
      {!!(showRefreshButton && onRefresh) && (
        <AppButton
          variant="outlined"
          title={t("common.refresh")}
          leftIcon={<SvgXml xml={RefreshIcon} />}
          onPress={onRefresh}
          style={styles.refreshButton}
          textStyle={styles.refreshText}
          testID={`${testID}-refresh-button`}
        />
      )}
    </RNView>
  );
};

export default NoDataView;
