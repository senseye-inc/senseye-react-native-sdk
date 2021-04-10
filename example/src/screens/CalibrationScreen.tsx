import * as React from 'react';
import { Modal, Text, View } from 'react-native';
import {
  Tasks,
  SenseyeButton,
} from '@senseyeinc/react-native-senseye-sdk';
import { calibrationPatterns } from '@senseyeinc/react-native-senseye-sdk';

import { styles } from '../styles';

export default function CalibrationScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);
  //a series of calibration patterns (x,y) to select from
  const selectPattern = () => {
    //length of array
    let length = calibrationPatterns.length;
    //randomly selects an index within array range
    let i = Math.floor(length * Math.random());
    //chosen pattern schema
    let pattern = calibrationPatterns[i];
    return pattern;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Calibration is essential for mapping the position and movement of the
        particpant's eyes in respect to their focal point on the screen.
        Measurements are fed into Senseye's models and assist in returning
        accurate results.
        {'\n\n'}
        This task seeks to gather these measurements by displaying a sequence of
        dots that will appear across the full extent of the screen. The
        participant is asked to look at each dot as it appears and continue to
        stare at the dot until it disappears.
      </Text>
      <SenseyeButton
        title="Run Calibration Task"
        type="primaryCta"
        onPress={() => setIsShowModal(true)}
      />
      <Modal visible={isShowModal} onRequestClose={() => setIsShowModal(false)}>
        <Tasks.Calibration
          onEnd={() => setIsShowModal(false)}
          dot_points={selectPattern()}
        />
      </Modal>
    </View>
  );
}
