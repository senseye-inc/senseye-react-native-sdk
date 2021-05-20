import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { SenseyeApiClient } from '@senseyeinc/react-native-senseye-sdk';

/**
 * Class that models a session video, facilitating the logging of pertinent
 * metadata and provides the ability to upload recorded video.
 */
export default class Video {
  private metadata: { [key: string]: any };
  private uploadProgress: number;
  private name: string;
  private uri: string | undefined;

  /**
   * @param name    Desired video name.
   * @param config  Camera and/or recording configurations.
   * @param info    Any extra information or metadata.
   * @param uri     Video file URI. (Android) Ensure it is prefixed with `file://`.
   */
  constructor(
    name: string,
    config: { [key: string]: any } = {},
    info: { [key: string]: any } = {},
    uri?: string
  ) {
    this.metadata = {
      config: config,
      info: info,
    };
    this.name = getCurrentTimestamp().toString() + '_' + name;
    this.uri = uri;
    this.uploadProgress = -1;
  }

  /**
   * Records the video's start timestamp.
   *
   * @param timestamp Start time of the video's recording. Should be in UTC seconds.
   *                    If left unspecified, current UTC will be used.
   */
  public recordStartTime(timestamp?: number) {
    this.metadata.start_timestamp = timestamp ? timestamp : getCurrentTimestamp();
  }

  /**
   * Records the video's stop timestamp.
   *
   * @param timestamp Stop time of the video's recording. Should be in UTC seconds.
   *                    If left unspecified, current UTC will be used.
   */
  public recordStopTime(timestamp?: number) {
    this.metadata.stop_timestamp = timestamp ? timestamp : getCurrentTimestamp();
  }

  /**
   * Updates {@link metadata}.
   *
   * @param info  Metadata to be merged on top of the existing {@link metadata}.
   */
  public updateInfo(info: { [key: string]: any }) {
    this.metadata.info = { ...this.metadata.info, ...info };
  }

  /**
   * Sets {@link name}.
   *
   * @param name  Desired video name.
   */
  public setName(name: string) {
    this.name = name;
  }

  /**
   * Sets {@link uri}.
   *
   * @param uri Video file URI. (Android) Ensure it is prefixed with `file://`.
   */
  public setUri(uri: string) {
    this.uri = uri;
  }

  /**
   * Uploads a video file to Senseye's S3 bucket.
   *
   * @param apiClient Client configured to communicate with Senseye's API.
   * @param uri       Video file URI. (Android) Needs to be prefixed with `file://`.
   *                    Defaults to {@link uri} (see {@link setUri | setUri()}).
   * @param key       Desired S3 key for the file. Defaults to {@link name} (see {@link setName | setName()}).
   */
  public async upload(apiClient: SenseyeApiClient, uri?: string, key?: string) {
    if (uri === undefined) {
      if (this.uri === undefined) {
        throw new Error("Unable to upload video: No 'uri' provided.");
      } else {
        uri = this.uri;
      }
    }
    if (key === undefined) {
      key = this.name;
    }

    return apiClient.uploadFile(uri, key, (progressEvent: ProgressEvent) => {
      this.uploadProgress = progressEvent.loaded / progressEvent.total
    });
  }

  /**
   * Use this to track upload progress after calling {@link uploadFile | uploadFile()}.
   *
   * @returns The upload percentage as a number from 0.0 to 1.0, and -1 if
   *            {@link uploadFile | uploadFile()} has not been executed yet.
   */
  public getUploadProgress() {
    return this.uploadProgress;
  }


  /**
   * @returns The video's {@link name}.
   */
  public getName() {
    return this.name;
  }

  /**
   * @returns The video's {@link uri}.
   */
  public getUri() {
    return this.uri;
  }
}
