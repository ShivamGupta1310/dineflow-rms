import React, { useContext, useState } from "react";
import {
  LayoutChangeEvent,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { SVGS } from "@assets";
import { colors } from "@theme/colors";
import { horizontalScale } from "@utils/scale/scale";
import { RNText, RNView } from "@components";
import { GlobalContext } from "../../contexts/global.provider";

import styles from "./styles";

const { DownArrowIcon, PrimaryRightIcon } = SVGS;
const ICON_SIZE = horizontalScale(13);

type DropdownItem = Record<string, unknown>;

export interface AppDropdownProps<T extends DropdownItem> {
  data: T[];
  value: unknown;
  onChange: (item: T) => void;

  dropdownPosition?: "bottom" | "top";
  label?: string;
  isMandatory?: boolean;
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;

  containerStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  dropdownContainerStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  placeholderTextStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;

  borderColor?: string;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;

  errorMessage?: string;
  inModal?: boolean;
  disable?: boolean;

  loading?: boolean;
  noDataText?: string;
}

export function AppDropdown<T extends DropdownItem>({
  data,
  value,
  onChange,
  dropdownPosition = "bottom",
  label,
  isMandatory = false,
  labelKey = "label",
  valueKey = "value",
  placeholder = "Select",
  containerStyle,
  dropdownStyle,
  dropdownContainerStyle,
  itemTextStyle,
  selectedTextStyle,
  placeholderTextStyle,
  iconStyle,
  borderColor = colors.grayBorder,
  leftIcon,
  rightIcon,
  leftIconStyle,
  rightIconStyle,
  errorMessage,
  inModal = false,
  disable = false,
  loading = false,
  noDataText = "",
}: AppDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [leftIconWidth, setLeftIconWidth] = useState(0);
  const contextData = useContext(GlobalContext);
  const isRTL = contextData?.isRTL ?? false;
  const textDirectionStyle = isRTL ? styles.rtlText : styles.ltrText;
  const handleLeftIconLayout = (event: LayoutChangeEvent) => {
    setLeftIconWidth(event.nativeEvent.layout.width);
  };

  const renderEmptyState = () => (
    <RNView style={styles.emptyStateContainer}>
      <RNText style={styles.emptyStateText}>{noDataText}</RNText>
    </RNView>
  );

  return (
    <RNView style={[styles.container, containerStyle]}>
      {label && (
        <RNText style={styles.label}>
          {label}
          {isMandatory && <RNText style={styles.colorRed}>*</RNText>}
        </RNText>
      )}

      <RNView style={styles.inputWrapper}>
        {leftIcon && (
          <View
            style={[
              styles.iconLeftContainer,
              { borderEndColor: borderColor },
              leftIconStyle,
            ]}
            onLayout={handleLeftIconLayout}
          >
            {leftIcon}
          </View>
        )}
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Dropdown
            data={data}
            value={value}
            disable={disable}
            dropdownPosition={dropdownPosition}
            labelField={labelKey}
            valueField={valueKey}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            showsVerticalScrollIndicator={false}
            inverted={dropdownPosition === "top" ? false : undefined}
            style={[
              styles.dropdown,
              {
                borderColor,
                backgroundColor: disable ? colors.placeHolder : colors.white,
              },
              dropdownStyle,
              leftIcon && leftIconWidth > 0
                ? { paddingStart: leftIconWidth + horizontalScale(9) }
                : null,
            ]}
            containerStyle={[
              styles.dropdownContainer,
              styles.dropdownBaseDirection,
              { borderColor },
              dropdownContainerStyle,
              inModal && styles.modalExtraStyles,
            ]}
            selectedTextStyle={[
              disable ? styles.disableSelectedText : styles.selectedText,
              styles.flex1Text,
              selectedTextStyle,
            ]}
            placeholderStyle={[
              styles.placeholderText,
              styles.flex1Text,
              textDirectionStyle,
              {
                color: disable ? colors.placeHolder : colors.secondaryText,
              },
              placeholderTextStyle,
            ]}
            itemTextStyle={[
              styles.itemText,
              styles.flex1Text,
              textDirectionStyle,
              itemTextStyle,
            ]}
            iconStyle={[
              styles.iconStyle,
              isRTL && styles.iconStyleRtl,
              iconStyle,
            ]}
            flatListProps={{
              ListEmptyComponent: renderEmptyState,
            }}
            renderRightIcon={() =>
              rightIcon ? (
                <RNView style={rightIconStyle}>{rightIcon}</RNView>
              ) : (
                <DownArrowIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  style={[
                    styles.iconStyle,
                    isRTL && styles.iconStyleRtl,
                    iconStyle,
                    isOpen && styles.rotatedIcon,
                  ]}
                />
              )
            }
            renderItem={(item) => {
              const isSelected = String(value) === String(item[valueKey]);

              return (
                <RNView
                  key={String(item[valueKey])}
                  style={[
                    styles.itemContainer,
                    isSelected && styles.selectedItemContainer,
                  ]}
                >
                  <RNView
                    style={[
                      styles.singleItemRow,
                    ]}
                  >
                    <RNText
                      style={[styles.itemText, styles.flex1Text]}
                    >
                      {String(item[labelKey])}
                    </RNText>

                    {isSelected && (
                      <PrimaryRightIcon
                        style={[styles.tickIcon]}
                      />
                    )}
                  </RNView>
                </RNView>
              );
            }}
          />
        )}
      </RNView>

      {!!errorMessage && (
        <RNText style={styles.errorText}>{errorMessage}</RNText>
      )}
    </RNView>
  );
}
