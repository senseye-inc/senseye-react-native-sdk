import type { RecordOptions } from 'react-native-camera';

import type { Models } from '@senseyeinc/react-native-senseye-sdk';

/**
 * Response body from Senseye Data API endpoints (`/data/*`).
 * Will contain either `data` or `error` depending on success. Note `data` may also
 * not be present for PUT requests.
 */
export type DataResponse = {
  /** On success, will contain the requested response data. */
  data?: { [key: string]: any };
  /** On error, will contain information regarding the error. */
  error?: {
    code: number;
    description: string;
    message: string;
    /** Propagated information of the root error. */
    root?: {
      type: string;
      description: string;
    };
  };
};

/**
 * Response body from Senseye Compute API endpoints that return a computed result,
 * e.g. `/GetVideoResult`.
 * Will contain either `results` or `error` depending on success.
 */
export type ComputeResultResponse = {
  /** An array of results, though may typically contain only one entry. */
  results?: ComputeResult[];
  error?: {
    code: number;
    message: string;
  };
};

/**
 * Response body from Senseye Compute API endpoints that create or monitor tasks,
 * e.g. `/PredictFatigue`, `/GetVideoTask`
 */
export type ComputeTaskResponse = {
  /** ID of the task. */
  id: string;
  /**
   * Current state of the task.
   * Possible values: `PENDING` | `RECEIVED` | `STARTED` | `SUCCESS` | `FAILURE` | `REVOKED` | `RETRY`
   */
  status: string;
};

export type ComputeResult = {
  eye_features: { [key: string]: number };
  prediction: {
    /** [0-1] Value closer to 1 indicate higher probability of fatigue. */
    fatigue_prediction?: number;
    /** [0-1] Value closer to 1 indicate higher probability the participant is drunk. */
    bac_prediction?: number;
    /** [0-1] Value closer to 1 indicate higher probability of high cognitive load. */
    cog_load_prediction?: number;
    /**
     * Final predicted state of subject in analyzed video.
     * Possible values: `Ready` | `Not Ready: Fatigued` | `Not Ready: Drunk`
     */
    predicted_state: string;
  };
};

export type PredictedState =
  | 'Ready'
  | 'Not Ready: Fatigued'
  | 'Not Ready: Drunk';

export type TaskStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'STARTED'
  | 'SUCCESS'
  | 'FAILURE'
  | 'REVOKED'
  | 'RETRY';

export type Datum = boolean | number | string;

export type ExperimentData = {
  timestamp: number;
  data: { [key: string]: any };
};
export type SessionData = { [key: string]: Array<ExperimentData> };

export type SessionConditionType =
  | 'GOOD'
  | 'BAD'
  | 'TEST'
  | 'UNENDED'
  | 'UNSPECIFIED';

export type SurveyType = 'demographic' | 'validation';

export type RecordingStartEvent = {
  nativeEvent: {
    uri: string;
    videoOrientation: number;
    deviceOrientation: number;
  };
};

export type RecorderStatusChangeEvent = {
  cameraStatus: 'READY' | 'PENDING_AUTHORIZATION' | 'NOT_AUTHORIZED';
  recordAudioPermissionStatus:
    | 'AUTHORIZED'
    | 'PENDING_AUTHORIZATION'
    | 'NOT_AUTHORIZED';
};

export type Point = {
  x: number;
  y: number;
};

/**
 * Object produced from a {@link VideoRecoder} ref callback.
 */
export type VideoRecorderObject = {
  /**
   * Starts a video recording. Do not call this if another recording is already in progress
   * or until after {@link VideoRecorder.onRecordingEnd}.
   *
   * @param  name           Name to assign to a {@link Video} that will be created and returned by this function.
   * @param  recordOptions  https://react-native-camera.github.io/react-native-camera/docs/rncamera#recordasync-options-promise
   * @returns               An uninitialized {@link Video} that will be populated with metadata during the recording.
   */
  startRecording(name: string, recordOptions?: RecordOptions): Models.Video;
  /**
   * Stops the video recording.
   */
  stopRecording(): void;
};

export type ExperimentProps = {
  /** Name of the experiment. **/
  name: string;
  /** Instructions to follow during the experiment. */
  instructions: string;
  /** Background color of experiment. */
  background: any;
  /** Use to adjust the width of canvas. */
  width: any;
  /** Use to adjust the height of canvas. */
  height: any;
  /** Function called on experiment start. */
  onStart?(): void;
  /** Function called on experiment end. */
  onEnd?(): void;
  /** Function called on each animation update during the experiment. */
  onUpdate?(data: ExperimentData): void;
};
