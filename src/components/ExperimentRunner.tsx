import * as React from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';

import { VideoRecorder, Models } from '@senseyeinc/react-native-senseye-sdk';
import type {
  ExperimentData,
  SenseyeApiClient,
  VideoRecorderObject,
} from '@senseyeinc/react-native-senseye-sdk';

export type ExperimentRunnerProps = {
  /**
   * Specifying this will prompt the runner to initialize a {@link Session} and
   * perform data collection using Senseye's API (requires an internet connection).
   */
  sessionConfig?: {
    /** Client configured to communicate with Senseye's API. */
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
   * Function to be called once all experiments are complete. If a session was initialized,
   * `session` will be an initialized {@link Session} and `videos` a list of initialized
   * {@link Video | Videos} that are ready to upload. Otherwise, `session` will be undefined
   * and `videos` a list of uninitialized {@link Video | Videos}.
   */
  onEnd?(session: Models.Session | undefined, videos: Models.Video[]): void;
  /**
   * Function to be called if the session fails to initialize, usually when there
   * is a problem contacting the API server.
   */
  onInitializationError?(): void;
};

/**
 * Component that executes a series of {@link Experiments} passed in as children elements (`props.children`).
 * Orchestrates video recording and data collection throughout the experiments (one video per experiment).
 */
const ExperimentRunner: React.FunctionComponent<ExperimentRunnerProps> = (
  props
) => {
  const { sessionConfig, onEnd, onInitializationError } = props;
  const [recorder, setRecorder] = React.useState<VideoRecorderObject>();
  const [experimentIndex, setExperimentIndex] = React.useState<number>(0);
  const [isPreview, setIsPreview] = React.useState<boolean>(true);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
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
      setIsRecording(true);
      recorder
        .startRecording(
          experimentIndex + '_' + children[experimentIndex].props.name
        )
        .then((video) => {
          videos.push(video);
          if (session) {
            session.pushVideo(video);
          }
        })
        .finally(() => {
          setIsRecording(false);
        });
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

  const _onInitializationError = React.useCallback(() => {
    // initialization failed, but unblock the runner to execute experiments w/o data collection
    setIsInitialized(true);

    if (onInitializationError) {
      onInitializationError();
    }
  }, [onInitializationError]);

  // initialize a session if specified
  React.useEffect(() => {
    const initializeSession = (
      apiClient: SenseyeApiClient,
      uniqueId: string,
      surveyId: string
    ) => {
      const s = new Models.Session();
      s.init(apiClient, uniqueId, surveyId)
        .then(() => {
          setSession(s);
          setIsInitialized(true);
          s.start();
        })
        .catch(_onInitializationError);
    };

    if (!session && sessionConfig) {
      const { apiClient, uniqueId, demographicSurvey } = sessionConfig;
      const surveyId = demographicSurvey.getId();
      if (!surveyId) {
        // initialize survey if not done so already
        demographicSurvey
          .init(apiClient)
          .then((survey) => {
            initializeSession(apiClient, uniqueId, survey._id);
          })
          .catch(_onInitializationError);
      } else {
        initializeSession(apiClient, uniqueId, surveyId);
      }
    }
  }, [session, sessionConfig, _onInitializationError]);

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

  // execute onEnd callback once all experiments are complete
  React.useEffect(() => {
    if (experimentIndex >= children.length && !isRecording) {
      _onEnd();
    }
  }, [experimentIndex, children.length, isRecording, _onEnd]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={sessionConfig !== undefined && !isInitialized}
      >
        <View style={styles.modalContainer}>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
