import * as React from 'react';
import { Text } from 'react-native';

import type { TestExperimentProps } from './Experiment.types';

export function TestExperiment(props: TestExperimentProps) {
  if (props.onStart !== undefined) {
    props.onStart();
  }

  if (props.onEnd !== undefined) {
    setTimeout(() => {
      props.onEnd();
    }, 2000);
  }

  return <Text>Test Experiment.</Text>;
}

TestExperiment.defaultProps = {
  callback: undefined,
  onStart: undefined,
  onEnd: undefined,
};
