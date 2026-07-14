import React from "react";
import { RNText, RNView } from "@components";
import { Image } from "react-native";
import styles from "./styles";
import { SvgXml } from "react-native-svg";
import { FoodPlaceholderIcon } from "@assets/svgXML";
import { MenuItemWithQuantity } from "@appTypes";
import QuantitySelector from "@components/common/QuantitySelector";

interface Props {
  item: MenuItemWithQuantity;
  onAdd: (item: MenuItemWithQuantity) => void;
  onRemove: (item: MenuItemWithQuantity) => void;
}

const MenuItemCard = ({ item, onAdd, onRemove }: Props) => {
  return (
    <RNView style={styles.card}>
      {item.image_url ? (
        <RNView style={styles.itemIconWrap}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
        </RNView>
      ) : (
        <RNView style={styles.centerIcon}>
          <SvgXml xml={FoodPlaceholderIcon} />
        </RNView>
      )}
      <RNView style={styles.content}>
        <RNText style={styles.title}>{item.name}</RNText>

        <RNText numberOfLines={2} style={styles.description}>
          {item.description}
        </RNText>

        <RNView style={styles.bottomRow}>
          <RNText style={styles.price}>₹{item.price}</RNText>
          <QuantitySelector
            quantity={item.quantity}
            onAdd={() => onAdd(item)}
            onRemove={() => onRemove(item)}
          />
        </RNView>
      </RNView>
    </RNView>
  );
};

export default React.memo(MenuItemCard);
