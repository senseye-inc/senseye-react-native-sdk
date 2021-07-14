import * as React from 'react';
import { Modal, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Constants, SenseyeButton, Tasks } from '@senseyeinc/react-native-senseye-sdk';

import { Spacing, Typography } from '../styles';

export default function CalibrationScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);
  //a series of calibration patterns (x,y) to select from
  const selectPattern = () => {
    //length of array
    let length = Constants.CalibrationPatterns.length;
    //randomly selects an index within array range
    let i = Math.floor(length * Math.random());
    //chosen pattern schema
    let pattern = Constants.CalibrationPatterns[i];
    return pattern;
  };
  return (
    <View style={Spacing.container as ViewStyle}>
      <Text style={Typography.text as TextStyle}>
        Calibration is essential for mapping the position and movement of the
        participant's eyes in respect to their focal point on the screen. Measurements are
        fed into Senseye's models and assist in returning accurate results.
        {'\n\n'}
        This task seeks to gather these measurements by displaying a sequence of dots that
        will appear across the full extent of the screen. The participant is asked to look
        at each dot as it appears and continue to stare at the dot until it disappears.
      </Text>
      <SenseyeButton
        title="Run Calibration Task"
        theme="primaryCta"
        onPress={() => setIsShowModal(true)}
      />
      <Modal visible={isShowModal} onRequestClose={() => setIsShowModal(false)}>
        <Tasks.Calibration
          radius={20}
          dotSequence={selectPattern()}
          onEnd={() => setIsShowModal(false)}
        />
      </Modal>
    </View>
  );
}
