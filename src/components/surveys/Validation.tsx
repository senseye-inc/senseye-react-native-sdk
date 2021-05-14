import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import {
  SenseyeButton,
  Models,
  Constants,
  // checkmarkIcon,
  // xIcon,
  // insufficientIcon,
  ormCheckLogo,
  warningIcon,
} from '@senseyeinc/react-native-senseye-sdk';
import type { PredictionResult } from '@senseyeinc/react-native-senseye-sdk';

// gets application window height and width
const WINDOW_WIDTH = Dimensions.get('window').width;

export type ValidationSurveyProps = {
  result: PredictionResult;
  onComplete?(survey: Models.Survey): void;
};

export default function ValidationSurvey(props: ValidationSurveyProps) {
  const { result, onComplete } = props;
  // const [resultIcon, setResultIcon] = React.useState(insufficientIcon);
  // const [resultMsg, setResultMsg] = React.useState(
  //   'Senseye models indicate the user is not fit for duty.'
  // );
  const validationQuestion = 'Do you believe this to be a good recording?';

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

  // React.useEffect(() => {
  //   switch (result.prediction.state) {
  //     case Constants.PredictedState.SAFE:
  //       setResultIcon(checkmarkIcon);
  //       setResultMsg(
  //         'Senseye models indicate the user is likely fit for duty.'
  //       );
  //       break;
  //     case Constants.PredictedState.UNSAFE:
  //       setResultIcon(xIcon);
  //       setResultMsg(
  //         'Senseye models indicate the user is likely too fatigued or intoxicated for duty.'
  //       );
  //       break;
  //     default:
  //       setResultIcon(insufficientIcon);
  //       setResultMsg(
  //         'Senseye models received invalid or not enough data to make a confident prediction.'
  //       );
  //   }
  // }, [result]);

  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.childContainer}>
        <Image style={styles.logo} source={ormCheckLogo} />
        <View style={styles.bodyContainer}>
          <Text style={styles.text}>
            Do you believe this to be a good recording?
          </Text>
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
        </View>
      </View>
      <View style={styles.footer}>
        <Image style={styles.logo} source={warningIcon} />
        <Text style={styles.warning}>
          RESULTS ARE CURRENTLY IN BETA AND SHOULD NOT BE INCORPORATED INTO
          WORKFLOW
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    width: WINDOW_WIDTH,
    height: '100%',
    backgroundColor: '#141726',
  },
  childContainer: {
    flex: 1,
    justifyContent: 'space-between' as 'space-between',
    margin: 30,
    padding: 30,
    minHeight: '70%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#22294E',
  },
  bodyContainer: {
    flex: 3,
    justifyContent: 'center' as 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 3,
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'space-evenly' as 'space-evenly',
    width: '90%',
  },
  warning: {
    fontStyle: 'normal' as 'normal',
    fontWeight: 'bold' as 'bold',
    lineHeight: 15,
    textAlign: 'center' as 'center',
    textTransform: 'uppercase' as 'uppercase',
    marginBottom: 10,
    color: '#d7b357',
    fontSize: 10,
  },
  text: {
    color: '#ebf1f2',
    margin: 10,
    padding: 5,
    fontStyle: 'normal' as 'normal',
    fontWeight: 'bold' as 'bold',
    fontSize: 20,
    textAlign: 'center' as 'center',
    textTransform: 'uppercase' as 'uppercase',
    marginBottom: 10,
  },
  icon: {
    alignSelf: 'center' as 'center',
    resizeMode: 'contain' as 'contain',
    margin: 0,
    height: 120,
  },
  logo: {
    alignSelf: 'center' as 'center',
    resizeMode: 'contain' as 'contain',
    margin: 0,
    minHeight: 50,
    maxHeight: 200,
    height: 10,
    minWidth: 86,
    maxWidth: 150,
  },
  buttonLayout: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
});
