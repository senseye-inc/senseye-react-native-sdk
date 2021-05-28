import type { Datum, SurveyType } from '@senseyeinc/react-native-senseye-sdk';

/**
 * Model representing a survey entity. Facilitates the gathering of a participant's responses
 * to survey questions.
 */
export default class Survey {
  private metadata: { [key: string]: any };

  /**
   * @param type    Survey type, e.g. `demographic`, `validation`.
   * @param entries Map of keys to a tuple containing a corresponding question and response.
   *                  e.g. { 'eye_color': ['What color are your eyes?', 'Brown'] }
   * @param info    Any extra information or metadata.
   */
  constructor(
    type: SurveyType,
    entries: { [key: string]: [Datum, Datum] } = {},
    info: { [key: string]: any } = {}
  ) {
    // extract questions and responses into separate dictionaries
    const questions: { [key: string]: Datum } = {};
    const responses: { [key: string]: Datum } = {};
    for (let [key, value] of Object.entries(entries)) {
      questions[key] = value[0];
      responses[key] = value[1];
    }

    this.metadata = {
      type: type,
      questions: questions,
      responses: responses,
      info: info,
    };
  }

  /**
   * Adds an entry for a question and its corresponding response. If `key` already
   * exists, the previous entry values will be overwritten.
   *
   * @param key       Key used to associate `question` and `response`.
   * @param question  Question or prompt value.
   * @param response  Response value to `question`.
   */
  public addEntry(key: string, question: Datum, response: Datum) {
    this.metadata.questions[key] = question;
    this.metadata.responses[key] = response;
  }

  /**
   * Updates {@link metadata}.
   *
   * @param info  Metadata to be merged on top of the existing {@link metadata}
   */
  public updateInfo(info: { [key: string]: any }) {
    this.metadata.info = { ...this.metadata.info, ...info };
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
