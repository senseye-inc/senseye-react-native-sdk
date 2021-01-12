import { Platform } from 'react-native';
import type { AxiosRequestConfig } from 'axios';

import { getCurrentTimestamp } from '../../utils';
import type SenseyeApiClient from '../ApiClient';
import type { Data } from './types';
import type { DataResponse } from '../types';

/**
 * Class that models a video, facilitating the logging of pertinent metadata
 * and provides the ability to upload recorded video.
 */
export default class Video {
  private apiClient: SenseyeApiClient;
  private id: string | null;
  private name: string | null;
  private metadata: { [key: string]: Data };
  private uploadProgress: number;

  /**
   * @param  apiClient
   */
  constructor(apiClient: SenseyeApiClient) {
    this.apiClient = apiClient;
    this.id = null;
    this.name = null;
    this.metadata = {};
    this.uploadProgress = -1;
  }

  /**
   * Creates a video model with the specified parameters. Note this should only be
   * done once per instance. Ensure initialization is successful before executing
   * certain functions within this class, otherwise errors may be encountered.
   *
   * @param  sessionId  ID of a {@link Session} to associate with.
   * @param  name       Name of the video. Must be unique within the context of `sessionId`.
   * @param  config     Camera and/or recording configurations.
   * @param  info       Any extra information or metadata.
   * @returns           A `Promise` that will produce the created video's metadata.
   */
  public async init(
    sessionId: string,
    name: string,
    config: { [key: string]: Data } = {},
    info: { [key: string]: Data } = {}
  ) {
    if (this.id != null) {
      Error('Video is already initialized.');
    }

    const video = (
      await this.apiClient.post<DataResponse>('/data/videos', {
        user_session_id: sessionId,
        name: name,
        config: config,
        info: info,
      })
    ).data.data;

    if (!video) {
      // this condition shouldn't be reached unless the API Client was configured incorrectly,
      // i.e. the expected response from Senseye was not received.
      throw Error('Failed to create Video. Missing expected response data.');
    }

    this.id = video._id;
    this.name = video.name;
    this.metadata = { info: video.info };

    return video;
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
   * Updates the video's `info` metadata.
   *
   * @param  info  Metadata to be merged on top of any previous `info` metadata.
   */
  public updateInfo(info: { [key: string]: Data }) {
    const prevInfo =
      this.metadata.info instanceof Object ? this.metadata.info : {};
    this.metadata.info = { ...prevInfo, ...info };
  }

  /**
   * Performs a PUT request to update the video's metadata.
   *
   * @returns A `Promise` that will produce an `AxiosResponse`.
   */
  public pushUpdates() {
    if (this.id == null) {
      throw Error('Video must be initialized first.');
    }

    return this.apiClient.put<DataResponse>(
      '/data/videos/' + this.id,
      this.metadata
    );
  }

  /**
   * Uploads a file and associates it with the video model.
   *
   * @param  uri        Video file URI. (Android) Ensure it is prefixed with `file://`.
   * @param  codec      Specifies the codec of the video file.
   * @param  overwrite  Specifies whether to overwrite a previously uploaded file.
   * @returns           A `Promise` that will produce the video's updated metadata.
   */
  public async uploadFile(
    uri: string,
    codec: string = 'mp4',
    overwrite: boolean = false
  ) {
    if (this.id == null) {
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
   * Use this to track upload progress after calling {@link Video.uploadFile}.
   *
   * @returns The upload percentage as a number from 0 to 100, and -1 if
   *            `uploadFile()` has not been executed yet.
   */
  public getUploadProgress() {
    return this.uploadProgress;
  }

  /**
   * @returns `Video.id`, or `null` if the instance hasn't been successfully
   *            initialized yet ({@link Video.init}).
   */
  public getId() {
    return this.id;
  }

  /**
   * @returns `Video.name`, or `null` if the instance hasn't been successfully
   *            initialized yet ({@link Video.init}).
   */
  public getName() {
    return this.name;
  }
}
