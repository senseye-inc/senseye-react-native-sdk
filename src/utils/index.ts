import type {
  SessionConditionType,
  SurveyType,
} from '@senseyeinc/react-native-senseye-sdk';

/**
 * @returns The number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 */
function getCurrentTimestamp() {
  return Date.now();
}

/**
 * @param ext File extension.
 * @returns   The corresponding MIME type. Defaults to `application/octet-stream`
 *              if the extension is not recognized.
 */
function getMimeFromExtension(ext: string) {
  switch (ext) {
    case 'avi':
      return 'video/x-msvideo';
    case 'mkv':
      return 'video/x-matroska';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

/**
 * @param value Value to check.
 * @returns     `true` if the value is a non-empty string. Otherwise, `false`.
 */
function isNonEmptyString(value: any) {
  return typeof value === 'string' && value !== '';
}

/** Valid session conditions. */
const SessionConditions: Record<string, SessionConditionType> = {
  GOOD: 'GOOD',
  BAD: 'BAD',
  TEST: 'TEST',
  UNENDED: 'UNENDED',
  UNSPECIFIED: 'UNSPECIFIED',
};

/** Valid survey types. */
const SurveyTypes: Record<string, SurveyType> = {
  DEMOGRAPHIC: 'demographic',
  VALIDATION: 'validation',
};

/** A list of calibration patterns (x,y) to select from */
const CalibrationPatterns = [
  [
    { x: 0.2, y: 0.25 },
    { x: 0.4, y: 0.25 },
    { x: 0.6, y: 0.25 },
    { x: 0.8, y: 0.25 },
    { x: 0.25, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.75, y: 0.5 },
    { x: 0.2, y: 0.75 },
    { x: 0.4, y: 0.75 },
    { x: 0.6, y: 0.75 },
    { x: 0.8, y: 0.75 },
  ],
  [
    { x: 0.8, y: 0.25 },
    { x: 0.4, y: 0.75 },
    { x: 0.5, y: 0.5 },
    { x: 0.2, y: 0.25 },
    { x: 0.8, y: 0.75 },
    { x: 0.2, y: 0.75 },
    { x: 0.4, y: 0.25 },
    { x: 0.5, y: 0.5 },
    { x: 0.6, y: 0.25 },
    { x: 0.6, y: 0.75 },
  ],
];

/** Senseye constants. */
const Constants = {
  API_HOST: 'api.senseye.co',
  API_BASE_PATH: '',
  SessionCondition: SessionConditions,
  SurveyType: SurveyTypes,
  PredictedState: {
    SAFE: 0,
    UNSAFE: 1,
    UNKNOWN: -1,
  },
  JobStatus: {
    QUEUED: 'in_queue',
    STARTED: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },
  FormData: {
    GENDER: {
      values: ['na', 'male', 'female', 'refused'],
      labels: ['N/A', 'Male', 'Female', 'Prefer Not To Answer'],
    },
    EYE: {
      values: ['na', 'blue', 'green', 'brown', 'hazel', 'other'],
      labels: ['N/A', 'Blue', 'Green', 'Brown', 'Hazel', 'Other'],
    },
    FATIGUE: {
      values: ['na', 1, 2, 3, 4, 5, 6, 7],
      labels: ['N/A', '1', '2', '3', '4', '5', '6', '7'],
    },
    MERIDIEM: {
      values: ['AM', 'PM'],
      labels: ['AM', 'PM'],
    },
  },
  CalibrationPatterns: CalibrationPatterns,
};

export { Constants, getCurrentTimestamp, getMimeFromExtension, isNonEmptyString };
