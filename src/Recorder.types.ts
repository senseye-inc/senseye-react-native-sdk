import type { Constants, RNCameraProps } from 'react-native-camera';

export type VideoRecorderProps = {
  // type of camera to use
  // possible values: 'front' or 'back'
  type?: RNCameraProps['type'];
  // (Android) overrides the `type` property and uses the camera specified by its id
  cameraId?: string;
  // (Android) whether to use Android's Camera2 API
  useCamera2Api?: RNCameraProps['useCamera2Api'];
  // (Android) configuration options for permissions request for camera
  androidCameraPermissionOptions?: RNCameraProps['androidCameraPermissionOptions'];
  // (Android) configuration options for permissions request for recording audio
  androidRecordAudioPermissionOptions?: RNCameraProps['androidRecordAudioPermissionOptions'];
  // whether audio recording permissions should be requested
  captureAudio?: RNCameraProps['captureAudio'];
  // camera orientation when recording
  orientation?: keyof Constants['Orientation'];
  // path where recorded videos will be saved
  // default (null) will use the app's cache directory
  outputPath?: string;
  // whether to show camera preview
  showPreview?: boolean;
  // whether to start recording immediately when camera is ready
  recordWhenReady?: boolean;
};
