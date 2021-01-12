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
  results?: {
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
  }[];
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
  status: TaskStatusType;
};

export type TaskStatusType =
  | 'PENDING'
  | 'RECEIVED'
  | 'STARTED'
  | 'SUCCESS'
  | 'FAILURE'
  | 'REVOKED'
  | 'RETRY';
