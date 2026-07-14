import React, { useContext } from "react";
import { FlatList, Pressable, Text } from "react-native";

import styles from "./styles";
import { colors } from "@theme/colors";
import { RNView } from "@components";
import { GlobalContext } from "../../contexts/global.provider";

export interface TabItem {
  id: string;
  title: string;
  status: string;
  count?: number;
  showCount?: boolean;
  activeBorderColor?: string;
  activeBackgroundColor?: string;
  activeTextColor?: string;
  inactiveBorderColor?: string;
  inactiveBackgroundColor?: string;
  inactiveTextColor?: string;
  dotColor?: string;
}

interface Props {
  tabs: TabItem[];
  selectedStatus: string;
  onTabPress: (item: TabItem) => void;
}

const HorizontalStatusTabs: React.FC<Props> = ({
  tabs,
  selectedStatus,
  onTabPress,
}) => {
  const contextData = useContext(GlobalContext);
  const isRTL = Boolean(contextData?.isRTL);
  const displayTabs = isRTL ? [...tabs].reverse() : tabs;

  const renderItem = ({ item }: { item: TabItem }) => {
    const isSelected = item.status === selectedStatus;

    return (
      <Pressable
        testID={`horizontal-status-tab-${item.id}`}
        onPress={() => onTabPress(item)}
        style={[
          styles.tabButton,
          isRTL && styles.tabButtonRtl,
          {
            borderColor: isSelected
              ? item.activeBorderColor || colors.statusAvailable
              : item.inactiveBorderColor || "transparent",

            backgroundColor: isSelected
              ? item.activeBackgroundColor || colors.white
              : item.inactiveBackgroundColor || colors.white,
          },
        ]}
      >
        <RNView style={styles.row}>
          {!!item.dotColor && (
            <RNView
              style={[
                styles.dot,
                {
                  backgroundColor: item.dotColor,
                },
              ]}
            />
          )}

          <Text
            style={[
              styles.tabText,
              {
                color: isSelected
                  ? item.activeTextColor || colors.primaryText
                  : item.inactiveTextColor || colors.primaryText,
              },
            ]}
          >
            {item.title}

            {item.showCount !== false && ` (${item.count})`}
          </Text>
        </RNView>
      </Pressable>
    );
  };

  return (
    <RNView testID="horizontal-status-tabs">
      <FlatList
        testID="horizontal-status-tabs-list"
        horizontal
        data={displayTabs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          isRTL && styles.contentContainerRtl,
        ]}
      />
    </RNView>
  );
};

export default React.memo(HorizontalStatusTabs);
