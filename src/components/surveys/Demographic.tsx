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
  SenseyeAlert,
  SenseyeCalendar,
  SenseyePicker,
  SenseyeTextInput,
  SenseyeButton,
  Models,
  Constants,
  pictorialGradientLogo,
  validationSchema,
} from '@senseyeinc/react-native-senseye-sdk';
import type { Datum } from '@senseyeinc/react-native-senseye-sdk';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const NOW = new Date();
const TODAY = NOW.toISOString().slice(0, 10);
NOW.setDate(new Date().getDate() - 1);
const YESTERDAY = NOW.toISOString().slice(0, 10);

export type DemographicSurveyProps = {
  onComplete?(survey: Models.Survey): void;
};

export default function DemographicSurvey(props: DemographicSurveyProps) {
  const [age, setAge] = React.useState<Datum>('');
  const [gender, setGender] = React.useState<Datum>(null);
  const [eyeColor, setEyeColor] = React.useState<Datum>(null);
  const [fatigueLevel, setFatigueLevel] = React.useState<Datum>(null);
  const [bedHour, setBedHour] = React.useState<Datum>('');
  const [bedMin, setBedMin] = React.useState<Datum>('');
  const [bedMeridiem, setBedMeridiem] = React.useState<Datum>('AM');
  const [bedDate, setBedDate] = React.useState<Datum>(YESTERDAY);
  const [wakeHour, setWakeHour] = React.useState<Datum>('');
  const [wakeMin, setWakeMin] = React.useState<Datum>('');
  const [wakeDate, setWakeDate] = React.useState<Datum>(TODAY);
  const [wakeMeridiem, setWakeMeridiem] = React.useState<Datum>('AM');

  const [errors, setErrors] = React.useState(<></>);
  // checks form responses, if valid then submits responses to survey
  function _onComplete() {
    // reset and clear error messages
    setErrors(<></>);
    // validate all responses
    validationSchema
      .validate(
        {
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
        },
        { abortEarly: false }
      )
      .then(function (value: any) {
        value;
        if (props.onComplete) {
          // generate a survey model and pass it into the @callback
          const survey = new Models.Survey(Constants.SurveyType.DEMOGRAPHIC, {
            age: ['Age', age],
            gender: ['Gender', gender],
            eye_color: ['Eye Color', eyeColor],
            fatigue: ['Fatigue rating (1 = alert, 7 = very tired)', fatigueLevel],
            bed_time: [
              'Log your most recent bedtime:',
              `${bedHour} : ${bedMin} ${bedMeridiem}`,
            ],
            wake_time: [
              'Log your most recent wake time:',
              `${wakeHour} : ${wakeMin} ${wakeMeridiem}`,
            ],
            wake_day: ['Select the day you last awoke', wakeDate],
            bed_day: ['Select the day you last slept', bedDate],
          });
          props.onComplete(survey);
        }
      })
      .catch(function (err: any) {
        // return a collection of JSX.Element to alert users of invalid responses
        let elements = err.errors.map(
          (
            el: { toString: () => string | undefined },
            i: React.Key | null | undefined
          ) => {
            return <SenseyeAlert key={i} message={el.toString()} />;
          }
        );
        setErrors(elements);
        return;
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={pictorialGradientLogo} />
      {errors}
      <ScrollView style={styles.innerContainer} overScrollMode={'always'}>
        <SenseyeTextInput
          label="Age"
          placeholderText="Type your age here"
          keyboardType="number-pad"
          value={String(age)}
          onChangeText={(text) => setAge(text)}
        />
        <SenseyePicker
          label="Gender"
          options={Constants.FormData.GENDER}
          selectedValue={gender}
          onChangeValue={(value) => setGender(value)}
          zIndex={300}
          zIndexInverse={100}
        />
        <SenseyePicker
          label="Eye Color"
          options={Constants.FormData.EYE}
          selectedValue={eyeColor}
          onChangeValue={(value) => setEyeColor(value)}
          zIndex={200}
          zIndexInverse={200}
        />
        <SenseyePicker
          label="Fatigue rating (1 = alert, 7 = very tired)"
          options={Constants.FormData.FATIGUE}
          selectedValue={fatigueLevel}
          onChangeValue={(value) => setFatigueLevel(value)}
          zIndex={100}
          zIndexInverse={300}
        />
        <Text style={styles.text}>Select the day you last slept:</Text>
        <SenseyeCalendar onUpdate={(day) => setBedDate(day)} initialDate={YESTERDAY} />
        <Text style={styles.text}>Log your most recent bedtime:</Text>
        <View style={styles.clockStyles}>
          <SenseyeTextInput
            placeholderText="HH"
            keyboardType="number-pad"
            value={String(bedHour)}
            onChangeText={(text) => setBedHour(text)}
            width={'32%'}
          />
          <SenseyeTextInput
            placeholderText="MM"
            keyboardType="number-pad"
            value={String(bedMin)}
            onChangeText={(text) => setBedMin(text)}
            width={'32%'}
          />
          <SenseyePicker
            options={Constants.FormData.MERIDIEM}
            selectedValue={bedMeridiem}
            onChangeValue={(value) => setBedMeridiem(value)}
            width={'38%'}
            marginBottom={0}
            pickerBackground={'#191C31'}
          />
        </View>
        <Text style={styles.text}>Select the day you last awoke:</Text>
        <SenseyeCalendar onUpdate={(day) => setWakeDate(day)} />
        <Text style={styles.text}>Log your most recent wake time:</Text>
        <View style={styles.clockStyles}>
          <SenseyeTextInput
            placeholderText="HH"
            keyboardType="number-pad"
            value={String(wakeHour)}
            onChangeText={(text) => setWakeHour(text)}
            width={'32%'}
          />
          <SenseyeTextInput
            placeholderText="MM"
            keyboardType="number-pad"
            value={String(wakeMin)}
            onChangeText={(text) => setWakeMin(text)}
            width={'32%'}
          />
          <SenseyePicker
            options={Constants.FormData.MERIDIEM}
            marginBottom={0}
            selectedValue={wakeMeridiem}
            onChangeValue={(value) => setWakeMeridiem(value)}
            width={'38%'}
            pickerBackground={'#191C31'}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SenseyeButton title="Submit" onPress={_onComplete} theme={'primaryCta'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: '#141726',
    paddingTop: -60,
  },
  innerContainer: {
    height: WINDOW_HEIGHT + 120,
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
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    margin: 0,
  },
  clockStyles: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginBottom: 40,
    paddingBottom: 30,
  },
});
