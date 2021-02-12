import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import {
  SenseyeButton,
  Models,
  Constants,
} from '@senseyeinc/react-native-senseye-sdk';
import type { ComputeResult } from '@senseyeinc/react-native-senseye-sdk';

// gets application window height and width
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export type ValidationSurveyProps = {
  results: ComputeResult[];
  onComplete?(survey: Models.Survey): void;
};

export default function ValidationSurvey(props: ValidationSurveyProps) {
  const [resultIcon, setResultIcon] = React.useState<JSX.Element>(Xmark);
  const [resultMsg, setResultMsg] = React.useState(
    'Senseye models indicate the user is not fit for duty.'
  );
  const validationQuestion = 'Do you agree with this result?';

  function _onComplete(agreed: boolean) {
    if (props.onComplete) {
      // generate a survey model and pass it into the callback
      const survey = new Models.Survey(
        Constants.SurveyType.VALIDATION,
        { agreed: [validationQuestion, agreed] },
        result
      );
      props.onComplete(survey);
    }
  }

  const result = props.results[0];

  React.useEffect(() => {
    if (!result) {
      throw Error("At least one entry is required in 'results'.");
    } else if (
      result.prediction.predicted_state === Constants.PredictedState.READY
    ) {
      setResultIcon(Checkmark);
      setResultMsg('Senseye models indicate the user is fit for duty.');
    } else if (
      result.prediction.predicted_state ===
      Constants.PredictedState.NOT_READY_FATIGUE
    ) {
      setResultIcon(Xmark);
      setResultMsg(
        'Senseye models indicate the user is too fatigued for duty.'
      );
    } else if (
      result.prediction.predicted_state ===
      Constants.PredictedState.NOT_READY_BAC
    ) {
      setResultIcon(Xmark);
      setResultMsg(
        'Senseye models indicate the user is too intoxicated for duty.'
      );
    }
  }, [result]);

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
        {resultIcon}
        <Text style={styles.text}>{resultMsg}</Text>
        <Text style={[styles.text, styles.warning]}>
          Please note, you are currently in BETA mode and results should not be
          incorporated into workflow.
        </Text>
        <Text style={styles.text}>{validationQuestion}</Text>
        <View style={styles.buttonLayout}>
          <SenseyeButton
            title="Yes"
            onPress={() => _onComplete(true)}
            type={'primaryCta'}
          />
          <SenseyeButton
            title="No"
            onPress={() => _onComplete(false)}
            type={'secondaryCta'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Checkmark = () => {
  return (
    <Image
      source={require('../../assets/checkmark-green.png')}
      style={styles.clearanceIcon}
    />
  );
};
const Xmark = () => {
  return (
    <Image
      source={require('../../assets/xmark-red.png')}
      style={styles.clearanceIcon}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: '100%',
    backgroundColor: '#141726',
  },
  layout: {
    height: WINDOW_HEIGHT,
    justifyContent: 'flex-start',
  },
  innerContainer: {
    margin: 30,
    padding: 30,
    backgroundColor: '#21284E',
  },
  text: {
    color: '#ebf1f2',
    margin: 10,
    padding: 5,
  },
  clearanceIcon: {
    minHeight: 50,
    maxHeight: 100,
    margin: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
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
  warning: {
    color: '#d7b357',
  },
  buttonLayout: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
});
