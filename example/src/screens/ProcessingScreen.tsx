import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text } from 'react-native';
import { Spacing, Sizing, Colors, Typography } from '../styles';
import ProgressBar from './ProgressBar';

export type ProcessingScreenProps = {
  status: string;
  message: string;
  disclaimer: string;
};
export default function ProcessingScreen(props: ProcessingScreenProps) {
  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.childContainer}>
        <Image
          style={styles.logo}
          source={require('../../../src/assets/senseye-orm-check.png')}
        />
        <View style={styles.bodyContainer}>
          <Image
            style={styles.gear}
            source={require('../../../src/assets/Gear-0.2s-200px.gif')}
          />
          <Text style={styles.text}>{props.message}</Text>
          <ProgressBar />
        </View>
      </View>
      <View style={styles.footer}>
        <Image
          style={styles.logo}
          source={require('../../../src/assets/warning.png')}
        />
        <Text style={styles.warning}>{props.disclaimer}</Text>
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
  status: 'not ready',
  message: 'senseye orm check results are processing',
  disclaimer:
    'RESULTS ARE CURRENTLY IN BETA AND SHOULD NOT BE INCORPORATED INTO WORKFLOW',
};
