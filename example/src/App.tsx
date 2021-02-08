import * as React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {
  ExperimentRunner,
  Experiments,
  Models,
} from '@senseyeinc/react-native-senseye-sdk';

export default function App() {
  const onEnd = React.useCallback((_, videos) => {
    videos.forEach((video: Models.Video) => {
      CameraRoll.save(video.getUri(), { type: 'video' }).then((newUri) => {
        video.setUri(newUri);
        console.log(video.getName() + ': ' + newUri);
      });
    });
    Alert.alert(
      'Complete!',
      "Recorded videos have been transferred to your device's Camera Roll."
    );
  }, []);

  return (
    <View style={styles.container}>
      <ExperimentRunner onEnd={onEnd}>
        <Experiments.Calibration />
        <Experiments.Nystagmus />
        <Experiments.Plr />
      </ExperimentRunner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
