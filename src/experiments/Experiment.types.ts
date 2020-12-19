export type BaseExperimentProps = {
  onStart: Function;
  onEnd: Function;
  callback?: Function;
};

export type TestExperimentProps = BaseExperimentProps & {
  // custom props
};
