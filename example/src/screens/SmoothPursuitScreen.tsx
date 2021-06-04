import * as React from 'react';
import { Modal, Text, View, ViewStyle, TextStyle } from 'react-native';
import { SenseyeButton, Tasks } from '@senseyeinc/react-native-senseye-sdk';

import { Spacing, Typography } from '../styles';

export default function SmoothPursuitScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);

  return (
    <View style={Spacing.container as ViewStyle}>
      <Text style={Typography.text as TextStyle}>
        In this task, the participant is asked to stare at a dot at the center of the
        screen. When a target appears, the participant should follow the target with their
        eyes as it moves around in a circle, and then stare at the center dot again when
        the target disappears.
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
          speed={0.05}
          startAngle={Math.PI / 2}
          onEnd={() => setIsShowModal(false)}
        />
      </Modal>
    </View>
  );
}
