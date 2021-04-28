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
import { Spacing, Typography } from '../styles';

export default function FullDemoScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);
  const [isModalReady, setIsModalReady] = React.useState<boolean>(false);
  const [isTasksComplete, setIsTasksComplete] = React.useState<boolean>(false);
  const [
    isProcessingComplete,
    setIsProcessingComplete,
  ] = React.useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = React.useState<string>(
    'uploading'
  );
  const [uploadPercentage, setUploadPercentage] = React.useState<number>(0);
  const [result, setResult] = React.useState<PredictionResult>();

  const apiClient = React.useMemo(
    () =>
      new SenseyeApiClient(
        Constants.API_HOST,
        Constants.API_BASE_PATH,
        'senseye-demo-api-key'
      ),
    []
  );

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
      const jobId = (await apiClient.startPrediction(video_urls)).data.id;
      // poll job progress
      const resultPollId = setInterval(() => {
        apiClient
          .getPrediction(jobId)
          .then((resp) => {
            const data = resp.data;
            if (
              data.status === Constants.JobStatus.COMPLETED ||
              data.status === Constants.JobStatus.FAILED
            ) {
              clearInterval(resultPollId);

              if (data.result !== undefined) {
                console.log('result: ' + JSON.stringify(data.result));
                setResult(data.result);
                setIsProcessingComplete(true);
              } else {
                console.log('server error!');
                Alert.alert('Oh no...', ':()', [
                  {
                    text: 'OK',
                    onPress: () => {
                      setIsShowModal(false);
                      setIsModalReady(false);
                    },
                  },
                ]);
              }
            } else {
              console.log(data.status);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }, 3000);
    },
    [apiClient]
  );

  return (
    <View style={Spacing.container as ViewStyle}>
      <Text style={Typography.text as TextStyle}>
        A demonstration utilizing the various components provided in this SDK to
        replicate Senseye's data collection and processing workflow.
        {'\n\n'}
        This demo will execute Calibration, Nystagmus, and Plr tasks. A video
        will be recorded for each task and uploaded to Senseye servers for
        processing. At the end, a result screen will display with an inference
        of the results.
        {'\n\n'}
        Note: Camera access and an internet connection are required for this
        demo.
      </Text>
      <SenseyeButton
        title="Run full demo"
        type="primaryCta"
        onPress={() => setIsShowModal(true)}
      />
      <Modal
        visible={isShowModal}
        onShow={() => setIsModalReady(true)}
        onRequestClose={() => {
          // reset state values
          setIsShowModal(false);
          setIsModalReady(false);
          setIsTasksComplete(false);
          setIsProcessingComplete(false);
          setUploadPercentage(0);
          setProcessingMessage('uploading');
        }}
      >
        {isModalReady ? (
          !isTasksComplete ? (
            <TaskRunner onEnd={onEnd} sessionConfig={{ apiClient: apiClient }}>
              <Tasks.Calibration
                dot_points={Constants.CalibrationPatterns[1]}
                radius={30}
              />
              <Tasks.Nystagmus />
              <Tasks.Plr />
            </TaskRunner>
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
