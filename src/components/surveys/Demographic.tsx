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
import * as yup from 'yup';

import {
  SenseyePicker,
  SenseyeTextInput,
  SenseyeButton,
  Models,
  Constants,
  pictorialGradientLogo,
} from '@senseyeinc/react-native-senseye-sdk';
import SenseyeCalendar from '../SenseyeCalendar';

const WINDOW_WIDTH = Dimensions.get('window').width;
const NOW = new Date();
const TODAY = NOW.toISOString().slice(0, 10);
NOW.setDate(new Date().getDate() - 1);
const YESTERDAY = NOW.toISOString().slice(0, 10);

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
  const [bedDate, setBedDate] = React.useState(YESTERDAY);
  const [wakeHour, setWakeHour] = React.useState('');
  const [wakeMin, setWakeMin] = React.useState('');
  const [wakeMeridiem, setWakeMeridiem] = React.useState<React.ReactText>('AM');
  const [wakeDate, setWakeDate] = React.useState(TODAY);
  let fieldValues = [
    age,
    gender,
    eyeColor,
    fatigueLevel,
    bedHour,
    bedMin,
    bedMeridiem,
    bedDate,
    wakeHour,
    wakeMin,
    wakeMeridiem,
    wakeDate,
    uniqueId,
  ];
  function _onComplete() {
    // describes acceptible form responses
    // @TODO update error message for better UX, have warning message display for each form field
    // {fieldValues[name]: value}
    let schema = yup.object().shape({
      age: yup
        .number()
        .positive()
        .required('Enter a valid numeric age.')
        .integer()
        .min(13)
        .max(99),
      gender: yup.string().required('Select your gender from the dropdown.'),
      eyeColor: yup.string().required('Select your eye color from the dropdown.'),
      fatigueLevel: yup
        .number()
        .required('Select a rating for your fatigue level')
        .positive()
        .integer(),
      uniqueId: yup.string().required('Unique ID is required.'),
      bedHour: yup
        .number()
        .required('This entry can only contain numbers.')
        .integer()
        .max(12),
      bedMin: yup
        .number()
        .required('This entry can only contain numbers.')
        .integer()
        .max(59),
      bedDate: yup.date(),
      wakeHour: yup
        .number()
        .required('This entry can only contain numbers.')
        .integer()
        .max(12),
      wakeMin: yup
        .number()
        .required('This entry can only contain numbers.')
        .integer()
        .max(59),
      wakeDate: yup.date(),
    });

    // check all responses to ensure validity
    schema
      .validate({ ...fieldValues }, { abortEarly: false })
      .then(function (value) {
        console.log(value);
        setWarningMsg('good');
      })
      .catch(function (err) {
        console.log(fieldValues);
        console.log(err.inner);
        setWarningMsg(err.inner.toString());
        return;
      });

    if (props.onComplete) {
      // generate a survey model and pass it into the callback
      const survey = new Models.Survey(Constants.SurveyType.DEMOGRAPHIC, {
        age: ['Age', age],
        gender: ['Gender', gender],
        eye_color: ['Eye Color', eyeColor],
        fatigue: ['Fatigue rating (1 = alert, 7 = very tired)', fatigueLevel],
        unique_id: ['Unique ID', uniqueId],
        bed_time: [
          'Log your most recent bedtime:',
          bedHour + ':' + bedMin + ' ' + bedMeridiem,
        ],
        wake_time: [
          'Log your most recent wake time:',
          wakeHour + ':' + wakeMin + ' ' + wakeMeridiem,
        ],
        wake_day: ['Select the day you last awoke', wakeDate],
        bed_day: ['Select the day you last slept', bedDate],
      });
      props.onComplete(survey, uniqueId);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={pictorialGradientLogo} />
      <Text style={styles.warning}>{warningMsg}</Text>
      <ScrollView style={styles.innerContainer}>
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
        <Text style={styles.text}>Select the day you last slept:</Text>
        <SenseyeCalendar onUpdate={(day) => setBedDate(day)} initialDate={YESTERDAY} />
        <Text style={styles.text}>Log your most recent bedtime:</Text>
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
        <Text style={styles.text}>Select the day you last awoke:</Text>
        <SenseyeCalendar onUpdate={(day) => setWakeDate(day)} />
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
        <SenseyeButton title="Submit" onPress={_onComplete} type={'primaryCta'} />
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
  innerContainer: {
    paddingLeft: 30,
    paddingRight: 30,
    margin: 30,
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
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    margin: 0,
  },
  clockStyles: {
    height: 70,
    flexDirection: 'row',
    marginBottom: 30,
  },
  warning: {
    color: '#d7b357',
    alignSelf: 'center',
  },
});
