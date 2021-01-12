import * as React from 'react';
import { StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

import type { VideoRecorderProps } from './types';

/**
 * Component that uses RNCamera to record videos. Since this mainly acts as a wrapper
 * around RNCamera, more information regarding some of its properties may be found here:
 * https://react-native-camera.github.io/react-native-camera/docs/rncamera#properties.
 *
 * Passing in a `ref` callback will provide a reference to this component with
 * the following functions: `startRecording()` and `stopRecording()`, which calls
 * `RNCamera.recordAsync(props.recordOptions)` and `RNCamera.stopRecording()`, respectively.
 */
const VideoRecorder = React.forwardRef<any, VideoRecorderProps>(
  (props, ref) => {
    const { showPreview, recordOptions, ...rncProps } = props;
    const [style, setStyle] = React.useState<object>(
      showPreview ? styles.preview : styles.hidden
    );
    const [cameraRef, setCameraRef] = React.useState<RNCamera | null>(null);

    React.useImperativeHandle(ref, () => ({
      startRecording: () => {
        if (cameraRef) {
          cameraRef.recordAsync(recordOptions);
        }
      },
      stopRecording: () => {
        if (cameraRef) {
          cameraRef.stopRecording();
        }
      },
    }));

    React.useEffect(() => {
      setStyle(showPreview ? styles.preview : styles.hidden);
    }, [showPreview]);

    return (
      <RNCamera
        {...rncProps}
        ref={(rncRef) => {
          setCameraRef(rncRef);
        }}
        style={style}
      />
    );
  }
);

VideoRecorder.defaultProps = {
  type: RNCamera.Constants.Type.front,
  cameraId: undefined, // TODO: detect 'Pixel 4' device model and default to 2 (nIR camera)
  useCamera2Api: true,
  androidCameraPermissionOptions: {
    title: 'Camera permissions',
    message:
      'Camera and external storage will be used to record and store videos during the tests.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  },
  captureAudio: false,
  showPreview: true,
  recordOptions: {
    quality: '4:3',
    orientation: 'auto',
    codec: 'H264',
    path: undefined, // undefined path will default to cache directory
  },
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
  },
  hidden: {
    flex: 1,
    opacity: 0,
  },
});

export default VideoRecorder;
