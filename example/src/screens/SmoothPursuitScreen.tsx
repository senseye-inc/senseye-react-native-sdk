import * as React from 'react';
import { Modal, Text, View } from 'react-native';
import {
  Tasks,
  SenseyeButton,
} from '@senseyeinc/react-native-senseye-sdk';

import { styles } from '../styles';

export default function SmoothPursuitScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        In this task, the participant is asked to stare at a dot in the center
        of the screen. When a target appears, the participant should follow the
        target with their eyes as it moves around in a circle, and then stare at
        the center dot again when the target disappears.
      </Text>
      <SenseyeButton
        title="Run Smooth Pursuit Task"
        type="primaryCta"
        onPress={() => setIsShowModal(true)}
      />
      <Modal visible={isShowModal} onRequestClose={() => setIsShowModal(false)}>
        <Tasks.SmoothPursuit
          cycles={3}
          iterations={3}
          onEnd={() => setIsShowModal(false)}
        />
      </Modal>
    </View>
  );
}
