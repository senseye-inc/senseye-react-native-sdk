import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Constants } from '@senseyeinc/react-native-senseye-sdk';
import type {
  ComputeResultResponse,
  ComputeTaskResponse,
} from '@senseyeinc/react-native-senseye-sdk';

/**
 * Client that interfaces with Senseye's REST API. Provides wrapper functions for
 * standard GET, DELETE, POST and PUT requests, as well as specific Senseye endpoints.
 */
export default class SenseyeApiClient {
  private axios: AxiosInstance;

  /**
   * @param host  Domain name or IP address of the API host. e.g. api.senseye.co[:80]
   * @param basePath  URL path prefix that'll be appended to `host`.
   * @param token  Authentication token or API key.
   */
  constructor(
    host: string = Constants.API_HOST,
    basePath: string = Constants.API_BASE_PATH,
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
   * Initiates a compute task to predict fatigue probability of the participant in a given video.
   *
   * @param  uri URI to a video containing a participant.
   * @returns    A `Promise` that will produce a {@link ComputeTaskResponse}.
   */
  public predictFatigue(uri: string) {
    return this.post<ComputeTaskResponse>('/PredictFatigue', {
      video_uri: uri,
    });
  }

  /**
   * Initiates a compute task to predict intoxication probability of the participant in a given video.
   *
   * @param  uri URI to a video containing a participant.
   * @returns    A `Promise` that will produce a {@link ComputeTaskResponse}.
   */
  public predictBAC(uri: string) {
    return this.post<ComputeTaskResponse>('/PredictBAC', {
      video_uri: uri,
    });
  }

  /**
   * Initiates a compute task to predict cognitive load probability of the participant in a given video.
   *
   * @param  uri URI to a video containing a participant.
   * @returns    A `Promise` that will produce a {@link ComputeTaskResponse}.
   */
  public predictCognitiveLoad(uri: string) {
    return this.post<ComputeTaskResponse>('/PredictCognitiveLoad', {
      video_uri: uri,
    });
  }

  /**
   * Fetches the latest status of a compute task. Use this to poll for `SUCCESS`
   * before calling {@link getComputeResult | getComputeResult()}.
   *
   * @param  id Task ID. Can be obtained from a {@link ComputeTaskResponse}.
   * @returns   A `Promise` that will produce a {@link ComputeTaskResponse}, containing
   *              the task's most recent status.
   */
  public getComputeTask(id: string) {
    return this.get<ComputeTaskResponse>('/GetVideoTask/' + id);
  }

  /**
   * Stops a running compute task.
   *
   * @param  id Task ID. Can be obtained from a {@link ComputeTaskResponse}.
   * @returns   A `Promise` that will produce a {@link ComputeTaskResponse}.
   */
  public cancelComputeTask(id: string) {
    return this.post<ComputeTaskResponse>('/CancelVideoTask', { id: id });
  }

  /**
   * Fetches the results of a compute task. Note this may timeout if the task
   * hasn't successfully completed yet. See {@link getComputeTask | getComputeTask()}.
   *
   * @param  id Task ID. Can be obtained from a {@link ComputeTaskResponse}.
   * @returns   A `Promise` that will produce a {@link ComputeResultResponse}.
   */
  public getComputeResult(id: string) {
    return this.get<ComputeResultResponse>('/GetVideoResult/' + id);
  }
}
