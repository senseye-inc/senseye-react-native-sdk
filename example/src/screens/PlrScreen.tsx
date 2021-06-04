import * as React from 'react';
import { Modal, Text, View, ViewStyle, TextStyle } from 'react-native';
import { SenseyeButton, Tasks } from '@senseyeinc/react-native-senseye-sdk';

import { Spacing, Typography } from '../styles';

export default function PlrScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);

  return (
    <View style={Spacing.container as ViewStyle}>
      <Text style={Typography.text as TextStyle}>
        Pupillary light reflex (PLR) is a natural reflex in which the pupil constricts and
        expands in response to light. The timing and amplitude of this response will vary
        based on drug/alcohol intoxication and/or fatigue.
        {'\n\n'}
        This task seeks to stimulate and measure this condition by having the participant
        fixate their gaze on the center of the screen, while the background changes colors
        from gray to black to white and back to black.
      </Text>
      <SenseyeButton
        title="Run PLR Task"
        type="primaryCta"
        onPress={() => setIsShowModal(true)}
      />
      <Modal visible={isShowModal} onRequestClose={() => setIsShowModal(false)}>
        <Tasks.Plr
          fixationWidth={16}
          fixationOutlineSize={4}
          onEnd={() => setIsShowModal(false)}
        />
      </Modal>
    </View>
  );
}
