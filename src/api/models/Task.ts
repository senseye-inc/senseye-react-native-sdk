import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { EventData, Models } from '@senseyeinc/react-native-senseye-sdk';

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
      taskTimestamps: {},
      events: {},
    };
    this.videos = [];
  }

  /**
   * Records the sepcified data entry under {@link metadata | metadata.events}.
   *
   * @param data  Data entry produced during a task.
   */
  public addEventData(data: EventData) {
    const events = this.metadata.events;

    if (!('timestamps' in events)) {
      events.timestamps = [];
    }

    Object.keys(data.data).forEach((key) => {
      if (!(key in events)) {
        events[key] = new Array(events.timestamps.length).fill(undefined);
      }
    });

    Object.keys(events).forEach((key) => {
      if (key in data.data) {
        events[key].push(data.data[key]);
      } else if (key === 'timestamps') {
        events.timestamps.push(data.timestamp);
      } else {
        events[key].push(undefined);
      }
    });
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
    this.metadata.taskTimestamps.startTime = timestamp
      ? timestamp
      : getCurrentTimestamp();
  }

  /**
   * Records the task's stop timestamp.
   *
   * @param timestamp Stop time of the task's execution. Should be in UTC seconds.
   *                    If left unspecified, current UTC will be used.
   */
  public recordStopTime(timestamp?: number) {
    this.metadata.taskTimestamps.endTime = timestamp ? timestamp : getCurrentTimestamp();
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
    if (this.videos.length > 0) {
      let videoData = this.videos[0].getMetadata();
      videoData = { ...videoData.info, ...videoData };
      delete videoData.info;
      this.metadata.cameraRecording = videoData;
    }

    return this.metadata;
  }
}
