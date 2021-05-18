import * as React from 'react';
import { Alert, Modal, Text, View, ViewStyle, TextStyle } from 'react-native';
// import CameraRoll from '@react-native-community/cameraroll';
import {
  Constants,
  TaskRunner,
  Tasks,
  SenseyeApiClient,
  SenseyeButton,
} from '@senseyeinc/react-native-senseye-sdk';
import type { PredictionResult } from '@senseyeinc/react-native-senseye-sdk';

import ProcessingScreen from './ProcessingScreen';
import ResultsScreen from './ResultsScreen';
import TaskInstructions from './TaskInstructions';
import { Spacing, Typography } from '../styles';

export default function FullDemoScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);
  const [isModalReady, setIsModalReady] = React.useState<boolean>(false);
  const [isShowTaskDialog, setIsShowTaskDialog] = React.useState<boolean>(false);
  const [isTasksComplete, setIsTasksComplete] = React.useState<boolean>(false);
  const [isProcessingComplete, setIsProcessingComplete] = React.useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = React.useState<string>('uploading');
  const [uploadPercentage, setUploadPercentage] = React.useState<number>(0);
  const [result, setResult] = React.useState<PredictionResult>();
  const [taskDialogTitle, setTaskDialogTitle] = React.useState<string>('');
  const [taskDialogMessage, setTaskDialogMessage] = React.useState<string>('');

  const apiClient = React.useMemo(
    () =>
      new SenseyeApiClient(
        Constants.API_HOST,
        Constants.API_BASE_PATH,
        'senseye-demo-api-key'
      ),
    []
  );

  const resetState = () => {
    // set state variables to initial values
    setIsShowModal(false);
    setIsModalReady(false);
    setIsTasksComplete(false);
    setIsProcessingComplete(false);
    setUploadPercentage(0);
    setProcessingMessage('uploading');
  };

  const onEnd = React.useCallback(
    async (session, _) => {
      // show ProcessingScreen
      setIsTasksComplete(true);
      // poll upload progress
      const uploadPollId = setInterval(() => {
        let progress = session.getUploadProgress();
        console.log('progress: ' + progress);
        setUploadPercentage(Math.round(progress * 100));
      }, 3000);

      const values = await session.uploadVideos();
      // upload complete
      clearInterval(uploadPollId);

      let video_urls: string[] = [];
      values.forEach((v: any) => {
        video_urls.push(v.s3_url);
      });
      console.log('uploads: ' + video_urls);

      // update ProcessingScreen state from uploading to processing
      setUploadPercentage(-1);
      setProcessingMessage('senseye orm check results are processing');
      // submit compute job
      const jobId = (await apiClient.startPrediction(video_urls)).id;
      // poll job status
      const resultPollId = setInterval(() => {
        apiClient
          .getPrediction(jobId)
          .then((job) => {
            if (
              job.status === Constants.JobStatus.COMPLETED ||
              job.status === Constants.JobStatus.FAILED
            ) {
              // processing complete
              clearInterval(resultPollId);

              if (job.result !== undefined) {
                console.log('result: ' + JSON.stringify(job.result));
                // show ResultsScreen
                setResult(job.result);
                setIsProcessingComplete(true);
              } else {
                console.log('server error!');
                Alert.alert('Oh no...', ':(', [
                  {
                    text: 'OK',
                    onPress: resetState,
                  },
                ]);
              }
            } else {
              console.log(job.status);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }, 3000);
    },
    [apiClient]
  );

  const onTaskPreview = React.useCallback((index, name, instructions) => {
    setTaskDialogTitle('Task ' + (index + 1) + ': ' + name.toUpperCase());
    setTaskDialogMessage(instructions);
    setIsShowTaskDialog(true);
  }, []);

  return (
    <View style={Spacing.container as ViewStyle}>
      <Text style={Typography.text as TextStyle}>
        A demonstration utilizing the various components provided in this SDK to replicate
        Senseye's data collection and processing workflow.
        {'\n\n'}
        This demo will execute Calibration and PLR tasks. A video will be recorded for
        each task and uploaded to Senseye servers for processing. At the end, a result
        screen will display with an inference of the results.
        {'\n\n'}
        Note: Camera access and an internet connection are required for this demo.
      </Text>
      <SenseyeButton
        title="Run full demo"
        type="primaryCta"
        onPress={() => setIsShowModal(true)}
      />
      <Modal
        visible={isShowModal}
        onShow={() => setIsModalReady(true)}
        onRequestClose={resetState}
      >
        {isModalReady ? (
          !isTasksComplete ? (
            <View style={Spacing.centeredFlexView as ViewStyle}>
              <TaskRunner
                sessionConfig={{ apiClient: apiClient }}
                onEnd={onEnd}
                onTaskPreview={onTaskPreview}
              >
                <Tasks.Calibration
                  dot_points={Constants.CalibrationPatterns[1]}
                  radius={30}
                />
                <Tasks.Plr fixation_width={14} fixation_outline_size={4} />
              </TaskRunner>
              <TaskInstructions
                title={taskDialogTitle}
                instructions={taskDialogMessage}
                visible={isShowTaskDialog}
                onButtonPress={() => setIsShowTaskDialog(false)}
              />
            </View>
          ) : !isProcessingComplete ? (
            <ProcessingScreen
              message={processingMessage}
              uploadPercentage={uploadPercentage}
            />
          ) : (
            <ResultsScreen result={result} />
          )
        ) : null}
      </Modal>
    </View>
  );
}
