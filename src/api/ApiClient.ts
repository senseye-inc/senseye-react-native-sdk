import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import type { ComputeResultResponse, ComputeTaskResponse } from './types';

export const HOST = 'api.senseye.co';
export const BASE_PATH = '/v1';

/**
 * Client that interfaces with Senseye's REST API. Provides wrapper functions for
 * standard GET, DELETE, POST and PUT requests, as well as specific Senseye endpoints.
 */
export default class SenseyeApiClient {
  public axios: AxiosInstance;

  /**
   * @param host  Domain name or IP address of the API host. e.g. api.senseye.co[:80]
   * @param basePath  URL path prefix that'll be appended to `host`.
   * @param token  Authentication token or API key.
   */
  constructor(
    host: string = HOST,
    basePath: string = BASE_PATH,
    token?: string
  ) {
    let baseUrl = 'https://' + host + basePath;
    let headers: { [key: string]: string } = {};

    if (token) headers.Authorization = 'Bearer ' + token;

    this.axios = axios.create({
      baseURL: baseUrl,
      headers: headers,
    });
  }

  public async request<T = any>(config: AxiosRequestConfig) {
    try {
      return this.axios.request<T>(config);
    } catch (error) {
      if (error.response && error.response.data.error) {
        // extract Senseye's custom http error message
        error.message = error.response.data.error.message;
      }
      throw error;
    }
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ method: 'get', url: url, ...config });
  }
  public delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ method: 'delete', url: url, ...config });
  }
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ method: 'post', url: url, data: data, ...config });
  }
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ method: 'put', url: url, data: data, ...config });
  }

  /**
   * Initiates a compute task to predict fatigue level of the participant in a given video.
   *
   * @param  uri URI to a video containing a participant.
   * @returns    A `Promise` that will produce a `ComputeTaskResponse`.
   */
  public predictFatigue(uri: string) {
    return this.post<ComputeTaskResponse>('/v1/PredictFatigue', {
      video_uri: uri,
    });
  }

  /**
   * Initiates a compute task to predict blood alcohol concentration of the participant in a given video.
   *
   * @param  uri URI to a video containing a participant.
   * @returns    A `Promise` that will produce a `ComputeTaskResponse`.
   */
  public predictBAC(uri: string) {
    return this.post<ComputeTaskResponse>('/v1/PredictBAC', {
      video_uri: uri,
    });
  }

  /**
   * Initiates a compute task to predict cognitiven load of the participant in a given video.
   *
   * @param  uri URI to a video containing a participant.
   * @returns    A `Promise` that will produce a `ComputeTaskResponse`.
   */
  public predictCognitiveLoad(uri: string) {
    return this.post<ComputeTaskResponse>('/v1/PredictCognitiveLoad', {
      video_uri: uri,
    });
  }

  /**
   * Fetches the latest status of a compute task. Use this to poll for `SUCCESS`
   * before calling {@link SenseyeApiClient.getComputeResult}.
   *
   * @param  id Task ID. Can be obtained from `ComputeTaskResponse.id`.
   * @returns   A `Promise` that will produce a `ComputeTaskResponse`, containing
   *              the task's most recent status.
   */
  public getComputeTask(id: string) {
    return this.get<ComputeTaskResponse>('/v1/GetVideoTask/' + id);
  }

  /**
   * Stops a running compute task.
   *
   * @param  id Task ID. Can be obtained from `ComputeTaskResponse.id`.
   * @returns   A `Promise` that will produce a `ComputeTaskResponse`.
   */
  public cancelComputeTask(id: string) {
    return this.post<ComputeTaskResponse>('/v1/CancelVideoTask', { id: id });
  }

  /**
   * Fetches the results of a compute task. Note this may timeout if the task
   * hasn't successfully completed yet. See {SenseyeApiClient.getComputeTask}.
   *
   * @param  id Task ID. Can be obtained from `ComputeTaskResponse.id`.
   * @returns   A `Promise` that will produce a `ComputeResultResponse`.
   */
  public getComputeResult(id: string) {
    return this.get<ComputeResultResponse>('/v1/GetVideoResult/' + id);
  }
}
