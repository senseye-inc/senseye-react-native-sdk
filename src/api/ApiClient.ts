import axios from 'axios';
import { Platform } from 'react-native';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Constants, getMimeFromExtension } from '@senseyeinc/react-native-senseye-sdk';
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
  public async startPrediction(
    video_urls: string[],
    threshold: number = 0.5,
    uniqueId?: string
  ) {
    const response = await this.post<ComputeJobInitResponse>('/predict', {
      video_urls: video_urls,
      threshold: threshold,
      unique_id: uniqueId,
    });

    return response.data;
  }

  /**
   * Retrieves the status/result of a submitted predict job.
   *
   * https://app.swaggerhub.com/apis-docs/senseye-inc/senseye-api/0.0.1#/default/get_predict__id_
   *
   * @param id  Job ID produced after a successful call to {@link startPrediction | startPrediction()}.
   * @returns   A `Promise` that will produce a {@link ComputeJobResponse}.
   */
  public async getPrediction(id: string) {
    const response = await this.get<ComputeJobResponse>('/predict/' + id);

    return response.data;
  }

  /**
   * Uploads a file to Senseye's S3.
   *
   * @param uri               File URI. (Android) Needs to be prefixed with `file://`.
   * @param key               Desired S3 key for the file.
   * @param onUploadProgress  Callback function that will be called on updates to the upload progress.
   * @returns                 A `Promise` that will resolve into a dictionary containing the destination S3 url (`s3_url`).
   */
  public async uploadFile(
    uri: string,
    key: string,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ) {
    // send request for a presigned url to upload a file to Senseye
    const data = (await this.axios.post('/data/generate-upload-url', { key: key })).data;

    // use the response values to construct the required request body
    const formData = new FormData();
    Object.keys(data.fields).forEach((fieldName) => {
      formData.append(fieldName, data.fields[fieldName]);
    });
    formData.append('file', {
      name: uri.substring(uri.lastIndexOf('/') + 1, uri.length),
      type: getMimeFromExtension(uri.substring(uri.lastIndexOf('.') + 1, uri.length)),
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
    });

    const requestConfig: AxiosRequestConfig = {
      url: data.url,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onUploadProgress,
    };

    await axios.request(requestConfig);

    // extract bucket name from url, which can be in either format:
    //  - https://s3.amazonaws.com/mybucket
    //  - https://mybucket.s3.amazonaws.com/
    const urlSplit = data.url.split('/');
    let bucket = urlSplit.pop();
    if (!bucket) {
      bucket = urlSplit[2].split('.')[0];
    }

    return { s3_url: 's3://' + bucket + '/' + data.fields.key };
  }
}
