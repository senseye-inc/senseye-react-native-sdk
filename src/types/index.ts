import type { RecordOptions } from 'react-native-camera';

import type { Models } from '@senseyeinc/react-native-senseye-sdk';

/**
 * Response body from Senseye's Data API endpoints (i.e. `/data/*`).
 * Will contain one of either `data` or `error` depending on success, except for
 * PUT requests, which will never return `data` and will be empty on success.
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
 * Response body from Senseye's Compute API when a compute job is submitted.
 */
export type ComputeJobInitResponse = {
  /** UUID of the queued job. */
  id: string;
};

/**
 * Response body from Senseye's Compute API when polling for a job's status and/or result.
 * `result` and `timestamp` are present only if `status = JobStatus.COMPLETED`.
 */
export type ComputeJobResponse = {
  /** UUID of the job. */
  id: string;
  /** Possible values: `in_queue` | `in_progress` | `completed` | `failed` */
  status: string;
  result?: any;
  /** Datetime of when the job completed. */
  timestamp?: string;
};

export type PredictionResult = {
  version: string;
  prediction: {
    /** [0-1] Value closer to 1 indicate higher probability of fatigue. */
    fatigue: number | null;
    /** [0-1] Value closer to 1 indicate higher probability of intoxication. */
    intoxication: number | null;
    /**
     * Can be specified during the initial predict request, and is compared against
     * `fatigue` and `intoxication` to determine `state`. Defaults to 0.5
     */
    threshold: number;
    /**
     * Predicted state of the subject in the analyzed video(s).
     * Possible values: 0 | 1 | -1
     */
    state: number;
    /** Total processing time of the prediction job */
    processing_time: number;
  };
  error?: any;
};

export type Datum = boolean | number | string;

export type TaskData = {
  timestamp: number;
  data: { [key: string]: any };
};
export type SessionData = { [key: string]: Array<TaskData> };

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
 * Reference object produced by {@link VideoRecoder}.
 */
export type VideoRecorderObject = {
  /**
   * Starts a video recording. Do not call this if another recording is already in progress
   * or until after `VideoRecorder.onRecordingEnd`.
   *
   * @param  name           Name to assign to a {@link Video} that will be produced by this function.
   * @param  recordOptions  https://react-native-camera.github.io/react-native-camera/docs/rncamera#recordasync-options-promise
   * @returns               A `Promise` that will produce an uninitialized {@link Video} populated with metadata during the recording.
   */
  startRecording(
    name: string,
    recordOptions?: RecordOptions
  ): Promise<Models.Video>;
  /**
   * Stops the video recording.
   */
  stopRecording(): void;
};

export type TaskProps = {
  /** Name of the task. */
  name: string;
  /** Instructions to follow during the task. */
  instructions: string;
  /** Background color of task. */
  background: any;
  /** Use to adjust the width of canvas. */
  width: any;
  /** Use to adjust the height of canvas. */
  height: any;
  /** Function called on task start. */
  onStart?(): void;
  /** Function called on task end. */
  onEnd?(): void;
  /** Function called on each animation update during the task. */
  onUpdate?(data: TaskData): void;
};
