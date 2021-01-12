import type { RNCameraProps, RecordOptions } from 'react-native-camera';

export type ExperimentRunnerProps = {
  userId?: string;
};

export type StatusChangeEvent = {
  cameraStatus: 'READY' | 'PENDING_AUTHORIZATION' | 'NOT_AUTHORIZED';
  recordAudioPermissionStatus:
    | 'AUTHORIZED'
    | 'PENDING_AUTHORIZATION'
    | 'NOT_AUTHORIZED';
};

export type RecordingStartEvent = {
  nativeEvent: {
    uri: string;
    videoOrientation: number;
    deviceOrientation: number;
  };
};

export type Point = {
  x: number;
  y: number;
};

export type VideoRecorderProps = {
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
  /** https://react-native-camera.github.io/react-native-camera/docs/rncamera#recordasync-options-promise */
  recordOptions?: RecordOptions;
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
  onStatusChange?(event: StatusChangeEvent): void;
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
