import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';

export type SenseyeCalendarProps = {
  initialDate: string | (() => string);
  onUpdate?(day: React.SetStateAction<string>): void;
};

const TODAY = new Date();
const INITIAL_DATE = TODAY.toISOString().slice(0, 10);

//left off at making reusable senseye cal
export default function SenseyeCalendar(props: SenseyeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(props.initialDate);

  let styles = {
    backgroundColor: '#141726',
    calendarBackground: '#141726',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#0ea8a4',
    selectedDayBackgroundColor: '#DBEEF1',
    selectedDayTextColor: '#141726',
    todayTextColor: '#DBEEF1',
    dayTextColor: '#DBEEF1',
    textDisabledColor: '#0ea8a4',
    dotColor: '#DBEEF1',
    selectedDotColor: '#141726',
    arrowColor: 'white',
    disabledArrowColor: '#0ea8a4',
    monthTextColor: '#DBEEF1',
    indicatorColor: '#DBEEF1',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      color: 'green',
      textColor: 'gray',
      marked: true,
      dotColor: 'red',
      startingDay: true,
    },
  };
  const onDayPress = (day: { dateString: React.SetStateAction<string> }) => {
    setSelectedDate(day.dateString);
    if (props.onUpdate) {
      props.onUpdate(day.dateString);
    }
  };

  return (
    <>
      <Calendar
        minDate={'2020-01-01'}
        theme={styles}
        onDayPress={onDayPress}
        markedDates={markedDates}
      />
    </>
  );
}

SenseyeCalendar.defaultProps = {
  initialDate: INITIAL_DATE,
  onUpdate: null,
};
