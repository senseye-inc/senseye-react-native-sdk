import * as React from 'react';
import { Alert, View } from 'react-native';

import { SenseyeApiClient, Models } from '@api';
import { Experiments, VideoRecorder } from '@components';

/**
 * Component that initializes a session and executes a given series of experiments.
 * Synchronizes experiment events with video recording.
 */
type ExperimentRunnerProps = {
  experiments: any[]; // TODO: add type
  userId: string;
  demographicSurvey: Models.Survey;
  apiClient?: SenseyeApiClient;
};

export default function ExperimentRunner(props: ExperimentRunnerProps) {
  // TODO: this is dummy data
  props.experiments = [
    <Experiments.Calibration />,
    <Experiments.Nystagmus />,
    <Experiments.Plr />,
  ];

  const [cameraRef, setCameraRef] = React.useState<any>();
  const [isPreview, setIsPreview] = React.useState<boolean>(true);
  const [experimentIndex, setExperimentIndex] = React.useState<number>(0);
  const [experiment, setExperiment] = React.useState<JSX.Element>(
    props.experiments[experimentIndex]
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

  function onDoubleTap() {
    if (cameraRef !== undefined && isPreview) {
      setExperiment(props.experiments[experimentIndex]);
      experiment.props.onEnd(cameraRef.stopRecording());
      setIsPreview(false);
      cameraRef.startRecording();
    }
  }

  function onRecordingEnd() {
    setExperimentIndex(experimentIndex + 1);
    setIsPreview(true);
  }

  React.useEffect(() => {
    if (isPreview) {
      Alert.alert(experiment.props.instructions + '\n[double tap to begin]');
    }
  }, [isPreview, experiment.props]);

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
