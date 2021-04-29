import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text } from 'react-native';
import {
  gearSpinner,
  ormCheckLogo,
  warningIcon,
} from '@senseyeinc/react-native-senseye-sdk';

import { Spacing, Sizing, Colors, Typography } from '../styles';
import ProgressBar from './ProgressBar';

export type ProcessingScreenProps = {
  message: string;
  disclaimer: string;
  uploadPercentage: number;
};

export default function ProcessingScreen(props: ProcessingScreenProps) {
  const { message, disclaimer, uploadPercentage } = props;

  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.childContainer}>
        <Image style={styles.logo} source={ormCheckLogo} />
        <View style={styles.bodyContainer}>
          <Image style={styles.gear} source={gearSpinner} />
          <Text style={styles.text}>{message}</Text>
          {uploadPercentage >= 0 ? (
            <ProgressBar percentage={uploadPercentage} />
          ) : (
            <View />
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <Image style={styles.logo} source={warningIcon} />
        <Text style={styles.warning}>{disclaimer}</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  parentContainer: {
    ...Sizing.parentContainer,
    backgroundColor: Colors.secondary.dark,
  },
  childContainer: {
    ...Spacing.childContainer,
    ...Sizing.childContainer,
    ...Colors.shadow,
    backgroundColor: Colors.secondary.light,
  },
  bodyContainer: {
    ...Spacing.bodyContainer,
  },
  logo: {
    ...Spacing.logo,
    ...Sizing.logo,
  },
  gear: {
    ...Spacing.logo,
    height: Sizing.x90,
  },
  text: {
    ...Typography.header,
    color: Colors.tertiary.brand,
  },
  warning: {
    ...Typography.header,
    color: Colors.warning.brand,
    fontSize: 10,
  },
  footer: {
    ...Spacing.footer,
    width: '90%',
  },
});

ProcessingScreen.defaultProps = {
  message: 'senseye orm check results are processing',
  disclaimer:
    'RESULTS ARE CURRENTLY IN BETA AND SHOULD NOT BE INCORPORATED INTO WORKFLOW',
  uploadProgress: -1,
};
