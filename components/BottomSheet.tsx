import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {BOTTOM_SHEET_BR, COMMON_MARGIN} from '../appConfig';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';

interface BottomSheetProps {
  children: React.ReactNode;
  translateY: Animated.SharedValue<number>;
}

const {width} = Dimensions.get('screen');

export const scrollToWithSpring = (
  translateY: Animated.SharedValue<number>,
  destination: number,
  userConfig?: WithSpringConfig | undefined,
) => {
  'worklet';

  translateY.value = withSpring(destination, {
    damping: 18,
    ...userConfig,
  });
};

const BottomSheet: React.FC<BottomSheetProps> = ({children, translateY}) => {
  const [sheetHeight, setSheetHeight] = useState(0);

  const ctx = useSharedValue<number>(translateY.value);

  const gesture = Gesture.Pan()
    .onBegin(e => {
      ctx.value = translateY.value;
    })
    .onUpdate(e => {
      translateY.value = Math.max(e.translationY + ctx.value, 0);
    })
    .onFinalize(e => {
      if (e.translationY + ctx.value < sheetHeight / 4) {
        scrollToWithSpring(translateY, 0);
        return;
      }

      scrollToWithSpring(translateY, sheetHeight);
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <Animated.View
      style={[styles.bottomSheet, rStyle]}
      onLayout={e => setSheetHeight(e.nativeEvent.layout.height)}>
      <GestureDetector gesture={gesture}>
        <View style={styles.header}>
          <View style={styles.lineIndicator} />
        </View>
      </GestureDetector>
      {children}
    </Animated.View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderTopLeftRadius: BOTTOM_SHEET_BR,
    borderTopRightRadius: BOTTOM_SHEET_BR,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: COMMON_MARGIN * 0.5,
    paddingBottom: COMMON_MARGIN,
  },
  lineIndicator: {
    width: 80,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#E1E8ED',
    alignSelf: 'center',
  },
});
