export type Datum = boolean | number | string;

export type Data = Datum | Array<Data> | { [key: string]: Data };

export type ExperimentData = {
  timestamp: number;
  data: { [key: string]: Data };
};
export type SessionData = { [key: string]: Array<ExperimentData> };

export type SessionCondition =
  | 'GOOD'
  | 'BAD'
  | 'TEST'
  | 'UNENDED'
  | 'UNSPECIFIED';

export type SurveyType = 'demographic' | 'validation';
