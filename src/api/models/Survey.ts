import type { SenseyeApiClient } from '@api';
import type { DataResponse, Datum, SurveyType } from '@types';

/** Valid survey types. */
export const Types: Record<string, SurveyType> = {
  DEMOGRAPHIC: 'demographic',
  VALIDATION: 'validation',
};

/**
 * Class that models a survey, facilitating the collection of a participant's responses
 * to survey questions.
 */
export default class Survey {
  private apiClient: SenseyeApiClient | undefined;
  private id: string | undefined;
  private metadata: { [key: string]: any };

  /**
   * @param  apiClient
   * @param  type       Survey type, e.g. `demographic`, `validation`.
   * @param  entryMap   Map of keys to a tuple containing the corresponding question and response.
   *                      e.g. { 'eye_color': ['What color are you eyes?', 'Brown'] }
   * @param  info       Any extra information or metadata.
   */
  constructor(
    type: SurveyType,
    entryMap: { [key: string]: [Datum, Datum] },
    info: { [key: string]: any } = {}
  ) {
    // extract questions and responses into format expected by Senseye's API
    const questions: { [key: string]: Datum } = {};
    const responses: { [key: string]: Datum } = {};
    for (let [key, value] of Object.entries(entryMap)) {
      questions[key] = value[0];
      responses[key] = value[1];
    }

    this.apiClient = undefined;
    this.id = undefined;
    this.metadata = {
      type: type,
      questions: questions,
      responses: responses,
      info: info,
    };
  }

  /**
   * Initializes a survey model through Senseye's API. Note this should only be
   * done once per instance. Ensure initialization is successful before executing
   * certain functions within this class, otherwise errors may be encountered.
   *
   * @param  apiClient  Client configured to communicate with Senseye's API.
   * @returns           A `Promise` that will produce the created survey's metadata.
   */
  public async init(apiClient: SenseyeApiClient) {
    if (this.id !== undefined) {
      Error('Survey is already initialized.');
    }
    this.apiClient = apiClient;

    const survey = (
      await this.apiClient.post<DataResponse>('/data/surveys', this.metadata)
    ).data.data;

    if (!survey) {
      // this condition shouldn't be reached unless the API Client was configured incorrectly,
      // i.e. the expected response from Senseye was not received.
      throw Error('Failed to create Survey. Unexpected response data.');
    }
    this.id = survey._id;

    return survey;
  }

  /**
   * Adds an entry for a question and its corresponding response. If `key` already
   * exists, the previous entry values will be overwritten.
   *
   * @param  key      Key used to associate `question` and `response`.
   * @param  question Question or prompt value.
   * @param  response Response value to `question`.
   */
  public addEntry(key: string, question: Datum, response: Datum) {
    this.metadata.questions[key] = question;
    this.metadata.responses[key] = response;
  }

  /**
   * Updates the survey's `info` metadata.
   *
   * @param  info Metadata to be merged on top of any previous `info` metadata.
   */
  public updateInfo(info: { [key: string]: any }) {
    this.metadata.info = { ...this.metadata.info, ...info };
  }

  /**
   * Pushes the survey's most recent metadata values to Senseye's API.
   *
   * @returns A `Promise` that will produce an `AxiosResponse`.
   */
  public pushUpdates() {
    if (!this.apiClient || !this.id) {
      throw Error('Survey must be initialized first.');
    }

    return this.apiClient.put<DataResponse>(
      '/data/surveys/' + this.id,
      this.metadata
    );
  }

  /**
   * @returns The survey's ID, or `undefined` if the instance hasn't been successfully
   *            initialized yet ({@link Survey.init}).
   */
  public getId() {
    return this.id;
  }

  /**
   * @returns The survey's type.
   */
  public getType() {
    return this.metadata.type;
  }

  /**
   * @returns A tuple containing question and response entries, respectively.
   */
  public getEntries() {
    return [this.metadata.questions, this.metadata.responses];
  }
}
