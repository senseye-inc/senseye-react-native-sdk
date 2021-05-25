import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { SenseyeApiClient } from '@senseyeinc/react-native-senseye-sdk';

/**
 * Data model for a video recording. Facilitates the gathering of related metadata
 * and provides the ability to upload a video file.
 */
export default class Video {
  private metadata: { [key: string]: any };
  private name: string;
  private uri: string | undefined;
  private uploadPercentage: number;

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
    this.name = getCurrentTimestamp().toString() + '_' + name;
    this.metadata = {
      name: this.name,
      config: config,
      info: info,
    };
    this.uri = uri;
    this.uploadPercentage = 0;
  }

  /**
   * Records the video's start timestamp.
   *
   * @param timestamp Start time of the video's recording. Should be in UTC seconds.
   *                    If left unspecified, current UTC will be used.
   */
  public recordStartTime(timestamp?: number) {
    this.metadata.startTime = timestamp ? timestamp : getCurrentTimestamp();
  }

  /**
   * Records the video's stop timestamp.
   *
   * @param timestamp Stop time of the video's recording. Should be in UTC seconds.
   *                    If left unspecified, current UTC will be used.
   */
  public recordStopTime(timestamp?: number) {
    this.metadata.endTime = timestamp ? timestamp : getCurrentTimestamp();
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
   * @returns         A `Promise` that will resolve into a dictionary containing the destination S3 url (`s3_url`).
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
      this.uploadPercentage = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
    });
  }

  /**
   * Use this to track upload progress after calling {@link uploadFile | uploadFile()}.
   *
   * @returns Integer value from `0` to `100`.
   */
  public getUploadPercentage() {
    return this.uploadPercentage;
  }

  /**
   * @returns The video's {@link metadata}.
   */
  public getMetadata() {
    this.metadata.name = this.name;

    return this.metadata;
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
