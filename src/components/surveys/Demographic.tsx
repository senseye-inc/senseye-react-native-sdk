import * as React from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import {
  SenseyePicker,
  SenseyeTextInput,
  SenseyeButton,
  Models,
  Constants,
} from '@senseyeinc/react-native-senseye-sdk';

const WINDOW_WIDTH = Dimensions.get('window').width;

export type DemographicSurveyProps = {
  onComplete?(survey: Models.Survey, userId: string): void;
};

export default function DemographicSurvey(props: DemographicSurveyProps) {
  const [warningMsg, setWarningMsg] = React.useState('');
  const [age, setAge] = React.useState('');
  const [gender, setGender] = React.useState<React.ReactText>('na');
  const [eyeColor, setEyeColor] = React.useState<React.ReactText>('na');
  const [fatigueLevel, setFatigueLevel] = React.useState<React.ReactText>('na');
  const [uniqueId, setUniqueId] = React.useState('');
  const [bedHour, setBedHour] = React.useState('');
  const [bedMin, setBedMin] = React.useState('');
  const [bedMeridiem, setBedMeridiem] = React.useState<React.ReactText>('AM');
  const [wakeHour, setWakeHour] = React.useState('');
  const [wakeMin, setWakeMin] = React.useState('');
  const [wakeMeridiem, setWakeMeridiem] = React.useState<React.ReactText>('AM');

  function _onComplete() {
    // validate form fields
    if (
      gender === 'na' ||
      eyeColor === 'na' ||
      fatigueLevel === 'na' ||
      !age.trim() ||
      !uniqueId.trim() ||
      !wakeHour.trim() ||
      !bedHour.trim() ||
      !wakeMin.trim() ||
      !bedMin.trim()
    ) {
      setWarningMsg('Please enter in all fields');
      return;
    }
    setWarningMsg('');

    if (props.onComplete) {
      // generate a survey model and pass it into the callback
      const survey = new Models.Survey(Constants.SurveyType.DEMOGRAPHIC, {
        age: ['Age', age],
        gender: ['Gender', gender],
        eye_color: ['Eye Color', eyeColor],
        fatigue: ['Fatigue rating (1 = alert, 7 = very tired)', fatigueLevel],
        unique_id: ['Unique ID', uniqueId],
        bed_time: [
          'Log your most recent bed time:',
          bedHour + ':' + bedMin + ' ' + bedMeridiem,
        ],
        wake_time: [
          'Log your most recent wake time:',
          wakeHour + ':' + wakeMin + ' ' + wakeMeridiem,
        ],
      });
      props.onComplete(survey, uniqueId);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/senseye-white-logo.png')}
      />
      <ScrollView
        style={styles.innerContainer}
        contentContainerStyle={styles.layout}
      >
        <Text style={styles.warning}>{warningMsg}</Text>
        <SenseyeTextInput
          label="Age"
          placeholderText="Type your age here"
          keyboardType={'number-pad'}
          value={age}
          onChangeText={(text) => setAge(text)}
        />
        <SenseyePicker
          label="Gender"
          options={Constants.FormData.GENDER}
          selectedValue={gender}
          onChangeValue={(value) => setGender(value)}
        />
        <SenseyePicker
          label="Eye Color"
          options={Constants.FormData.EYE}
          selectedValue={eyeColor}
          onChangeValue={(value) => setEyeColor(value)}
        />
        <SenseyePicker
          label="Fatigue rating (1 = alert, 7 = very tired)"
          options={Constants.FormData.FATIGUE}
          selectedValue={fatigueLevel}
          onChangeValue={(value) => setFatigueLevel(value)}
        />
        <Text style={styles.text}>Log your most recent bed time:</Text>
        <View style={styles.clockStyles}>
          <SenseyeTextInput
            label="Hour"
            placeholderText="HH"
            keyboardType={'number-pad'}
            value={bedHour}
            onChangeText={(text) => setBedHour(text)}
            width={'30%'}
          />
          <SenseyeTextInput
            label="Min"
            placeholderText="MM"
            keyboardType={'number-pad'}
            value={bedMin}
            onChangeText={(text) => setBedMin(text)}
            width={'30%'}
          />
          <SenseyePicker
            label="AM/PM"
            options={Constants.FormData.MERIDIEM}
            selectedValue={bedMeridiem}
            onChangeValue={(value) => setBedMeridiem(value)}
            width={'40%'}
            marginBottom={0}
          />
        </View>
        <Text style={styles.text}>Log your most recent wake time:</Text>
        <View style={styles.clockStyles}>
          <SenseyeTextInput
            label="Hour"
            placeholderText="HH"
            keyboardType={'number-pad'}
            value={wakeHour}
            onChangeText={(text) => setWakeHour(text)}
            width={'30%'}
          />
          <SenseyeTextInput
            label="Min"
            placeholderText="MM"
            keyboardType={'number-pad'}
            value={wakeMin}
            onChangeText={(text) => setWakeMin(text)}
            width={'30%'}
          />
          <SenseyePicker
            label="AM/PM"
            options={Constants.FormData.MERIDIEM}
            marginBottom={0}
            selectedValue={wakeMeridiem}
            onChangeValue={(value) => setWakeMeridiem(value)}
            width={'40%'}
          />
        </View>
        <SenseyeTextInput
          label="Unique ID"
          placeholderText="00000"
          keyboardType={'number-pad'}
          value={uniqueId}
          onChangeText={(text) => setUniqueId(text)}
        />
        <SenseyeButton
          title="Submit"
          onPress={_onComplete}
          type={'primaryCta'}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: '100%',
    backgroundColor: '#141726',
  },
  layout: {
    //TODO: https://developer.android.com/training/keyboard-input/visibility
    height: '400%',
  },
  innerContainer: {
    margin: 30,
    padding: 30,
    backgroundColor: '#21284E',
  },
  text: {
    color: '#DBEEF1',
    marginLeft: 10,
    marginTop: 5,
    padding: 5,
  },
  logo: {
    minHeight: 50,
    maxHeight: 190,
    height: 10,
    minWidth: 90,
    maxWidth: 160,
    alignSelf: 'flex-start',
    resizeMode: 'cover',
    margin: 10,
  },
  clockStyles: {
    height: 70,
    flexDirection: 'row',
    marginBottom: 30,
  },
  warning: {
    color: '#d7b357',
  },
});
