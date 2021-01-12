import type { Datum, SurveyType } from './types';

/** Valid survey types. */
export const Type: Record<string, SurveyType> = {
  DEMOGRAPHIC: 'demographic',
  VALIDATION: 'validation',
};

/**
 * Class that models a survey, facilitating the collection of a participant's responses
 * to survey questions.
 */
export default class Survey {
  private type: SurveyType;
  private questions: { [key: string]: Datum };
  private responses: { [key: string]: Datum };

  /**
   * @param  type Survey type, e.g. `demographic`, `validation`
   */
  constructor(type: SurveyType) {
    this.type = type;
    this.questions = {};
    this.responses = {};
  }

  /**
   * Adds a response, pairing it with a corresponding question.
   *
   * @param  key      Key used to associate `question` and `response`.
   * @param  question Question or response prompt.
   * @param  response Response value to `question`.
   */
  public addEntry(key: string, question: string, response: Datum) {
    this.questions[key] = question;
    this.responses[key] = response;
  }

  /**
   * @returns A tuple containing, `Survey.questions` and `Survey.responses`, respectively.
   */
  public getEntries() {
    return [this.questions, this.responses];
  }

  /**
   * @returns `Survey.type`
   */
  public getType() {
    return this.type;
  }
}
