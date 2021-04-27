import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Constants } from '@senseyeinc/react-native-senseye-sdk';
import type {
  ComputeJobInitResponse,
  ComputeJobResponse,
} from '@senseyeinc/react-native-senseye-sdk';

/**
 * Client that interfaces with Senseye's REST API. Provides wrapper functions for
 * standard GET, DELETE, POST and PUT requests, as well as specific Senseye endpoints.
 */
export default class SenseyeApiClient {
  private axios: AxiosInstance;

  /**
   * @param host      Domain name or IP address of the API host. e.g. api.senseye.co[:80]
   * @param basePath  URL path prefix that'll be appended to `host`.
   * @param apiKey    API key.
   */
  constructor(
    host: string = Constants.API_HOST,
    basePath: string = Constants.API_BASE_PATH,
    apiKey?: string
  ) {
    let baseUrl = 'https://' + host + basePath;
    let headers: { [key: string]: string } = {};

    if (apiKey) headers['x-api-key'] = apiKey;

    this.axios = axios.create({
      baseURL: baseUrl,
      headers: headers,
    });
  }

  public request<T = any>(config: AxiosRequestConfig) {
    return this.axios.request<T>(config);
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
   * Submits a job to perform predictive analysis on a specified list of videos.
   *
   * https://app.swaggerhub.com/apis-docs/senseye-inc/senseye-api/0.0.1#/default/post_predict
   *
   * @param videos    List of S3 urls (i.e. `[s3://<bucket>/<key>, ...]`) pointing to video recordings of a participant performing `Tasks`.
   * @param threshold Value between 0.0 and 1.0; determines `prediction.state` in the final result.
   * @param uniqueId  Username or ID of the participant.
   * @returns         A `Promise` that will produce a {@link ComputeJobInitResponse}.
   */
  public startPrediction(
    videos: string[],
    threshold: number = 0.5,
    uniqueId?: string
  ) {
    return this.post<ComputeJobInitResponse>('/predict', {
      video_urls: videos,
      threshold: threshold,
      unique_id: uniqueId,
    });
  }

  /**
   * Retrieves the status/result of a submitted predict job.
   *
   * https://app.swaggerhub.com/apis-docs/senseye-inc/senseye-api/0.0.1#/default/get_predict__id_
   *
   * @param id  Job ID produced after a successful call to {@link startPrediction | startPrediction()}.
   * @returns   A `Promise` that will produce a {@link ComputeJobResponse}.
   */
  public getPrediction(id: string) {
    return this.get<ComputeJobResponse>('/predict/' + id);
  }
}
