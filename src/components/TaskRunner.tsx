import * as React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { VideoRecorder, Models } from '@senseyeinc/react-native-senseye-sdk';
import type {
  // TaskData,
  SenseyeApiClient,
  VideoRecorderObject,
} from '@senseyeinc/react-native-senseye-sdk';

export type TaskRunnerProps = {
  /**
   * Specifying this will prompt the runner to initialize a {@link Session} and
   * associate it with {@link Video | Videos} created within the execution of the runner.
   */
  sessionConfig?: {
    /** Client configured to communicate with Senseye's API. */
    apiClient: SenseyeApiClient;
    /**
     * Custom username or ID of the participant. Must be unique to the participant
     * within the context of the API key passed into the client.
     */
    uniqueId?: string;
    /** Demographic survey of the particpant. */
    demographicSurvey?: Models.Survey;
  };
  /**
   * Function to be called immediately at camera preview, before every task.
   * Its params will contain values associated with the upcoming task.
   */
  onTaskPreview?(index: number, name: string, instructions: string): void;
  /**
   * Function to be called once all tasks are complete. If `sessionConfig` was provided,
   * `session` will be an initialized {@link Session} associated with a list of
   * initialized {@link Video | Videos}. Otherwise, `session` will be undefined
   * and `videos` will be a list of uninitialized {@link Video | Videos}.
   */
  onEnd?(session: Models.Session | undefined, videos: Models.Video[]): void;
  /**
   * Function to be called if the session fails to initialize, usually when there
   * is a problem contacting the API server.
   */
  onInitializationError?(): void;
};

/**
 * Component that executes a series of {@link Tasks} passed in as children elements (`props.children`).
 * Orchestrates video recording and data collection throughout the tasks (one video per task).
 */
const TaskRunner: React.FunctionComponent<TaskRunnerProps> = (props) => {
  const { sessionConfig, onEnd, onInitializationError, onTaskPreview } = props;
  const [recorder, setRecorder] = React.useState<VideoRecorderObject>();
  const [taskIndex, setTaskIndex] = React.useState<number>(0);
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
        .startRecording(taskIndex + '_' + children[taskIndex].props.name)
        .then((video) => {
          videos.push(video);
          if (session) {
            session.addVideo(video);
          }
        })
        .finally(() => {
          setIsRecording(false);
        });
    }
  }, [recorder, session, videos, children, taskIndex]);

  // const onTaskUpdate = React.useCallback(
  //   (data: TaskData) => {
  //     if (session) {
  //       session.addTaskData(
  //         taskIndex + '_' + children[taskIndex].props.name,
  //         data
  //       );
  //     }
  //   },
  //   [session, children, taskIndex]
  // );

  const onTaskEnd = React.useCallback(() => {
    if (recorder) {
      recorder.stopRecording();
    }
    // if (session) {
    //   session.flushData();
    // }
  }, [recorder]);

  const _onEnd = React.useCallback(() => {
    // if (session) {
    //   session.stop();
    // }
    if (onEnd) {
      onEnd(session, videos);
    }
  }, [session, videos, onEnd]);

  const _onInitializationError = React.useCallback(() => {
    // initialization failed, but unblock the runner to execute tasks w/o data collection
    setIsInitialized(true);

    if (onInitializationError) {
      onInitializationError();
    }
  }, [onInitializationError]);

  const _onTaskPreview = React.useCallback(
    (index, name, instructions) => {
      if (onTaskPreview) {
        onTaskPreview(index, name, instructions);
      }
    },
    [onTaskPreview]
  );

  // initialize a session if specified
  React.useEffect(() => {
    const initializeSession = (
      apiClient: SenseyeApiClient,
      uniqueId?: string,
      surveyId?: string
    ) => {
      const s = new Models.Session();
      s.init(apiClient, uniqueId, surveyId)
        .then(() => {
          setSession(s);
          setIsInitialized(true);
          // s.start();
        })
        .catch(_onInitializationError);
    };

    if (!session && sessionConfig) {
      // const { apiClient, uniqueId, demographicSurvey } = sessionConfig;
      // const surveyId = demographicSurvey.getId();
      // if (!surveyId) {
      //   // initialize survey if not done so already
      //   demographicSurvey
      //     .init(apiClient)
      //     .then((survey) => {
      //       initializeSession(apiClient, uniqueId, survey._id);
      //     })
      //     .catch(_onInitializationError);
      // } else {
      //   initializeSession(apiClient, uniqueId, surveyId);
      // }
      initializeSession(sessionConfig.apiClient, sessionConfig.uniqueId);
    }
  }, [session, sessionConfig, _onInitializationError]);

  // execute onTaskPreview at the preview screen before each task
  React.useEffect(() => {
    if (isPreview && taskIndex < children.length) {
      const taskProps = children[taskIndex].props;
      _onTaskPreview(taskIndex, taskProps.name, taskProps.instructions);
    }
  }, [isPreview, children, taskIndex, isInitialized, _onTaskPreview]);

  // execute onEnd callback once all tasks are complete
  React.useEffect(() => {
    if (taskIndex >= children.length && !isRecording) {
      _onEnd();
    }
  }, [taskIndex, children.length, isRecording, _onEnd]);

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
          setTaskIndex((prevIndex) => prevIndex + 1);
          setIsPreview(true);
        }}
      />
      {isPreview
        ? null
        : React.cloneElement(children[taskIndex], {
            // onUpdate: onTaskUpdate,
            onEnd: onTaskEnd,
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

export default TaskRunner;
