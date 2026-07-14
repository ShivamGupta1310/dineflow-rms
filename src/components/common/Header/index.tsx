import React, { useContext, useMemo } from "react";
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { GlobalContext } from "../../../contexts/global.provider";
import { RNText, RNView } from "@components";
import styles from "./styles";

export type HeaderAlignment = "left" | "center" | "right";

export interface HeaderAction {
  icon: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  alignment?: HeaderAlignment;
  leftAction?: HeaderAction;
  rightActions?: HeaderAction[];
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
  customContent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  leftContainerStyle?: StyleProp<ViewStyle>;
  rightContainerStyle?: StyleProp<ViewStyle>;
  childrenContainerStyle?: StyleProp<ViewStyle>;
  dividerStyle?: StyleProp<ViewStyle>;
  showDivider?: boolean;
  backgroundColor?: string;
  testID?: string;
  titleNumberOfLines?: number;
  subtitleNumberOfLines?: number;
}

interface HeaderActionButtonProps {
  action: HeaderAction;
  isRTL: boolean;
}

const HeaderActionButton = ({
  action,
  isRTL = false,
}: HeaderActionButtonProps): React.ReactElement => {
  const icon = (
    <RNView
      style={[
        styles.actionIcon,
        action.iconStyle,
        isRTL && styles.iconRtl
      ]}
    >
      {action.icon}
    </RNView>
  );

  const getContainerStyle = ({
    pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    styles.actionButton,
    pressed && styles.actionButtonPressed,
    action.disabled && styles.actionButtonDisabled,
    action.containerStyle,
  ];

  if (!action.onPress) {
    return <RNView style={getContainerStyle({ pressed: false })}>{icon}</RNView>;
  }

  return (
    <Pressable
      accessibilityLabel={action.accessibilityLabel}
      accessibilityRole="button"
      disabled={action.disabled}
      hitSlop={8}
      onPress={action.onPress}
      style={getContainerStyle}
      testID={action.testID}
    >
      {icon}
    </Pressable>
  );
};

const Header = ({
  title,
  subtitle,
  alignment = "left",
  leftAction,
  rightActions,
  leftSlot,
  centerSlot,
  rightSlot,
  children,
  customContent,
  containerStyle,
  contentStyle,
  titleContainerStyle,
  titleStyle,
  subtitleStyle,
  leftContainerStyle,
  rightContainerStyle,
  childrenContainerStyle,
  dividerStyle,
  showDivider = false,
  backgroundColor,
  titleNumberOfLines = 1,
  subtitleNumberOfLines = 1,
}: HeaderProps): React.ReactElement => {
   const contextData = useContext(GlobalContext);
  const isRTL = Boolean(contextData?.isRTL);

  const titleAlign = useMemo<"left" | "center" | "right">(() => {
    switch (alignment) {
      case "center":
        return "center";
      case "right":
        return "right";
      default:
        return "left";
    }
  }, [alignment]);

  const hasDefaultBody = useMemo(
    () =>
      Boolean(
        customContent ||
          centerSlot ||
          title ||
          subtitle ||
          leftSlot ||
          leftAction ||
          rightSlot ||
          rightActions?.length,
      ),
    [
      customContent,
      centerSlot,
      title,
      subtitle,
      leftSlot,
      leftAction,
      rightSlot,
      rightActions,
    ],
  );

  const headerContent = (
    <>
      <RNView
        style={[
          styles.leftContainer,
          leftContainerStyle,
        ]}
      >
        {leftSlot ??
          (leftAction ? (
            <HeaderActionButton action={leftAction} isRTL={isRTL} />
          ) : null)}
      </RNView>

      <RNView
        style={[
          styles.titleContainer,
          titleAlign === "center" && styles.titleContainerCenter,
          titleAlign === "right" && styles.titleContainerRight,
          titleContainerStyle,
        ]}
      >
        {centerSlot ?? (
          <RNView style={styles.textBlock}>
            {!!title && (
              <RNText
                numberOfLines={titleNumberOfLines}
                style={[
                  styles.title,
                  titleAlign === "center" && styles.titleCenter,
                  titleAlign === "left" && styles.titleLeft,
                  titleAlign === "right" && styles.titleRight,
                  titleStyle,
                ]}
              >
                {title}
              </RNText>
            )}

            {!!subtitle && (
              <RNText
                numberOfLines={subtitleNumberOfLines}
                style={[
                  styles.subtitle,
                  titleAlign === "center" && styles.subtitleCenter,
                  titleAlign === "left" && styles.subtitleLeft,
                  titleAlign === "right" && styles.subtitleRight,
                  subtitleStyle,
                ]}
              >
                {subtitle}
              </RNText>
            )}
          </RNView>
        )}
      </RNView>

      <RNView
        style={[
          styles.rightContainer,
          rightContainerStyle,
        ]}
      >
        {rightSlot ??
          rightActions?.map((action, index) => (
            <RNView
              key={action.testID || `header-action-${index}`}
              style={[
                index > 0 && styles.actionSpacing,
              ]}
            >
              <HeaderActionButton action={action}  />
            </RNView>
          ))}
      </RNView>
    </>
  );

  return (
    <RNView
      style={[
        styles.container,
        backgroundColor ? { backgroundColor } : null,
        containerStyle,
      ]}
    >
      {hasDefaultBody && (
        <RNView style={[styles.content, contentStyle]}>
          {customContent ?? headerContent}
        </RNView>
      )}

      {showDivider && (
        <RNView style={[styles.divider, dividerStyle]} />
      )}

      {!!children && (
        <RNView
          style={[styles.childrenContainer, childrenContainerStyle]}
        >
          {children}
        </RNView>
      )}
    </RNView>
  );
};

export default React.memo(Header);
