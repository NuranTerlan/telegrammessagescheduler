import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {
  addMinutes,
  addMonths,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  endOfToday,
  startOfToday,
} from 'date-fns';
import {CELL_HEIGHT, COMMON_MARGIN, CONTAINER_HEIGHT} from '../appConfig';
import DateItemListView from './DateItemListView';

const {width} = Dimensions.get('screen');

const DateTimePicker = () => {
  const now = useMemo(() => new Date(), []);
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const today = startOfToday();
  const daysAfterToday = eachDayOfInterval({
    start: today,
    end: addMonths(today, 1),
  });
  const hoursOfDay = eachHourOfInterval({
    start: today,
    end: endOfToday(),
  });
  const minutesOfHour = eachMinuteOfInterval({
    start: today,
    end: addMinutes(today, 59),
  });

  const [selectedDay, setSelectedDay] = useState<string>();
  const [selectedHour, setSelectedHour] = useState<string>();
  const [selectedMinute, setSelectedMinute] = useState<string>();

  return (
    <View>
      <Text style={styles.heading}>Schedule Message</Text>
      <View style={styles.pickerContainer}>
        <View style={styles.selectionBound} />
        <View style={styles.innerContainer}>
          <DateItemListView
            data={daysAfterToday}
            representationFormat="MMM dd"
            setItem={setSelectedDay}
            firstValueRepresentation="Today"
            flex={2}
          />
          <DateItemListView
            data={hoursOfDay}
            representationFormat="HH"
            setItem={setSelectedHour}
            initialTranslation={hours * CELL_HEIGHT}
          />
          <DateItemListView
            data={minutesOfHour}
            representationFormat="mm"
            setItem={setSelectedMinute}
            initialTranslation={minutes * CELL_HEIGHT}
            paddingRight={20}
          />
        </View>
      </View>
      <TouchableOpacity>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>
            Send {selectedDay} at {selectedHour}:{selectedMinute}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DateTimePicker;

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    color: '#333333',
    fontWeight: '900',
    marginBottom: COMMON_MARGIN * 0.25,
  },
  pickerContainer: {
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionBound: {
    width,
    height: CELL_HEIGHT,
    position: 'absolute',
    borderColor: '#229ED9',
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sendButton: {
    marginTop: COMMON_MARGIN * 0.5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#2AABEE',
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
