import * as React from 'react';
import { Modal, Text, View, ViewStyle, TextStyle } from 'react-native';
import { SenseyeButton, Tasks } from '@senseyeinc/react-native-senseye-sdk';
import { Spacing, Typography } from '../styles';

export default function NystagmusScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);

  return (
    <View style={Spacing.container as ViewStyle}>
      <Text style={Typography.text as TextStyle}>
        Nystagmus is an involuntary movement of the eyes, which usually occurs
        when the eyes are rotated to extreme angles. Nystagmus occurring at
        smaller angles is a common symptom of alcohol-induced intoxication.
        {'\n\n'}
        This task seeks to stimulate and measure this condition by asking the
        participant to visually track a white dot that moves horizontally back
        and forth across the screen.
      </Text>
      <SenseyeButton
        title="Run Nystagmus Task"
        type="primaryCta"
        onPress={() => setIsShowModal(true)}
      />
      <Modal visible={isShowModal} onRequestClose={() => setIsShowModal(false)}>
        <Tasks.Nystagmus iterations={3} onEnd={() => setIsShowModal(false)} />
      </Modal>
    </View>
  );
}
