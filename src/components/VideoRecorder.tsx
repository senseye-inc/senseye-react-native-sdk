import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { RNCamera } from 'react-native-camera';
import type {
  RNCameraProps,
  RecordOptions,
  RecordResponse,
} from 'react-native-camera';

import {
  Models,
  getCurrentTimestamp,
} from '@senseyeinc/react-native-senseye-sdk';
import type {
  RecorderStatusChangeEvent,
  RecordingStartEvent,
  Point,
} from '@senseyeinc/react-native-senseye-sdk';

type VideoRecorderProps = {
  /** Type of camera to use. Possible values: 'front' | 'back' */
  type?: RNCameraProps['type'];
  /** (Android) Overrides the `type` property and uses the camera specified by its id. */
  cameraId?: string;
  /** (Android) Whether to use Android's Camera2 API. */
  useCamera2Api?: RNCameraProps['useCamera2Api'];
  /** (Android) Configuration options for permissions request for camera. */
  androidCameraPermissionOptions?: RNCameraProps['androidCameraPermissionOptions'];
  /** (Android) Configuration options for permissions request for recording audio. */
  androidRecordAudioPermissionOptions?: RNCameraProps['androidRecordAudioPermissionOptions'];
  /** Whether audio recording permissions should be requested. */
  captureAudio?: RNCameraProps['captureAudio'];
  /** Whether to show camera preview. */
  showPreview?: boolean;
  /**
   * Function to be called when camera is ready. This event will also fire when
   * changing cameras (by `type` or `cameraId`).
   */
  onCameraReady?(): void;
  /**
   * Function to be called when there is a problem mounting the camera.
   */
  onMountError?(): void;
  /**
   * Function to be called when there is a status change in relation to
   * authorization changes.
   */
  onStatusChange?(event: RecorderStatusChangeEvent): void;
  /**
   * Function to be called when video actually starts recording. Note that video
   * recording might take a few milliseconds to setup depending on the camera
   * settings and hardware features.
   */
  onRecordingStart?(event: RecordingStartEvent): void;
  /**
   * Function to be called when video stops recording, but before all video
   * processing takes place. This event will only fire after a successful video
   * recording, and it will not fire if video recording fails.
   */
  onRecordingEnd?(): void;
  /**
   * Function to be called when a double touch within the camera view is recognized.
   */
  onDoubleTap?(origin: Point): void;
};

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
    const {
      showPreview,
      onRecordingStart,
      onRecordingEnd,
      ...rncProps
    } = props;
    const [style, setStyle] = React.useState<ViewStyle>(
      showPreview ? styles.preview : styles.hidden
    );
    const [cameraRef, setCameraRef] = React.useState<RNCamera | null>();
    const [video, setVideo] = React.useState<Models.Video>();

    function _onRecordingStart(event: RecordingStartEvent) {
      if (video) {
        video.recordStartTime(getCurrentTimestamp());
      }
      if (onRecordingStart) {
        onRecordingStart(event);
      }
    }
    function _onRecordingEnd() {
      if (video) {
        video.recordStopTime(getCurrentTimestamp());
      }
      if (onRecordingEnd) {
        onRecordingEnd();
      }
    }

    React.useImperativeHandle(ref, () => ({
      /**
       * Starts a video recording. Do not call this again until after {@link VideoRecorder.onRecordingEnd}
       * or if an error is returned, otherwise the current {@link Video} will be overwritten.
       *
       * @param  name           Name to assign to {@link Video}.
       * @param  recordOptions  https://react-native-camera.github.io/react-native-camera/docs/rncamera#recordasync-options-promise
       * @returns               A `Promise` that will produce an uninitialized {@link Video}
       *                          populated with metadata during the recording.
       */
      startRecording: async (
        name: string,
        recordOptions: RecordOptions = {
          quality: '4:3',
          orientation: 'auto',
          codec: 'H264',
          mirrorVideo: false,
        }
      ) => {
        if (cameraRef) {
          const config = {
            quality: recordOptions.quality,
            bitrate: recordOptions.videoBitrate,
            orientation: recordOptions.orientation,
            codec: recordOptions.codec,
            horizontal_flip: recordOptions.mirrorVideo,
          };
          const info = {
            camera_type: props.type,
            camera_id: props.cameraId,
          };

          setVideo(new Models.Video(name, config, info));
          return cameraRef
            .recordAsync(recordOptions)
            .then((result: RecordResponse) => {
              if (video) {
                video.setUri(result.uri);
                video.updateInfo({
                  orientation: {
                    video: result.videoOrientation,
                    device: result.deviceOrientation,
                  },
                  codec: result.codec,
                  recording_interrupted: result.isRecordingInterrupted,
                });
              }
              return video;
            });
        }
        throw Error('Camera is not mounted or unavailable.');
      },
      /**
       * Stops the video recording. Should be called after `startRecording()`.
       */
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
        onRecordingStart={(event) => _onRecordingStart(event)}
        onRecordingEnd={_onRecordingEnd}
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
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    opacity: 1,
    height: '100%',
    width: '100%',
  },
  hidden: {
    flex: 0,
    opacity: 0,
    height: 0,
    width: 0,
  },
});

export default VideoRecorder;
