import * as React from 'react';
import { View, Button } from 'react-native';

import * as experiments from './experiments';
import VideoRecorder from './VideoRecorder';
import type { ExperimentRunnerProps } from './types';

export const Experiments = {
  Calibration: experiments.Calibration,
  Nystagmus: experiments.Nystagmus,
  Plr: experiments.Plr,
};

/**
 * General experiment runner.
 * Holds an experiment component as well as a camera component.
 * Synchronizes experiment start with camera recording.
 */
export default function ExperimentRunner(props: ExperimentRunnerProps) {
  const [running, setRunning] = React.useState(false);
  let Experiment = Experiments.Calibration;

  if (props.userId) {
    // TODO
  }

  const onExperimentStart = () => {
    // TODO
  };

  const onExperimentEnd = () => {
    // TODO
    setRunning(false);
  };

  if (running) {
    return (
      <View>
        <Experiment onStart={onExperimentStart} onEnd={onExperimentEnd} />
        <VideoRecorder />
      </View>
    );
  } else {
    return (
      <View>
        <Button title="Start Experiment." onPress={() => setRunning(true)} />
      </View>
    );
  }
}
