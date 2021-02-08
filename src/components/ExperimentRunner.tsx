import * as React from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';

import { VideoRecorder, Models } from '@senseyeinc/react-native-senseye-sdk';
import type {
  ExperimentData,
  SenseyeApiClient,
  VideoRecorderObject,
} from '@senseyeinc/react-native-senseye-sdk';

type ExperimentRunnerProps = {
  /**
   * Specifying this will prompt the runner to initialize a {@link Session} and
   * execute data collection using Senseye's API. Requires an internet connection.
   */
  sessionConfig?: {
    /* Client configured to communicate with Senseye's API. */
    apiClient: SenseyeApiClient;
    /**
     * Custom username or ID of the participant. Must be unique to the participant
     * within the context of the API token/key passed into the client.
     */
    uniqueId: string;
    /** Demographic survey of the particpant. */
    demographicSurvey: Models.Survey;
  };
  /**
   * Function called once all experiments are completed. If `sessionConfig` was specified,
   * `session` will be an intialized {@link Session} and `videos` a list of initialized
   * {@link Video | Videos} ready to be uploaded ({@link Video.uploadFile}).
   * Otherwise, `session` will be undefined and `videos` a list of uninitialized {@link Video | Videos}.
   */
  onEnd?(session: Models.Session | undefined, videos: Models.Video[]): void;
};

/**
 * Component that executes a series of {@link Experiments} passed in as children elements (`props.children`).
 * Orchestrates video recording and data collection during the experiments (one video per experiment).
 */
const ExperimentRunner: React.FunctionComponent<ExperimentRunnerProps> = (
  props
) => {
  const { sessionConfig, onEnd } = props;
  const [recorder, setRecorder] = React.useState<VideoRecorderObject>();
  const [experimentIndex, setExperimentIndex] = React.useState<number>(0);
  const [isPreview, setIsPreview] = React.useState<boolean>(true);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const [session, setSession] = React.useState<Models.Session>();
  const [videos] = React.useState<Models.Video[]>([]);
  const [children] = React.useState<React.ReactElement[]>(() => {
    const elements: React.ReactElement[] = [];
    React.Children.forEach(props.children, (child) => {
      if (React.isValidElement(child)) {
        elements.push(child);
      }
    });
    return elements;
  });

  const setRef = React.useCallback((node) => {
    if (node) {
      setRecorder(node);
    }
  }, []);

  const onDoubleTap = React.useCallback(() => {
    if (recorder) {
      const v = recorder.startRecording(
        experimentIndex + '_' + children[experimentIndex].props.name
      );
      videos.push(v);
      if (session) {
        session.pushVideo(v);
      }
    }
  }, [recorder, session, videos, children, experimentIndex]);

  const onExperimentUpdate = React.useCallback(
    (data: ExperimentData) => {
      if (session) {
        session.addExperimentData(
          experimentIndex + '_' + children[experimentIndex].props.name,
          data
        );
      }
    },
    [session, children, experimentIndex]
  );

  const onExperimentEnd = React.useCallback(() => {
    if (recorder) {
      recorder.stopRecording();
    }
    if (session) {
      session.flushData();
    }
  }, [recorder, session]);

  const _onEnd = React.useCallback(() => {
    if (session) {
      session.stop();
    }
    if (onEnd) {
      onEnd(session, videos);
    }
  }, [session, videos, onEnd]);

  // initialize a session if specified
  React.useEffect(() => {
    const initializeSession = (
      apiClient: SenseyeApiClient,
      uniqueId: string,
      surveyId: string
    ) => {
      const s = new Models.Session();
      setSession(s);
      s.init(apiClient, uniqueId, surveyId).then(() => {
        setIsInitialized(true);
        s.start();
      });
    };

    if (!session && sessionConfig) {
      const { apiClient, uniqueId, demographicSurvey } = sessionConfig;
      const surveyId = demographicSurvey.getId();
      if (!surveyId) {
        // initialize survey if not done so already
        demographicSurvey.init(apiClient).then((survey) => {
          initializeSession(apiClient, uniqueId, survey._id);
        });
      } else {
        initializeSession(apiClient, uniqueId, surveyId);
      }
    }
  }, [session, sessionConfig]);

  // display instructions dialog at preview screen before each experiment
  React.useEffect(() => {
    if (
      isPreview &&
      experimentIndex < children.length &&
      (isInitialized || !sessionConfig)
    ) {
      Alert.alert('Instructions', children[experimentIndex].props.instructions);
    }
  }, [isPreview, children, experimentIndex, isInitialized, sessionConfig]);

  // execute onEnd callback once all experiments are completed
  React.useEffect(() => {
    if (experimentIndex >= children.length) {
      _onEnd();
    }
  }, [experimentIndex, children.length, _onEnd]);

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={sessionConfig !== undefined && !isInitialized}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Initializing session...</Text>
          </View>
        </View>
      </Modal>
      <VideoRecorder
        ref={setRef}
        showPreview={isPreview}
        onDoubleTap={onDoubleTap}
        onRecordingStart={() => {
          setIsPreview(false);
        }}
        onRecordingEnd={() => {
          setExperimentIndex((prevIndex) => prevIndex + 1);
          setIsPreview(true);
        }}
      />
      {isPreview
        ? null
        : React.cloneElement(children[experimentIndex], {
            onUpdate: onExperimentUpdate,
            onEnd: onExperimentEnd,
          })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ExperimentRunner;
