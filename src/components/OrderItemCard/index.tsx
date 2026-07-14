import React, { ReactNode } from "react";
import { RNView } from "@components/rn-view/rn-view.component";
import { Image, ImageStyle } from "react-native";
import { moderateScale } from "@utils/scale/scale";
import { RNText } from "@components/rn-text/rn-text.component";
import { FoodPlaceholderIcon } from "@assets/svgXML";
import { SvgXml } from "react-native-svg";
import { styles } from "./styles";

export interface OrderItemCardProps {
  itemName: string;
  description?: string;
  imageUrl?: string | null;
  trailingComponent?: ReactNode;
  imageStyle?: ImageStyle;
}

const OrderItemCard = ({
  itemName,
  description,
  imageUrl,
  trailingComponent,
  imageStyle,
}: OrderItemCardProps) => {
  return (
    <RNView style={styles.itemRow}>
      <RNView style={[styles.itemImageView, imageStyle]}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.itemImageView, imageStyle]}
            resizeMode="cover"
          />
        ) : (
          <SvgXml
            xml={FoodPlaceholderIcon}
            width={moderateScale(20)}
            height={moderateScale(20)}
          />
        )}
      </RNView>

      <RNView style={styles.itemMainView}>
        <RNText style={styles.itemsNameText} numberOfLines={2}>
          {itemName}
        </RNText>

        {description && (
          <RNText style={styles.itemDescText} numberOfLines={2}>
            {description}
          </RNText>
        )}
      </RNView>

      {trailingComponent && (
        <RNView style={styles.trailingContainer}>{trailingComponent}</RNView>
      )}
    </RNView>
  );
};

export default OrderItemCard;
