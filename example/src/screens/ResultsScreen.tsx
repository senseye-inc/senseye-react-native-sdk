import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text } from 'react-native';
import { Spacing, Sizing, Colors, Typography } from '../styles';
import type { PredictionResult } from '@senseyeinc/react-native-senseye-sdk';

export type ResultsScreenProps = {
  result: PredictionResult;
  message: string;
  disclaimer: string;
};
export default function ResultsScreen(props: ResultsScreenProps) {
  const icon;
  icon
  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.childContainer}>
        <Image
          style={styles.logo}
          source={require('../../../src/assets/senseye-orm-check.png')}
        />
        <View style={styles.bodyContainer}>
          <Image
            style={styles.icon}
            source={require(`../../../src/assets/${icon}.png`)}
          />
          <Text style={styles.text}>{props.message}</Text>
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
  icon: {
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

ResultsScreen.defaultProps = {
  result: 'not ready',
  message: '',
  disclaimer:
    'RESULTS ARE CURRENTLY IN BETA AND SHOULD NOT BE INCORPORATED INTO WORKFLOW',
};
