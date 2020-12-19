import * as React from 'react';
import { StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

import type { VideoRecorderProps } from './Recorder.types';

/**
 * Camera component, deals with recording video
 * Records ASAP when mounted, stops recording when unmounted
 * TODO: maybe have an outside prop control whether we're recording or note
 * that will prevent us from having smaller videos due to camera load time
 * TODO: convert returned data URI to something usable
 */

export function VideoRecorder(props: VideoRecorderProps) {
  const cameraRef = React.useRef<RNCamera>(null);
  const {
    orientation,
    outputPath,
    recordWhenReady,
    showPreview,
    ...rncProps
  } = props;
  const [style, setStyle] = React.useState(
    showPreview ? styles.preview : styles.hidden
  );

  const onCameraReady = () => {
    // immediately begin recording when camera is loaded
    if (cameraRef.current && recordWhenReady) {
      cameraRef.current
        .recordAsync({
          orientation: orientation,
          path: outputPath,
        })
        .then((data) => {
          // TODO: Do something with me (data)!
          // https://react-native-camera.github.io/react-native-camera/docs/rncamera#recordasync-options-promise
          console.log(data);
        });
    }
  };
  const onRecordingStart = () => {
    // TODO: record startTimestamp
  };
  const onRecordingEnd = () => {
    // TODO: record stopTimestamp
  };

  React.useEffect(() => {
    var cRef = cameraRef.current;

    return () => {
      if (cRef) cRef.stopRecording();
    };
  }, []);

  React.useEffect(() => {
    setStyle(showPreview ? styles.preview : styles.hidden);
  }, [showPreview]);

  return (
    <RNCamera
      {...rncProps}
      ref={cameraRef}
      style={style}
      onCameraReady={onCameraReady}
      onRecordingStart={onRecordingStart}
      onRecordingEnd={onRecordingEnd}
    />
  );
}

VideoRecorder.defaultProps = {
  type: RNCamera.Constants.Type.front,
  // TODO: detect 'Pixel 4' device model and default to 2
  cameraId: null,
  useCamera2Api: true,
  androidCameraPermissionOptions: {
    title: 'Permission to use camera',
    message: 'We need your permission to use your camera',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
  },
  androidRecordAudioPermissionOptions: {
    title: 'Permission to use audio recording',
    message: 'We need your permission to use your audio',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
  },
  captureAudio: false,
  orientation: RNCamera.Constants.Orientation.auto,
  outputPath: null,
  recordWhenReady: false,
  showPreview: false,
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
  },
  // opacity set to 0 to hide the camera preview
  hidden: {
    flex: 1,
    opacity: 0,
  },
});
