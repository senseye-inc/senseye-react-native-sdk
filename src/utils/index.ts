import type { SessionCondition, SurveyType } from '@senseyeinc/react-native-senseye-sdk';
import * as yup from 'yup';

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
const SessionConditions: Record<string, SessionCondition> = {
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

/** A list of calibration patterns (x,y) to select from. */
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

const validationSchema = yup.object().shape({
  age: yup
    .number()
    .positive()
    .typeError('Enter a valid number for age')
    .integer()
    .min(13)
    .max(99)
    .required()
    .label('Age'),
  gender: yup
    .string()
    .typeError('Select your gender from the dropdown')
    .required()
    .label(''),
  eyeColor: yup
    .string()
    .typeError('Select your eye color from the dropdown')
    .required()
    .label(''),
  fatigueLevel: yup
    .number()
    .typeError('Select a rating for your fatigue level')
    .positive()
    .integer()
    .required()
    .label('Fatigue Level'),
  uniqueId: yup
    .string()
    .typeError('Unique ID is typeError')
    .required()
    .label('Unique ID'),
  bedHour: yup
    .number()
    .typeError('The hour for bedtime can only contain numbers')
    .integer()
    .label('Bed Hour')
    .max(12)
    .required(),
  bedMin: yup
    .number()
    .typeError('The minutes for bedtime can only contain numbers')
    .integer()
    .max(59)
    .required()
    .label('Bed Minutes'),
  bedDate: yup.date().label('Date of Bedtime'),
  wakeHour: yup
    .number()
    .typeError('The hour for wake time can only contain numbers')
    .integer()
    .max(12)
    .required()
    .label('Wake Hour'),
  wakeMin: yup
    .number()
    .typeError('The minutes for wake time can only contain numbers')
    .integer()
    .max(59)
    .required()
    .label('Wake Minute'),
  wakeDate: yup.date().label('Date of wake'),
});

export {
  Constants,
  getCurrentTimestamp,
  getMimeFromExtension,
  isNonEmptyString,
  validationSchema,
};
