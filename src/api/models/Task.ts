import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { Models } from '@senseyeinc/react-native-senseye-sdk';

/**
 * Model representing a task entity. Facilitates the gathering of relevant metadata and event data.
 */
export default class Task {
  private metadata: { [key: string]: any };
  private videos: Models.Video[];

  /**
   * @param name    Name of the task.
   * @param info    Any extra information or metadata.
   */
  constructor(name: string, info: { [key: string]: any } = {}) {
    this.metadata = {
      name: name,
      info: info,
    };
    this.videos = [];
  }

  /**
   * Associates the specified video with the task.
   *
   * @param video A `Video` instance.
   */
  public addVideo(video: Models.Video) {
    this.videos.push(video);
  }

  /**
   * @returns A list of {@link Video | Videos} associated with the task (see {@link addVideo | addVideo()}).
   */
  public getVideos() {
    return this.videos;
  }

  /**
   * Records the task's start timestamp.
   *
   * @param timestamp Start time of the task's execution. Should be in UTC seconds.
   *                    If left unspecified, current UTC will be used.
   */
  public recordStartTime(timestamp?: number) {
    this.metadata.startTime = timestamp ? timestamp : getCurrentTimestamp();
  }

  /**
   * Records the task's stop timestamp.
   *
   * @param timestamp Stop time of the task's execution. Should be in UTC seconds.
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
   * @returns The task's {@link metadata}.
   */
  public getMetadata() {
    this.metadata.cameraRecordings = [];
    this.videos.forEach((v) => {
      let videoData = v.getMetadata();
      videoData = { ...videoData.info, ...videoData };
      videoData.info = undefined;
      this.metadata.cameraRecordings.push(videoData);
    });

    return this.metadata;
  }
}
