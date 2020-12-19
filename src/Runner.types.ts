import type { ComponentType } from 'react';
import type { TestExperimentProps } from './experiments';

type ExperimentProps = TestExperimentProps;

export type ExperimentRunnerProps = {
  experiments: ComponentType<ExperimentProps>[];
  userId?: string;
};
