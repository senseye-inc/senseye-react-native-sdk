import {
  getApplicationName,
  getDeviceType,
  getDeviceId,
  getModel,
  getReadableVersion,
  getSystemName,
  getSystemVersion,
} from 'react-native-device-info';

import Video from './Video';
import { getCurrentTimestamp } from '../../utils';
import type SenseyeApiClient from '../ApiClient';
import type Survey from './Survey';
import type {
  Data,
  ExperimentData,
  SessionData,
  SessionCondition,
} from './types';
import type { DataResponse } from '../types';

/** Valid session conditions. */
export const Condition: Record<string, SessionCondition> = {
  GOOD: 'GOOD',
  BAD: 'BAD',
  TEST: 'TEST',
  UNENDED: 'UNENDED',
  UNSPECIFIED: 'UNSPECIFIED',
};

/**
 * Class that models a session, facilitating the gathering and association of event
 * and video data generated during a participant's interaction with on-screen
 * stimuli, i.e. experiment or series of experiments.
 */
export default class Session {
  private apiClient: SenseyeApiClient;
  private id: string | null;
  private data: SessionData;
  private bufferLimit: number;
  private videos: Video[];

  /**
   * @param  apiClient
   * @param  bufferLimit  The max number of {@link ExperimentData} that can be held
   *                        within any one group by the buffer. If the limit is reached,
   *                        a data flush will be automatically triggered ({@link Session.flushData}).
   */
  constructor(apiClient: SenseyeApiClient, bufferLimit: number = 1000) {
    this.apiClient = apiClient;
    this.id = null;
    this.data = {};
    this.bufferLimit = bufferLimit;
    this.videos = [];
  }

  /**
   * Creates a session model with the specified parameters. Note this should only be
   * done once per instance. Ensure initialization is successful before executing
   * certain functions within this class, otherwise errors may be encountered.
   *
   * @param  userId             Custom username or ID of the participant. Must be unique to
   *                              the participant within the context of the API token/key of the client.
   * @param  demographicSurvey  A {@link Survey} of type `demographic` pertaining to the participant.
   * @returns                   A `Promise` that will produce the created session's metadata.
   */
  public async init(userId: string, demographicSurvey?: Survey) {
    if (this.id != null) {
      throw Error('Session is already initialized.');
    }

    if (demographicSurvey !== undefined) {
      const [questions, responses] = demographicSurvey.getEntries();
      // create demographic survey
      var survey = (
        await this.apiClient.post<DataResponse>('/data/surveys', {
          type: demographicSurvey.getType(),
          questions: questions,
          responses: responses,
        })
      ).data.data;
    }

    // create or fetch user
    try {
      var user = (
        await this.apiClient.post<DataResponse>('/data/users', {
          username: userId,
          survey_ids: survey ? [survey._id] : [],
        })
      ).data.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // username already exists, so fetch existing user's metadata
        const existingUser = (
          await this.apiClient.get<DataResponse>('/data/users', {
            params: {
              username: userId,
            },
          })
        ).data.data;

        if (existingUser && survey) {
          // add survey to the existing user
          existingUser.survey_ids.push(survey._id);
          this.apiClient.put<DataResponse>('/data/users/' + existingUser._id, {
            survey_ids: existingUser.survey_ids,
          });
        }
        user = existingUser;
      }
      throw error;
    }

    if (!user) {
      // this condition shouldn't be reached unless the API Client was configured incorrectly,
      // i.e. the expected response from Senseye was not received.
      throw Error(
        'Failed to create or fetch User. Missing expected response data.'
      );
    }

    // create session
    const session = (
      await this.apiClient.post<DataResponse>('/data/sessions', {
        user_id: user._id,
        survey_ids: survey ? [survey._id] : [],
        info: {
          app: {
            name: getApplicationName(),
            version: getReadableVersion(),
          },
          device: {
            id: getDeviceId(),
            model: getModel(),
            type: getDeviceType(),
            system: {
              name: getSystemName(),
              version: getSystemVersion(),
            },
          },
        },
      })
    ).data.data;

    if (!session) {
      // this condition shouldn't be reached unless the API Client was configured incorrectly,
      // i.e. the expected response from Senseye was not received.
      throw Error('Failed to create Session. Missing expected response data.');
    }
    this.id = session._id;

    return session;
  }

  /**
   * Starts the current session. Note a session cannot be started again once it
   * is started or stopped. If necessary, a new `Session` must be created.
   */
  public async start() {
    const timestamp = getCurrentTimestamp();

    if (this.id == null) {
      throw Error('Session must be initialized first.');
    }

    await this.apiClient.put<DataResponse>('/data/sessions/' + this.id, {
      start_timestamp: timestamp,
    });
  }

  /**
   * Stops the current session and flushes all accumulated/remaining data.
   *
   * @param  condition  A condition describing the session upon stopping.
   *                      See Constants.Condition for valid values.
   */
  public async stop(condition: SessionCondition = Condition.UNSPECIFIED) {
    const timestamp = getCurrentTimestamp();

    if (this.id == null) {
      throw Error('Session must be initialized first.');
    }

    // successful or not, data will be wiped from the buffer unless an error was thrown
    const flushSuccess = await this.flushData();
    if (!flushSuccess) {
      condition = Condition.BAD;
    }

    await this.apiClient.put<DataResponse>('/data/sessions/' + this.id, {
      stop_condition: condition,
      stop_timestamp: timestamp,
      create_datasets: true,
    });
  }

  /**
   * Uploads all accumulated data and flushes them from memory.
   *
   * @returns A `Promise` that will produce a boolean specifying whether the operaton succeeded.
   */
  public async flushData() {
    if (this.id == null) {
      throw Error('Session must be initialized first.');
    }

    let isSuccess = true;

    try {
      await this.apiClient.post<DataResponse>(
        '/data/sessions/' + this.id + '/data',
        this.data
      );
    } catch (error) {
      if (error.response) {
        // bad or malformed data was sent and so tossed
        isSuccess = false;
      } else {
        // never received a response, or request never left
        throw error;
      }
    }
    this.data = {};

    return isSuccess;
  }

  /**
   * Adds experiment data into a buffer and groups them according to the specified key.
   * If any grouping reaches the {@link Session.bufferLimit}, a data flush will
   * be automatically triggered ({@link Session.flushData})).
   *
   * @param  key  This should ideally be the name of the experiment the data originated from.
   * @param  data Data generated during an experiment.
   */
  public addExperimentData(key: string, data: ExperimentData) {
    if (!this.data[key]) this.data[key] = [data];
    else this.data[key].push(data);

    if (this.data[key].length >= this.bufferLimit) this.flushData();
  }

  /**
   * Creates and initializes a {@link Video}, associating it with the session.
   *
   * @param  name   Name of the video. Must be unique within the context of the session.
   * @param  config Camera and/or recording configurations.
   * @param  info   Any extra information or metadata.
   * @returns       The instance of the created `Video`.
   */
  public createVideo(
    name: string,
    config: { [key: string]: Data } = {},
    info: { [key: string]: Data } = {}
  ) {
    if (this.id == null) {
      throw Error('Session must be initialized first.');
    }

    const video = new Video(this.apiClient);
    video.init(this.id, name, config, info);
    this.videos.push(video);

    return video;
  }

  /**
   * @returns An array of `Video` instances created by the session.
   */
  public getVideos() {
    return this.videos;
  }

  /**
   * @returns `Session.id`, or `null` if the instance hasn't been successfully
   *            initialized yet ({@link Session.init}).
   */
  public getId() {
    return this.id;
  }
}
