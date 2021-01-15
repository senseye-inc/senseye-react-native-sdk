import * as React from 'react';
import { Alert, View } from 'react-native';

import {
  Experiments,
  VideoRecorder,
  Models,
} from '@senseyeinc/react-native-senseye-sdk';
import type { SenseyeApiClient } from '@senseyeinc/react-native-senseye-sdk';

type ExperimentRunnerProps = {
  experiments: any[]; // TODO: add type
  userId: string;
  demographicSurvey: Models.Survey;
  apiClient?: SenseyeApiClient;
};

/**
 * Component that initializes a session and executes a given series of experiments.
 * Synchronizes experiment events with video recording.
 */
export default function ExperimentRunner(props: ExperimentRunnerProps) {
  // TODO: this is dummy data
  const experiments = React.useMemo(
    () => [
      <Experiments.Calibration />,
      <Experiments.Nystagmus />,
      <Experiments.Plr />,
    ],
    []
  );

  const [cameraRef, setCameraRef] = React.useState<any>();
  const [isPreview, setIsPreview] = React.useState<boolean>(true);
  const [experimentIndex, setExperimentIndex] = React.useState<number>(0);
  const [experiment, setExperiment] = React.useState<JSX.Element>(
    experiments[experimentIndex]
  );

  // TODO: initialize session and integrate into callbacks
  let session = null;
  if (props.apiClient) {
    if (!props.demographicSurvey.getId()) {
      // initialize survey if not already done so
      props.demographicSurvey.init(props.apiClient).then(() => {
        session = new Models.Session();
        if (props.apiClient)
          session.init(
            props.apiClient,
            props.userId,
            props.demographicSurvey.getId()
          );
      });
    }
  }

  const onDoubleTap = React.useCallback(() => {
    if (cameraRef !== undefined && isPreview) {
      experiments[experimentIndex].props.onEnd(cameraRef.stopRecording());
      setExperiment(experiments[experimentIndex]);
      setIsPreview(false);
      cameraRef.startRecording();
    }
  }, [cameraRef, isPreview, experiments, experimentIndex]);

  const onRecordingEnd = React.useCallback(() => {
    setExperimentIndex(experimentIndex + 1);
    setIsPreview(true);
  }, [experimentIndex]);

  React.useEffect(() => {
    if (isPreview) {
      Alert.alert('Instructions', experiment.props.instructions);
    }
  }, [isPreview, experiment]);

  return (
    <View>
      <VideoRecorder
        ref={(ref) => {
          setCameraRef(ref);
        }}
        showPreview={isPreview}
        onDoubleTap={onDoubleTap}
        onRecordingEnd={onRecordingEnd}
      />
      {isPreview ? null : experiment}
    </View>
  );
}
