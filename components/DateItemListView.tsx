import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import {CELL_HEIGHT} from '../appConfig';
import DateItem from './DateItem';
import {format} from 'date-fns';

interface DateItemListViewProps {
  data: Date[];
  representationFormat: string;
  setItem: React.Dispatch<React.SetStateAction<string | undefined>>;
  initialTranslation?: number;
  firstValueRepresentation?: string;
  flex?: number;
  paddingRight?: number;
  paddingLeft?: number;
}

const DateItemListView: React.FC<DateItemListViewProps> = ({
  data,
  representationFormat,
  setItem,
  initialTranslation = 0,
  firstValueRepresentation = null,
  flex = 1,
  paddingRight = 0,
  paddingLeft = 0,
}) => {
  const translateY = useSharedValue<number>(initialTranslation);

  const scrollHandler = useAnimatedScrollHandler(e => {
    translateY.value = e.contentOffset.y;
  });

  const formatItem = (index: number, item: Date) =>
    index === 0 && firstValueRepresentation
      ? firstValueRepresentation
      : format(item, representationFormat);

  const setItemOnJS = (index: number, item?: Date) => {
    setItem(formatItem(index, item ?? data[index]));
  };

  useAnimatedReaction(
    () => Math.round(translateY.value / CELL_HEIGHT),
    (result, prevResult) => {
      if (result !== prevResult && result > -1 && result < data.length) {
        runOnJS(setItemOnJS)(result);
      }
    },
    [translateY],
  );

  const dateItemComponent = useCallback(
    ({item: day, index}: {item: Date; index: number}) => (
      <DateItem
        key={day.toString()}
        content={formatItem(index, day)}
        index={index}
        translateY={translateY}
      />
    ),
    [],
  );

  const dateItemListKeyExtractor = useCallback(
    (day: Date) => day.toString(),
    [],
  );

  return (
    <Animated.FlatList
      // bounces={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      initialNumToRender={data.length}
      style={[styles.container, {flexGrow: flex}]}
      contentContainerStyle={{
        paddingVertical: CELL_HEIGHT * 2,
        paddingRight,
        paddingLeft,
      }}
      contentOffset={{y: initialTranslation, x: 0}}
      snapToInterval={CELL_HEIGHT}
      decelerationRate={0}
      data={data}
      showsVerticalScrollIndicator={false}
      keyExtractor={dateItemListKeyExtractor}
      renderItem={dateItemComponent}
    />
  );
};

export default DateItemListView;

const styles = StyleSheet.create({
  container: {
    // borderRightWidth: 1,
    // borderLeftWidth: 1,
    // borderColor: '#000',
  },
});
