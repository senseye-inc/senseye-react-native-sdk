import * as React from 'react';
import { Alert, Modal, Text, View } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {
  TaskRunner,
  Tasks,
  Models,
  SenseyeButton,
} from '@senseyeinc/react-native-senseye-sdk';

import { styles } from '../styles';

export default function FullDemoScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);
  const [isModalReady, setIsModalReady] = React.useState<boolean>(false);
  const onEnd = React.useCallback((_, videos) => {
    videos.forEach((video: Models.Video) => {
      CameraRoll.save(video.getUri(), { type: 'video' }).then((newUri) => {
        video.setUri(newUri);
        console.log(video.getName() + ': ' + newUri);
      });
    });
    Alert.alert(
      'Complete!',
      "Recorded videos have been transferred to your device's Camera Roll.",
      [
        {
          text: 'OK',
          onPress: () => {
            setIsShowModal(false);
            setIsModalReady(false);
          },
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        A demonstration of the TaskRunner component, which is cabable of
        executing a series of tasks while orchestrating video recording
        and data collection during its session.
        {'\n\n'}
        This demo will execute the Calibration, Nystagmus, and Plr tasks. A
        video will be recorded for each task and stored in the the device's
        photo library.
        {'\n\n'}
        Note: Camera and File/Media access is required for this demo.
      </Text>
      <SenseyeButton
        title="Run full demo"
        type="primaryCta"
        onPress={() => setIsShowModal(true)}
      />
      <Modal
        visible={isShowModal}
        onShow={() => setIsModalReady(true)}
        onRequestClose={() => {
          setIsShowModal(false);
          setIsModalReady(false);
        }}
      >
        {isModalReady ? (
          <TaskRunner onEnd={onEnd}>
            <Tasks.Calibration />
            <Tasks.Nystagmus />
            <Tasks.Plr />
            <Tasks.SmoothPursuit />
          </TaskRunner>
        ) : null}
      </Modal>
    </View>
  );
}
