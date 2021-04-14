import type {
  SessionConditionType,
  SurveyType,
} from '@senseyeinc/react-native-senseye-sdk';

/**
 * @returns The number of seconds elapsed since January 1, 1970 00:00:00 UTC.
 */
export function getCurrentTimestamp() {
  return Date.now() / 1000;
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

/**
 * Senseye constants.
 */
export const Constants = {
  API_HOST: 'api.senseye.co',
  API_BASE_PATH: '/v1',
  SessionCondition: SessionConditions,
  SurveyType: SurveyTypes,
  PredictedState: {
    READY: 'Ready',
    NOT_READY_FATIGUE: 'Not Ready: Fatigued',
    NOT_READY_BAC: 'Not Ready: Drunk',
  },
  TaskStatus: {
    PENDING: 'PENDING',
    RECEIVED: 'RECEIVED',
    STARTED: 'STARTED',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    REVOKED: 'REVOKED',
    RETRY: 'RETRY',
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
};
/** a series of calibration patterns (x,y) to select from */
export const calibrationPatterns = [
  [
    [0.2, 0.25],
    [0.4, 0.25],
    [0.6, 0.25],
    [0.8, 0.25],
    [0.25, 0.5],
    [0.5, 0.5],
    [0.75, 0.5],
    [0.2, 0.75],
    [0.4, 0.75],
    [0.6, 0.75],
    [0.8, 0.75],
  ],
  [
    [0.8, 0.25],
    [0.4, 0.75],
    [0.5, 0.5],
    [0.2, 0.25],
    [0.8, 0.75],
    [0.2, 0.75],
    [0.4, 0.25],
    [0.5, 0.5],
    [0.6, 0.25],
    [0.6, 0.75],
  ],
];
