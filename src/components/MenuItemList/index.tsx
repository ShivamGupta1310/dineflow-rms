import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { RNView } from "@components";
import MenuItemCard from "./menuItemCard";
import styles from "./styles";
import { MenuItemWithQuantity } from "@appTypes";

interface Props {
  data: MenuItemWithQuantity[];
  onAdd: (item: MenuItemWithQuantity) => void;
  onRemove: (item: MenuItemWithQuantity) => void;
}

const MenuItemList = ({ data, onAdd, onRemove }: Props) => {
  const renderItem = useCallback(
    ({ item }: { item: MenuItemWithQuantity }) => (
      <MenuItemCard item={item} onAdd={onAdd} onRemove={onRemove} />
    ),
    [onAdd, onRemove],
  );

  return (
    <RNView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatlist}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        ListFooterComponent={<RNView style={styles.footer} />}
      />
    </RNView>
  );
};

export default React.memo(MenuItemList);
