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

  /**
   * @param uniqueId  Username or ID of the participant.
   * @param survey    A `Survey` whose response entries will be included in the session's {@link metadata}.
   */
  constructor(uniqueId?: string, survey?: Models.Survey) {
    const timestamp = getCurrentTimestamp();

    this.videos = [];
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
   * @returns         A `Promise` that will resolve when all of the session videos finish uploading.
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

  public getUploadProgress() {
    let totalProgress = 0;
    this.videos.forEach((v) => {
      const p = v.getUploadProgress();
      totalProgress += p === -1 ? 0 : p;
    });

    return totalProgress / this.videos.length;
  }
}
