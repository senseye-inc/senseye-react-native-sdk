import { Platform } from 'react-native';
import {
  getApplicationName,
  getBrand,
  getDeviceType,
  getDeviceId,
  getModel,
  getReadableVersion,
  getSystemName,
  getSystemVersion,
} from 'react-native-device-info';
import { TemporaryDirectoryPath, writeFile } from 'react-native-fs';

import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { SenseyeApiClient, Models } from '@senseyeinc/react-native-senseye-sdk';

/**
 * Class that models a session, facilitating the gathering and association of task
 * and video data generated during a participant's interaction with on-screen
 * stimuli, i.e. task or series of tasks.
 */
export default class Session {
  private metadata: { [key: string]: any };
  private videos: Models.Video[];
  private jsonUploadPercentage: number;

  /**
   * @param uniqueId  Username or ID of the participant.
   * @param survey    A `Survey` whose response entries will be included in the session's {@link metadata}.
   */
  constructor(uniqueId?: string, survey?: Models.Survey) {
    const timestamp = getCurrentTimestamp();

    this.metadata = {
      app: {
        name: getApplicationName(),
        version: getReadableVersion(),
      },
      device: {
        id: getDeviceId(),
        brand: getBrand(),
        model: getModel(),
        type: getDeviceType(),
        os: {
          name: getSystemName(),
          version: getSystemVersion(),
        },
      },
      folderName: timestamp,
      uniqueId: uniqueId,
    };
    this.videos = [];
    this.jsonUploadPercentage = 0;

    if (survey) {
      // merge survey response entries into session metadata
      this.metadata = { ...this.metadata.info, ...survey.getEntries()[1] };
    }
    if (typeof this.metadata.uniqueId === 'string' && this.metadata.uniqueId !== '') {
      // if `uniqueId` was provided, either through the param or survey, prefix it to `folderName`
      this.metadata.folderName = this.metadata.uniqueId + '_' + this.metadata.folderName;
    }
  }

  /**
   * Associates the specified video with the session.
   *
   * @param video A `Video` instance.
   */
  public async addVideo(video: Models.Video) {
    if (typeof this.metadata.uniqueId === 'string' && this.metadata.uniqueId !== '') {
      // if `uniqueId` is present, prefix it to the video's name
      video.setName(this.metadata.uniqueId + '_' + video.getName());
    }
    this.videos.push(video);
  }

  /**
   * @returns A list of {@link Video | Videos} associated with the session (see {@link addVideo | addVideo()}).
   */
  public getVideos() {
    return this.videos;
  }

  /**
   * Begins uploading all videos associated with the session.
   *
   * @param apiClient Client configured to communicate with Senseye's API.
   * @returns         A `Promise` that will resolve into an array once all session videos finish uploading.
   *                    See {@link SenseyeApiClient.uploadfile} for the produced value of each item.
   */
  public uploadVideos(apiClient: SenseyeApiClient) {
    let uploads: Promise<any>[] = [];
    this.videos.forEach((v) => {
      uploads.push(
        v.upload(apiClient, undefined, this.metadata.folderName + '/' + v.getName())
      );
    });

    return Promise.all(uploads);
  }

  /**
   * Writes {@link metadata} to a temporary JSON file and uploads it to Senseye's S3 bucket.
   *
   * @param apiClient Client configured to communicate with Senseye's API.
   * @returns         A `Promise` that will resolve once the JSON file finishes uploading.
   *                    See {@link SenseyeApiClient.uploadFile} for the resolved value.
   */
  public async uploadJsonData(apiClient: SenseyeApiClient) {
    let fileName = getCurrentTimestamp() + '_input.json';
    if (typeof this.metadata.uniqueId === 'string' && this.metadata.uniqueId !== '') {
      // if `uniqueId` is present, prefix it to the file name
      fileName = this.metadata.uniqueId + '_' + fileName;
    }

    let data = this.metadata;
    data.tasks = [];
    this.videos.forEach((v) => {
      let videoData = v.getMetadata();
      videoData = { ...videoData.info, ...videoData };
      videoData.info = undefined;
      const taskData = { cameraRecording: videoData };
      data.tasks.push(taskData);
    });

    let tmpFilePath = TemporaryDirectoryPath + fileName;
    if (Platform.OS === 'android') {
      tmpFilePath = 'file://' + tmpFilePath;
    }
    await writeFile(tmpFilePath, JSON.stringify(this.metadata), 'utf8');

    return apiClient.uploadFile(
      tmpFilePath,
      this.metadata.folderName + '/' + fileName,
      (progressEvent: ProgressEvent) => {
        this.jsonUploadPercentage = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
      }
    );
  }

  /**
   * Calls {@link uploadVideos | uploadVideos()} and {@link uploadJsonData | uploadJsonData()}.
   *
   * @param apiClient Client configured to communicate with Senseye's API.
   * @returns         A `Promise` that will resolve into an array once both upload functions complete.
   *                    Respectively, the first and second index will contain the resolved values
   *                    produced by {@link uploadVideos | uploadVideos()} and {@link uploadJsonData | uploadJsonData()}.
   */
  public uploadAll(apiClient: SenseyeApiClient) {
    let uploads: Promise<any>[] = [];
    uploads.push(this.uploadVideos(apiClient));
    uploads.push(this.uploadJsonData(apiClient));

    return Promise.all(uploads);
  }

  /**
   * Use this to track the average progress of all uploads associated with the session.
   * See {@link uploadAll | uploadAll()}.
   *
   * @returns Integer value from `0` to `100`.
   */
  public getUploadPercentage() {
    let total = this.jsonUploadPercentage;

    this.videos.forEach((v) => {
      total += v.getUploadPercentage();
    });

    return Math.round(total / (this.videos.length + 1));
  }
}
