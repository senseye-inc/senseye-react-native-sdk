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

import { Spacing, Typography } from '../styles';

export default function FullDemoScreen() {
  const [isShowModal, setIsShowModal] = React.useState<boolean>(false);
  const [isModalReady, setIsModalReady] = React.useState<boolean>(false);
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
      const uploadPollId = setInterval(() => {
        let progress = session.getUploadProgress();
        console.log('progress: ' + progress);
      }, 3000);

      const values = await session.uploadVideos();

      clearInterval(uploadPollId);

      let video_urls: string[] = [];
      values.forEach((v: any) => {
        video_urls.push(v.s3_url);
      });
      console.log('uploads: ' + video_urls);

      const jobId = (await apiClient.startPrediction(video_urls)).data.id;

      const resultPollId = setInterval(() => {
        apiClient.getPrediction(jobId).then((resp) => {
          const data = resp.data;
          if (
            data.status === Constants.JobStatus.COMPLETED ||
            data.status === Constants.JobStatus.FAILED
          ) {
            clearInterval(resultPollId);

            if (data.result !== undefined) {
              console.log('result: ' + JSON.stringify(data.result));
            } else {
              console.log('api error!');
            }

            Alert.alert('Complete!', 'woohoo', [
              {
                text: 'OK',
                onPress: () => {
                  setIsShowModal(false);
                  setIsModalReady(false);
                },
              },
            ]);
          } else {
            console.log(data.status);
          }
        });
      }, 3000);
    },
    [apiClient]
  );

  return (
    <View style={Spacing.container as ViewStyle}>
      <Text style={Typography.text as TextStyle}>
        A demonstration of the TaskRunner component, which is cabable of
        executing a series of tasks while orchestrating video recording and data
        collection during its session.
        {'\n\n'}
        This demo will execute Calibration, Nystagmus, and Plr tasks. A video
        will be recorded for each task and saved to the the device's photo
        library.
        {'\n\n'}
        Note: Camera and File/Media access is required for this demo.
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
          setIsShowModal(false);
          setIsModalReady(false);
        }}
      >
        {isModalReady ? (
          <TaskRunner onEnd={onEnd} sessionConfig={{ apiClient: apiClient }}>
            <Tasks.Calibration />
            <Tasks.Nystagmus />
          </TaskRunner>
        ) : null}
      </Modal>
    </View>
  );
}
