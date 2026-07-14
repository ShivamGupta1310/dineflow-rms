import React, { useCallback } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { RNText, RNView } from "@components";
import styles from "./styles";
import { SVGS } from "@assets";
import { MenuCategory } from "@appTypes";
import { horizontalScale } from "@utils/scale/scale";

interface Props {
  data: MenuCategory[];
  selectedCategory: MenuCategory | null;
  onSelect: (category: MenuCategory) => void;
}

const { DishIcon } = SVGS;

const MenuSubCategoryList = ({ data, selectedCategory, onSelect }: Props) => {
  const renderItem = useCallback(
    ({ item }: { item: MenuCategory }) => {
      const isSelected = selectedCategory?.id === item.id;
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.itemContainer,
            isSelected && styles.selectedItemContainer,
          ]}
          onPress={() => onSelect(item)}
        >
          {item.img_url ? (
            <RNView style={styles.itemIconWrap}>
              <Image
                source={{ uri: encodeURI(item.img_url) }}
                style={styles.image}
                resizeMode="cover"
              />
            </RNView>
          ) : (
            <RNView style={styles.centerIcon}>
              <DishIcon
                width={horizontalScale(20)}
                height={horizontalScale(20)}
              />
            </RNView>
          )}

          <RNText style={styles.title} numberOfLines={2}>
            {item.name}
          </RNText>
        </TouchableOpacity>
      );
    },
    [selectedCategory, onSelect],
  );

  return (
    <RNView>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
      />
    </RNView>
  );
};

export default React.memo(MenuSubCategoryList);
