import {Button, StyleSheet, View} from 'react-native';
import React from 'react';
import DateTimePicker from './components/DateTimePicker';
import BottomSheet, {scrollToWithSpring} from './components/BottomSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';

const App = () => {
  const bottomSheetTranslation = useSharedValue<number>(0);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <Button
          title="Send Message"
          onPress={() => scrollToWithSpring(bottomSheetTranslation, 0)}
        />
        <BottomSheet translateY={bottomSheetTranslation}>
          <DateTimePicker />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, .1)',
    paddingTop: 100,
  },
});
