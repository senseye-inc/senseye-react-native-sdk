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
   * Updates the video's {@link info} metadata.
   *
   * @param info  Metadata to be merged on top of any prior {@link info} metadata.
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
   * @param uri        Video file URI. (Android) Needs to be prefixed with `file://`.
   *                      Defaults to {@link uri} (see {@link setUri | setUri()}).
   * @param codec      Specifies the codec of the video file.
   */
  public async upload(uri: string = this.uri, codec: string = 'mp4') {
    if (!this.apiClient || !this.id) {
      throw Error('Video must be initialized first.');
    }

    // send request for a presigned url to upload video to Senseye
    let data = (
      await this.apiClient.post('/data/generate-upload-url', {
        key: this.id + '.' + codec,
      })
    ).data;

    const bucket = data.url.split('/').pop();

    // use the response values to construct the required request body
    const formData = new FormData();
    Object.keys(data.fields).forEach((key) => {
      formData.append(key, data.fields[key]);
    });
    formData.append('file', {
      name: uri.substring(uri.lastIndexOf('/') + 1, uri.length),
      type: 'video/' + codec,
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
    });

    const requestConfig: AxiosRequestConfig = {
      url: data.url,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        this.uploadProgress = progressEvent.loaded / progressEvent.total;
      },
    };

    await axios.request(requestConfig);

    return { s3_url: 's3://' + bucket + '/' + data.fields.key };
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
