import { Platform } from 'react-native';
import type { AxiosRequestConfig } from 'axios';

import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type {
  SenseyeApiClient,
  // DataResponse,
} from '@senseyeinc/react-native-senseye-sdk';

/**
 * Class that models a session video, facilitating the logging of pertinent
 * metadata and provides the ability to upload recorded video.
 */
export default class Video {
  private apiClient: SenseyeApiClient | undefined;
  private id: string | undefined;
  private metadata: { [key: string]: any };
  private uri: string;
  private uploadProgress: number;

  /**
   * @param  name   Name of the video. Must be unique within the context of a {@link Session}.
   * @param  config Camera and/or recording configurations.
   * @param  info   Any extra information or metadata.
   * @param  uri    Video file URI. (Android) Ensure it is prefixed with `file://`.
   */
  constructor(
    name: string,
    config: { [key: string]: any } = {},
    info: { [key: string]: any } = {},
    uri: string = ''
  ) {
    this.apiClient = undefined;
    this.id = undefined;
    this.metadata = {
      name: name,
      config: config,
      info: info,
    };
    this.uri = uri;
    this.uploadProgress = -1;
  }

  /**
   * Initializes a video model through Senseye's API. Note this should only be
   * done once per instance. Ensure initialization is successful before executing
   * certain functions within this class, otherwise errors may be thrown..
   *
   * @param  apiClient  Client configured to communicate with Senseye's API.
   * @param  sessionId  ID of a {@link Session} to associate with.
   * @returns           A `Promise` that will produce the created video's metadata.
   */
  public async init(apiClient: SenseyeApiClient, sessionId: string) {
    if (this.id !== undefined) {
      Error('Video is already initialized.');
    }
    this.id =
      sessionId +
      '/' +
      getCurrentTimestamp().toString() +
      '_' +
      this.metadata.name;
    this.apiClient = apiClient;

    // const video = (
    //   await this.apiClient.post<DataResponse>('/data/videos', {
    //     user_session_id: sessionId,
    //     ...this.metadata,
    //   })
    // ).data.data;
    //
    // if (!video) {
    //   // this condition shouldn't be reached unless the API Client was configured incorrectly,
    //   // i.e. the expected response from Senseye was not received.
    //   throw Error('Failed to create Video. Unexpected response data.');
    // }
    // this.id = video._id;
    //
    // return video;

    return { id: this.id };
  }

  /**
   * Records the video's start timestamp.
   *
   * @param  timestamp  Start time of the video's recording. Should be in UTC seconds.
   *                      If left unspecified, current UTC will be used.
   */
  public recordStartTime(timestamp?: number) {
    this.metadata.start_timestamp = timestamp
      ? timestamp
      : getCurrentTimestamp();
  }

  /**
   * Records the video's stop timestamp.
   *
   * @param  timestamp  Stop time of the video's recording. Should be in UTC seconds.
   *                      If left unspecified, current UTC will be used.
   */
  public recordStopTime(timestamp?: number) {
    this.metadata.stop_timestamp = timestamp
      ? timestamp
      : getCurrentTimestamp();
  }

  /**
   * Updates the video's {@link info} metadata.
   *
   * @param  info  Metadata to be merged on top of any prior {@link info} metadata.
   */
  public updateInfo(info: { [key: string]: any }) {
    this.metadata.info = { ...this.metadata.info, ...info };
  }

  // /**
  //  * Pushes the video's most recent metadata values to Senseye's API.
  //  *
  //  * @returns A `Promise` that will produce an `AxiosResponse`.
  //  */
  // public pushUpdates() {
  //   if (!this.apiClient || !this.id) {
  //     throw Error('Video must be initialized first.');
  //   }
  //
  //   return this.apiClient.put<DataResponse>(
  //     '/data/videos/' + this.id,
  //     this.metadata
  //   );
  // }

  /**
   * Sets the URI to a local file.
   *
   * @param  uri Video file URI. (Android) Ensure it is prefixed with `file://`.
   */
  public setUri(uri: string) {
    this.uri = uri;
  }

  /**
   * Uploads a file and associates it with the video model.
   *
   * @param  uri        Video file URI. (Android) Ensure it is prefixed with `file://`.
   *                      Defaults to {@link uri} (see {@link setUri | setUri()}).
   * @param  codec      Specifies the codec of the video file.
   * @param  overwrite  Specifies whether to overwrite a previously uploaded file.
   * @returns           A `Promise` that will produce the video's updated metadata.
   */
  public async uploadFile(
    uri: string = this.uri,
    codec: string = 'mp4',
    overwrite: boolean = false
  ) {
    if (!this.apiClient || !this.id) {
      throw Error('Video must be initialized first.');
    }

    const data = new FormData();
    data.append('video', {
      name: uri.substring(uri.lastIndexOf('/') + 1, uri.length),
      type: 'video/' + codec,
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
    });
    const config: AxiosRequestConfig = {
      url: '/data/videos/' + this.id + '/upload',
      method: overwrite ? 'put' : 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        this.uploadProgress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    };

    const video = (await this.apiClient.request(config)).data.data;

    return video;
  }

  /**
   * Use this to track upload progress after calling {@link uploadFile | uploadFile()}.
   *
   * @returns The upload percentage as a number from 0 to 100, and -1 if
   *            {@link uploadFile | uploadFile()} has not been executed yet.
   */
  public getUploadProgress() {
    return this.uploadProgress;
  }

  // /**
  //  * @returns {@link id}, or `undefined` if the instance hasn't succesfully {@link init | initialized} yet.
  //  */
  // public getId() {
  //   return this.id;
  // }

  /**
   * @returns The video's assigned name.
   */
  public getName() {
    return this.metadata.name;
  }

  /**
   * @returns The video's file uri.
   */
  public getUri() {
    return this.uri;
  }
}
