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
  checkmarkIcon,
  xIcon,
  insufficientIcon,
  whiteLogo,
} from '@senseyeinc/react-native-senseye-sdk';
import type { PredictionResult } from '@senseyeinc/react-native-senseye-sdk';

// gets application window height and width
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export type ValidationSurveyProps = {
  result: PredictionResult;
  onComplete?(survey: Models.Survey): void;
};

export default function ValidationSurvey(props: ValidationSurveyProps) {
  const { result, onComplete } = props;
  const [resultIcon, setResultIcon] = React.useState(insufficientIcon);
  const [resultMsg, setResultMsg] = React.useState(
    'Senseye models indicate the user is not fit for duty.'
  );
  const validationQuestion = 'Do you agree with this result?';

  function _onComplete(agreed: boolean) {
    if (onComplete) {
      // generate a survey model and pass it into the callback
      const survey = new Models.Survey(
        Constants.SurveyType.VALIDATION,
        { agreed: [validationQuestion, agreed] },
        result
      );
      onComplete(survey);
    }
  }

  React.useEffect(() => {
    switch (result.prediction.state) {
      case Constants.PredictedState.SAFE:
        setResultIcon(checkmarkIcon);
        setResultMsg('Senseye models indicate the user is likely fit for duty.');
        break;
      case Constants.PredictedState.UNSAFE:
        setResultIcon(xIcon);
        setResultMsg(
          'Senseye models indicate the user is likely too fatigued or intoxicated for duty.'
        );
        break;
      default:
        setResultIcon(insufficientIcon);
        setResultMsg(
          'Senseye models received invalid or not enough data to make a confident prediction.'
        );
    }
  }, [result]);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={whiteLogo} />
      <ScrollView style={styles.innerContainer} contentContainerStyle={styles.layout}>
        <Image source={resultIcon} style={styles.clearanceIcon} />
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
