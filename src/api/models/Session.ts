// import {
//   getApplicationName,
//   getDeviceType,
//   getDeviceId,
//   getModel,
//   getReadableVersion,
//   getSystemName,
//   getSystemVersion,
// } from 'react-native-device-info';

import {
  // Constants,
  getCurrentTimestamp,
} from '@senseyeinc/react-native-senseye-sdk';
import type {
  SenseyeApiClient,
  // DataResponse,
  // TaskData,
  // SessionData,
  // SessionConditionType,
  Models,
} from '@senseyeinc/react-native-senseye-sdk';

/**
 * Class that models a session, facilitating the gathering and association of event
 * and video data generated during a participant's interaction with on-screen
 * stimuli, i.e. task or series of tasks.
 */
export default class Session {
  private apiClient: SenseyeApiClient | undefined;
  private id: string | undefined;
  // private metadata: { [key: string]: any };
  // private user: { [key: string]: any };
  // private data: SessionData;
  // private bufferLimit: number;
  private videos: Models.Video[];

  // /**
  //  * @param  bufferLimit  The max number of {@link TaskData} that can be held
  //  *                        within any one group by the buffer. If the limit is reached,
  //  *                        {@link flushData | flushData()} will be automatically triggered.
  //  */
  // constructor(bufferLimit: number = 1000) {
  constructor() {
    this.apiClient = undefined;
    this.id = undefined;
    //   this.metadata = {};
    //   this.user = {};
    //   this.data = {};
    //   this.bufferLimit = bufferLimit;
    this.videos = [];
  }

  /**
   * Creates a session model with the specified parameters. Note this should only be
   * done once per instance. Ensure initialization is successful before executing
   * certain functions within this class, otherwise errors may be thrown..
   *
   * @param  apiClient  Client configured to communicate with Senseye's API.
   * @param  uniqueId   Custom username or ID of the participant. Must be unique to the
   *                      participant within the context of the API key passed into the client.
   * @param  surveyId   ID of a {@link Survey} to associate to the session. Will ideally be
   *                      the demographic survey pertaining to the participant.
   * @returns           A `Promise` that will produce the created session's metadata.
   */
  public async init(
    apiClient: SenseyeApiClient,
    uniqueId?: string,
    surveyId?: string
  ) {
    if (this.id !== undefined) {
      throw Error('Session is already initialized.');
    }

    this.id = getCurrentTimestamp().toString();
    if (uniqueId) {
      this.id = uniqueId + '_' + this.id
    }

    this.apiClient = apiClient;

    if (surveyId) {
      // TODO: unimplemented
    }

    // // create or fetch user
    // try {
    //   var user = (
    //     await this.apiClient.post<DataResponse>('/data/users', {
    //       username: uniqueId,
    //       survey_ids: surveyId ? [surveyId] : [],
    //     })
    //   ).data.data;
    // } catch (error) {
    //   if (error.response && error.response.status === 409) {
    //     // username already exists, so fetch existing user's metadata
    //     const existingUser = (
    //       await this.apiClient.get<DataResponse>('/data/users', {
    //         params: {
    //           username: uniqueId,
    //         },
    //       })
    //     ).data.data;
    //
    //     if (existingUser && surveyId) {
    //       // add survey to the existing user
    //       existingUser.survey_ids.push(surveyId);
    //       this.apiClient.put<DataResponse>('/data/users/' + existingUser._id, {
    //         survey_ids: existingUser.survey_ids,
    //       });
    //     }
    //     user = existingUser;
    //   }
    //   throw error;
    // }
    //
    // if (!user) {
    //   // this condition shouldn't be reached unless the API Client was configured incorrectly,
    //   // i.e. the expected response from Senseye was not received.
    //   throw Error('Failed to create or fetch User. Unexpected response data.');
    // }
    // this.user = {
    //   id: user._id,
    //   metadata: {
    //     survey_ids: user.survey_ids,
    //     info: user.info,
    //   },
    // };
    //
    // // create session
    // const session = (
    //   await this.apiClient.post<DataResponse>('/data/sessions', {
    //     user_id: user._id,
    //     survey_ids: surveyId ? [surveyId] : [],
    //     info: {
    //       app: {
    //         name: getApplicationName(),
    //         version: getReadableVersion(),
    //       },
    //       device: {
    //         id: getDeviceId(),
    //         model: getModel(),
    //         type: getDeviceType(),
    //         system: {
    //           name: getSystemName(),
    //           version: getSystemVersion(),
    //         },
    //       },
    //     },
    //   })
    // ).data.data;
    //
    // if (!session) {
    //   // this condition shouldn't be reached unless the API Client was configured incorrectly,
    //   // i.e. the expected response from Senseye was not received.
    //   throw Error('Failed to create Session. Unexpected response data.');
    // }
    // this.id = session._id;
    // this.metadata = {
    //   survey_ids: session.survey_ids,
    //   info: session.info,
    // };
    //
    // return session;

    return { id: this.id };
  }

  // /**
  //  * Starts the current session. Note a session cannot be started again once it
  //  * is started or stopped. If necessary, a new `Session` must be created.
  //  */
  // public async start() {
  //   const timestamp = getCurrentTimestamp();
  //
  //   if (!this.apiClient || !this.id) {
  //     throw Error('Session must be initialized first.');
  //   }
  //
  //   await this.apiClient.put<DataResponse>('/data/sessions/' + this.id, {
  //     start_timestamp: timestamp,
  //   });
  // }

  // /**
  //  * Stops the current session and flushes all accumulated/remaining data.
  //  *
  //  * @param  condition  A condition describing the session upon stopping.
  //  */
  // public async stop(
  //   condition: SessionConditionType = Constants.SessionCondition.UNSPECIFIED
  // ) {
  //   const timestamp = getCurrentTimestamp();
  //
  //   if (!this.apiClient || !this.id) {
  //     throw Error('Session must be initialized first.');
  //   }
  //
  //   // successful or not, data will be wiped from the buffer unless an error was thrown
  //   const flushSuccess = await this.flushData();
  //   if (!flushSuccess) {
  //     condition = Constants.SessionCondition.BAD;
  //   }
  //
  //   await this.apiClient.put<DataResponse>('/data/sessions/' + this.id, {
  //     stop_condition: condition,
  //     stop_timestamp: timestamp,
  //     create_datasets: true,
  //   });
  // }

  // /**
  //  * Adds task data into a buffer and groups them according to the specified `key`.
  //  * If any grouping reaches the {@link bufferLimit}, {@link flushData | flushData()}
  //  * will be automatically triggered.
  //  *
  //  * @param  key  This should ideally be the name of the task the data originated from.
  //  * @param  data Data generated during an task.
  //  */
  // public addTaskData(key: string, data: TaskData) {
  //   if (!this.data[key]) this.data[key] = [data];
  //   else this.data[key].push(data);
  //
  //   if (this.data[key].length >= this.bufferLimit) this.flushData();
  // }

  // /**
  //  * Uploads all accumulated data and flushes them from memory.
  //  *
  //  * @returns A `Promise` that will produce a boolean specifying whether the operaton succeeded.
  //  */
  // public async flushData() {
  //   if (!this.apiClient || !this.id) {
  //     throw Error('Session must be initialized first.');
  //   }
  //
  //   let isSuccess = true;
  //
  //   try {
  //     await this.apiClient.post<DataResponse>(
  //       '/data/sessions/' + this.id + '/data',
  //       this.data
  //     );
  //   } catch (error) {
  //     if (error.response) {
  //       // bad or malformed data was sent and so tossed
  //       isSuccess = false;
  //     } else {
  //       // never received a response, or request never left
  //       throw error;
  //     }
  //   }
  //   this.data = {};
  //
  //   return isSuccess;
  // }

  // /**
  //  * Initializes the specified survey if not done so already, and associates it with the session.
  //  *
  //  * @param  survey  Instance of a `Survey`.
  //  */
  // public async pushSurvey(survey: Models.Survey) {
  //   if (!this.apiClient || !this.id) {
  //     throw Error('Session must be initialized first.');
  //   }
  //
  //   let surveyId = survey.getId();
  //   if (!surveyId) {
  //     await survey.init(this.apiClient);
  //     surveyId = survey.getId();
  //   }
  //
  //   this.metadata.survey_ids.push(surveyId);
  //   this.user.metadata.survey_ids.push(surveyId);
  //
  //   this.apiClient.put<DataResponse>('/data/sessions/' + this.id, {
  //     survey_ids: this.metadata.survey_ids,
  //   });
  //   this.apiClient.put<DataResponse>('/data/users/' + this.user.id, {
  //     survey_ids: this.user.metadata.survey_ids,
  //   });
  // }

  /**
  /**
   * Initializes the provided video, which associates it with the session.
   * See {@link getVideos | getVideos()}.
   *
   * @param  video  Instance of an uninitialized `Video`.
   */
  public async pushVideo(video: Models.Video) {
    if (!this.apiClient || !this.id) {
      throw Error('Session must be initialized first.');
    }

    await video.init(this.apiClient, this.id);
    this.videos.push(video);
  }

  /**
   * @returns An array of videos associated with the session.
   */
  public getVideos() {
    return this.videos;
  }

  /**
   * @returns {@link id}, or `undefined` if the instance hasn't succesfully {@link init | initialized} yet.
   */
  public getId() {
    return this.id;
  }
}
