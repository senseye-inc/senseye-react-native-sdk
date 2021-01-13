import {
  getApplicationName,
  getDeviceType,
  getDeviceId,
  getModel,
  getReadableVersion,
  getSystemName,
  getSystemVersion,
} from 'react-native-device-info';

import { getCurrentTimestamp } from '@utils';
import type { SenseyeApiClient } from '@api';
import type { Survey, Video } from '@api/models';
import type {
  DataResponse,
  ExperimentData,
  SessionData,
  SessionConditionType,
} from '@types';

/** Valid session conditions. */
export const Conditions: Record<string, SessionConditionType> = {
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
  private apiClient: SenseyeApiClient | undefined;
  private id: string | undefined;
  private metadata: { [key: string]: any };
  private user: { [key: string]: any };
  private data: SessionData;
  private bufferLimit: number;
  private videos: Video[];

  /**
   * @param  bufferLimit  The max number of {@link ExperimentData} that can be held
   *                        within any one group by the buffer. If the limit is reached,
   *                        a data flush will be automatically triggered ({@link Session.flushData}).
   */
  constructor(bufferLimit: number = 1000) {
    this.apiClient = undefined;
    this.id = undefined;
    this.metadata = {};
    this.user = {};
    this.data = {};
    this.bufferLimit = bufferLimit;
    this.videos = [];
  }

  /**
   * Creates a session model with the specified parameters. Note this should only be
   * done once per instance. Ensure initialization is successful before executing
   * certain functions within this class, otherwise errors may be encountered.
   *
   * @param  apiClient  Client configured to communicate with Senseye's API.
   * @param  userId     Custom username or ID of the participant. Must be unique to the
   *                      participant within the context of the API token/key of the client.
   * @param  surveyId   ID of a {@link Survey} to associate to the session. Will ideally be
   *                      the `demographic` survey pertaining to the partcipant.
   * @returns           A `Promise` that will produce the created session's metadata.
   */
  public async init(
    apiClient: SenseyeApiClient,
    userId: string,
    surveyId?: string
  ) {
    if (this.id !== undefined) {
      throw Error('Session is already initialized.');
    }
    this.apiClient = apiClient;

    // create or fetch user
    try {
      var user = (
        await this.apiClient.post<DataResponse>('/data/users', {
          username: userId,
          survey_ids: surveyId ? [surveyId] : [],
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

        if (existingUser && surveyId) {
          // add survey to the existing user
          existingUser.survey_ids.push(surveyId);
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
      throw Error('Failed to create or fetch User. Unexpected response data.');
    }
    this.user = {
      id: user._id,
      metadata: {
        survey_ids: user.survey_ids,
        info: user.info,
      },
    };

    // create session
    const session = (
      await this.apiClient.post<DataResponse>('/data/sessions', {
        user_id: user._id,
        survey_ids: surveyId ? [surveyId] : [],
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
      throw Error('Failed to create Session. Unexpected response data.');
    }
    this.id = session._id;
    this.metadata = {
      survey_ids: session.survey_ids,
      info: session.info,
    };

    return session;
  }

  /**
   * Starts the current session. Note a session cannot be started again once it
   * is started or stopped. If necessary, a new `Session` must be created.
   */
  public async start() {
    const timestamp = getCurrentTimestamp();

    if (!this.apiClient || !this.id) {
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
  public async stop(condition: SessionConditionType = Conditions.UNSPECIFIED) {
    const timestamp = getCurrentTimestamp();

    if (!this.apiClient || !this.id) {
      throw Error('Session must be initialized first.');
    }

    // successful or not, data will be wiped from the buffer unless an error was thrown
    const flushSuccess = await this.flushData();
    if (!flushSuccess) {
      condition = Conditions.BAD;
    }

    await this.apiClient.put<DataResponse>('/data/sessions/' + this.id, {
      stop_condition: condition,
      stop_timestamp: timestamp,
      create_datasets: true,
    });
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
   * Uploads all accumulated data and flushes them from memory.
   *
   * @returns A `Promise` that will produce a boolean specifying whether the operaton succeeded.
   */
  public async flushData() {
    if (!this.apiClient || !this.id) {
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
   * Initializes the provided survey ({@link Survey.init}), if not done so already,
   * and associates it with the session.
   *
   * @param  survey  Instance of a {@link Survey}.
   */
  public async pushSurvey(survey: Survey) {
    if (!this.apiClient || !this.id) {
      throw Error('Session must be initialized first.');
    }

    let surveyId = survey.getId();
    if (!surveyId) {
      await survey.init(this.apiClient);
      surveyId = survey.getId();
    }

    this.metadata.survey_ids.push(surveyId);
    this.user.metadata.survey_ids.push(surveyId);

    this.apiClient.put<DataResponse>('/data/sessions/' + this.id, {
      survey_ids: this.metadata.survey_ids,
    });
    this.apiClient.put<DataResponse>('/data/users/' + this.user.id, {
      survey_ids: this.user.metadata.survey_ids,
    });
  }

  /**
   * Initializes the provided video ({@link Video.init}), which associates it with the session.
   *
   * @param  video  Instance of an uninitialized {@link Video}.
   */
  public async pushVideo(video: Video) {
    if (!this.apiClient || !this.id) {
      throw Error('Session must be initialized first.');
    }

    await video.init(this.apiClient, this.id);
    this.videos.push(video);
  }

  /**
   * @returns An array of {@link Video} tracked by the session.
   */
  public getVideos() {
    return this.videos;
  }

  /**
   * @returns `Session.id`, or `undefined` if the instance hasn't been successfully
   *            initialized yet ({@link Session.init}).
   */
  public getId() {
    return this.id;
  }
}
