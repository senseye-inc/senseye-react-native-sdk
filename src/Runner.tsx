import * as React from 'react';
import { View, Button } from 'react-native';

import { VideoRecorder } from './Recorder';
import type { ExperimentRunnerProps } from './Runner.types';

/**
 * General experiment runner
 * Holds an experiment component as well as a camera component
 * Synchronizes experiment start with camera recording
 */
export function ExperimentRunner(props: ExperimentRunnerProps) {
  const [running, setRunning] = React.useState(false);
  let Experiment = props.experiments[0];

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
