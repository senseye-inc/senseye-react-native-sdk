import { Conditions as SessionCondition } from '@api/models/Session';
import { Types as SurveyType } from '@api/models/Survey';

/**
 * @returns The number of seconds elapsed since January 1, 1970 00:00:00 UTC.
 */
export function getCurrentTimestamp() {
  return Date.now() / 1000;
}

/**
 * Senseye constants.
 */
export const Constants = {
  API_HOST: 'api.senseye.co',
  API_BASE_PATH: '/v1',
  SessionCondition: SessionCondition,
  SurveyType: SurveyType,
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
