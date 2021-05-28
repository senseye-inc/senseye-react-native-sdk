import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { VideoRecorder, Models } from '@senseyeinc/react-native-senseye-sdk';
import type {
  EventData,
  VideoRecorderObject,
} from '@senseyeinc/react-native-senseye-sdk';

export type TaskRunnerProps = {
  /** Username or ID of the participant. */
  uniqueId?: string;
  /** Demographic survey completed beforehand by the particpant. */
  demographicSurvey?: Models.Survey;
  /**
   * Function to be called immediately at camera preview, before every task.
   * Its params will contain values associated with the upcoming task.
   */
  onTaskPreview?(index: number, name: string, instructions: string): void;
  /**
   * Function to be called once all tasks are complete. Its param will be a `Session`
   * containing {@link Video | Videos} and data recorded during the tasks.
   */
  onEnd?(session: Models.Session): void;
};

/**
 * Component that executes a series of {@link Tasks} passed in as children elements (`props.children`).
 * Orchestrates video recording and data collection during each task.
 */
const TaskRunner: React.FunctionComponent<TaskRunnerProps> = (props) => {
  const { uniqueId, demographicSurvey, onEnd, onTaskPreview } = props;
  const [recorder, setRecorder] = React.useState<VideoRecorderObject>();
  const [taskEntity, setTaskEntity] = React.useState<Models.Task>();
  const [taskIndex, setTaskIndex] = React.useState<number>(0);
  const [isPreview, setIsPreview] = React.useState<boolean>(true);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [session] = React.useState<Models.Session>(
    new Models.Session(uniqueId, demographicSurvey)
  );
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
      const taskName = children[taskIndex].props.name;
      const t = new Models.Task(taskName);
      setTaskEntity(t);
      session.addTask(t);
      recorder
        .startRecording(taskName.replace(/ /g, '_').toLowerCase())
        .then((videoEntity) => {
          session.addVideo(videoEntity);
        })
        .finally(() => {
          setIsRecording(false);
        });
    }
  }, [recorder, session, children, taskIndex]);

  const onTaskStart = React.useCallback(() => {
    if (taskEntity) {
      taskEntity.recordStartTime();
    }
  }, [taskEntity]);

  const onTaskUpdate = React.useCallback(
    (data: EventData) => {
      if (taskEntity) {
        taskEntity.addEventData(data);
      }
    },
    [taskEntity]
  );

  const onTaskEnd = React.useCallback(() => {
    if (taskEntity) {
      taskEntity.recordStopTime();
    }
    if (recorder) {
      recorder.stopRecording();
    }
  }, [recorder, taskEntity]);

  const _onEnd = React.useCallback(() => {
    if (onEnd) {
      onEnd(session);
    }
  }, [session, onEnd]);

  const _onTaskPreview = React.useCallback(
    (index, name, instructions) => {
      if (onTaskPreview) {
        onTaskPreview(index, name, instructions);
      }
    },
    [onTaskPreview]
  );

  // execute onTaskPreview at the preview screen before each task
  React.useEffect(() => {
    if (isPreview && taskIndex < children.length) {
      const taskProps = children[taskIndex].props;
      _onTaskPreview(taskIndex, taskProps.name, taskProps.instructions);
    }
  }, [isPreview, children, taskIndex, _onTaskPreview]);

  // execute onEnd callback once all tasks are complete
  React.useEffect(() => {
    if (taskIndex >= children.length && !isRecording) {
      _onEnd();
    }
  }, [taskIndex, children.length, isRecording, _onEnd]);

  return (
    <View style={styles.container}>
      <VideoRecorder
        ref={setRef}
        showPreview={isPreview}
        onDoubleTap={onDoubleTap}
        onRecordingStart={() => {
          setIsPreview(false);
          setIsRecording(true);
        }}
        onRecordingEnd={() => {
          setTaskIndex((prevIndex) => prevIndex + 1);
          setIsPreview(true);
        }}
      />
      {isPreview
        ? null
        : React.cloneElement(children[taskIndex], {
            onStart: onTaskStart,
            onUpdate: onTaskUpdate,
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
});

export default TaskRunner;
