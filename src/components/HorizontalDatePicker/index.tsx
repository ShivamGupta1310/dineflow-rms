import React, { useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  ViewToken,
} from "react-native";

import styles from "./styles";
import { Locales } from "@utils/constants";

export interface DateItem {
  id: string;
  date: Date;
}

interface Props {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onLastVisibleDateChange?: (date: Date) => void;
  numberOfWeeks?: number;
  startDate?: Date;
}

const HorizontalDatePicker = ({
  selectedDate,
  onDateSelect,
  onLastVisibleDateChange,
  numberOfWeeks = 3,
  startDate,
}: Props) => {
  const flatListRef = useRef<FlatList<DateItem>>(null);
  const fallbackStartDateRef = useRef(new Date());
  const effectiveStartDate = startDate ?? fallbackStartDateRef.current;

  const dates = useMemo(() => {
    const totalDays = numberOfWeeks * 7;

    return Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(effectiveStartDate);

      date.setDate(effectiveStartDate.getDate() + index);

      return {
        id: `${index}`,
        date,
      };
    });
  }, [effectiveStartDate, numberOfWeeks]);

  const datesRef = useRef(dates);
  datesRef.current = dates;

  useEffect(() => {
    const currentDates = datesRef.current;

    if (!selectedDate || currentDates.length === 0) {
      return;
    }

    const index = currentDates.findIndex(
      (item) =>
        item.date.toDateString() === selectedDate.toDateString(),
    );

    if (index !== -1) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // Center selected item
        });
      });
    }
  }, [selectedDate]);

  const onLastVisibleDateChangeRef = useRef(onLastVisibleDateChange);
  onLastVisibleDateChangeRef.current = onLastVisibleDateChange;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      let lastVisibleDate: DateItem | undefined;

      for (const item of viewableItems) {
        const dateItem = item.item as DateItem;

        if (dateItem) {
          lastVisibleDate = dateItem;
        }
      }

      if (lastVisibleDate) {
        onLastVisibleDateChangeRef.current?.(lastVisibleDate.date);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem: ListRenderItem<DateItem> = ({ item }) => {
    const isSelected =
      selectedDate?.toDateString() === item.date.toDateString();

    return (
      <Pressable
        onPress={() => onDateSelect(item.date)}
        style={[
          styles.dateContainer,
          isSelected && styles.selectedDateContainer,
        ]}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedText]}>
          {item.date.toLocaleDateString(Locales.EN_US, {
            weekday: "short",
          })}
        </Text>

        <Text style={[styles.dateText, isSelected && styles.selectedText]}>
          {item.date.getDate()}
        </Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      data={dates}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContentContainer}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onScrollToIndexFailed={({ index }) => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      }}
    />
  );
};

export default HorizontalDatePicker;
