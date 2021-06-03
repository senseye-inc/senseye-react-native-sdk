import * as React from 'react';
import { Platform, StyleSheet, View, SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import type { RNCameraProps, RecordOptions, RecordResponse } from 'react-native-camera';
import { getModel } from 'react-native-device-info';

import { Models, getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type {
  RecorderStatusChangeEvent,
  RecordingStartEvent,
  Point,
  VideoRecorderObject,
} from '@senseyeinc/react-native-senseye-sdk';
import FaceOutline from './FaceOutline';

const qualityStrings = Object.keys(RNCamera.Constants.VideoQuality);
const orientationStrings = Object.keys(RNCamera.Constants.Orientation);

export type VideoRecorderProps = {
  /** Type of camera to use. Possible values: 'front' | 'back' */
  type?: RNCameraProps['type'];
  /** Overrides the `type` property and uses the camera specified by its id. */
  cameraId?: string;
  /** (Android) Whether to use Android's Camera2 API. */
  useCamera2Api?: RNCameraProps['useCamera2Api'];
  /** (Android) Configuration options for permissions request for camera. */
  androidCameraPermissionOptions?: RNCameraProps['androidCameraPermissionOptions'];
  /** (Android) Configuration options for permissions request for recording audio. */
  androidRecordAudioPermissionOptions?: RNCameraProps['androidRecordAudioPermissionOptions'];
  /** Whether audio recording permissions should be requested. */
  captureAudio?: RNCameraProps['captureAudio'];
  /** @deprecated since version >0.3.0 */
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
 * around RNCamera, more information regarding some properties may be found
 * {@link https://react-native-camera.github.io/react-native-camera/docs/rncamera#properties | here}.
 *
 * Passing in a `ref` callback will produce a {@link VideoRecorderObject}.
 */
const VideoRecorder = React.forwardRef<VideoRecorderObject, VideoRecorderProps>(
  (props, ref) => {
    const { onRecordingStart, onRecordingEnd, ...rncProps } = props;
    const [videoEntity, setVideoEntity] = React.useState<Models.Video>();
    const [camera, setCamera] = React.useState<RNCamera>();

    const setRef = React.useCallback((node) => {
      if (node) {
        setCamera(node);
      }
    }, []);

    const _onRecordingStart = React.useCallback(
      (event: RecordingStartEvent) => {
        if (videoEntity) {
          videoEntity.recordStartTime(getCurrentTimestamp());
        }
        if (onRecordingStart) {
          onRecordingStart(event);
        }
      },
      [videoEntity, onRecordingStart]
    );

    const _onRecordingEnd = React.useCallback(() => {
      if (videoEntity) {
        videoEntity.recordStopTime(getCurrentTimestamp());
      }
      if (onRecordingEnd) {
        onRecordingEnd();
      }
    }, [videoEntity, onRecordingEnd]);

    // expose recording functions to the ref
    React.useImperativeHandle(
      ref,
      () => ({
        startRecording: async (name: string, recordOptions?: RecordOptions) => {
          if (camera) {
            recordOptions = {
              ...defaultRecordOptions,
              ...(recordOptions || {}),
            };

            const config: { [key: string]: any } = {};
            Object.entries(recordOptions).forEach(
              ([key, value]) => (config[key] = value)
            );
            if (typeof config.quality === 'number') {
              config.quality = qualityStrings[config.quality];
            }
            if (typeof config.orientation === 'number') {
              config.orientation = orientationStrings[config.orientation];
            }

            const info = {
              cameraType: 'UNKNOWN',
              cameraId: props.cameraId,
            };
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
              if (info.cameraId === undefined) {
                info.cameraType = 'RGB';
              } else if (info.cameraId === '2' && getModel() === 'Pixel 4') {
                info.cameraType = 'NIR';
              }
            }

            if (Platform.OS === 'ios' && typeof recordOptions.codec === 'string') {
              recordOptions.codec = RNCamera.Constants.VideoCodec[recordOptions.codec];
              console.debug('codec used: ' + recordOptions.codec.toString());
            }

            const v = new Models.Video(name, config, info);
            setVideoEntity(v);

            return camera.recordAsync(recordOptions).then((result: RecordResponse) => {
              const uri = result.uri;
              const fileExt = uri.substring(uri.lastIndexOf('.') + 1, uri.length);

              v.setName(v.getName() + '.' + fileExt);
              v.setUri(uri);
              v.updateInfo({
                // // TODO: currently not implemented in RNCamera for Camera2Api (Android)
                // orientation: {
                //   video: result.videoOrientation,
                //   device: result.deviceOrientation,
                // },
                // // TODO: consider removing
                // codec: result.codec,
                isRecordingInterrupted: result.isRecordingInterrupted,
              });

              return v;
            });
          }
          throw Error('Camera is unmounted or unavailable.');
        },
        stopRecording: () => {
          if (camera) {
            camera.stopRecording();
          } else {
            throw Error('Camera is unmounted or unavailable.');
          }
        },
      }),
      [camera, props.cameraId]
    );

    return (
      <SafeAreaView style={styles.preview}>
        <View style={styles.container}>
          <RNCamera
            {...rncProps}
            ref={setRef}
            style={styles.preview}
            onRecordingStart={_onRecordingStart}
            onRecordingEnd={_onRecordingEnd}
          >
            <View style={styles.face} pointerEvents={'none'}>
              <FaceOutline height={800} width={800} />
            </View>
          </RNCamera>
        </View>
      </SafeAreaView>
    );
  }
);

VideoRecorder.defaultProps = {
  type: 'front',
  cameraId: undefined,
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

const defaultRecordOptions: RecordOptions = {
  quality: '4:3',
  orientation: 'auto',
  codec: 'H264',
  mirrorVideo: false,
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  face: {
    flex: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    top: '5%',
    left: '-30%',
  },
});

export default VideoRecorder;
