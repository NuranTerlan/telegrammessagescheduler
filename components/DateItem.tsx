import {StyleSheet, Text} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {CELL_HEIGHT} from '../appConfig';

interface DateItemProps {
  content: string;
  index: number;
  translateY: Animated.SharedValue<number>;
}

const DateItem: React.FC<DateItemProps> = ({content, index, translateY}) => {
  const rStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 2) * CELL_HEIGHT,
      index * CELL_HEIGHT,
      (index + 2) * CELL_HEIGHT,
    ];

    const opacity = interpolate(
      translateY.value,
      inputRange,
      [0.2, 1, 0.2],
      Extrapolate.CLAMP,
    );

    const rotateX = interpolate(translateY.value, inputRange, [-70, 0, 70]);

    return {opacity, transform: [{rotateX: `${rotateX}deg`}]};
  });

  return (
    <Animated.View style={[styles.dateItem, rStyle]}>
      <Text style={styles.dateItemText}>{content}</Text>
    </Animated.View>
  );
};

export default React.memo(DateItem);

const styles = StyleSheet.create({
  dateItem: {
    height: CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateItemText: {
    fontSize: 18,
    color: '#010101',
    fontWeight: '400',
  },
});
