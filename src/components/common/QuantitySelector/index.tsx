import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";

import { RNText } from "@components/rn-text/rn-text.component";
import { RNView } from "@components/rn-view/rn-view.component";

import { AddIcon, MinusIcon } from "@assets/svgXML";
import { horizontalScale, verticalScale } from "@utils/scale/scale";

import styles from "./styles";

interface QuantitySelectorProps {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
  showAddButtonWhenZero?: boolean;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const QuantitySelector = ({
  quantity,
  onAdd,
  onRemove,
  disabled = false,
  iconSize = verticalScale(10),
  showAddButtonWhenZero = true,
  containerStyle,
}: QuantitySelectorProps) => {
  if (quantity === 0 && showAddButtonWhenZero) {
    return (
      <TouchableOpacity
        disabled={disabled}
        style={[styles.addButton, containerStyle]}
        onPress={onAdd}
      >
        <SvgXml
          xml={AddIcon()}
          width={horizontalScale(iconSize)}
          height={horizontalScale(iconSize)}
        />
      </TouchableOpacity>
    );
  }

  return (
    <RNView style={[styles.quantityContainer, containerStyle]}>
      <TouchableOpacity disabled={disabled} onPress={onRemove}>
        <SvgXml
          xml={MinusIcon()}
          width={horizontalScale(iconSize)}
          height={horizontalScale(iconSize)}
        />
      </TouchableOpacity>

      <RNText style={styles.quantity}>{quantity}</RNText>

      <TouchableOpacity disabled={disabled} onPress={onAdd}>
        <SvgXml
          xml={AddIcon()}
          width={horizontalScale(iconSize)}
          height={horizontalScale(iconSize)}
        />
      </TouchableOpacity>
    </RNView>
  );
};

export default QuantitySelector;
