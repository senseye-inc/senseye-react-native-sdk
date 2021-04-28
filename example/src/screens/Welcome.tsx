/** Welcome screen */
import * as React from 'react';
import { Image, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {
  ormCheckLogo,
  forwardArrow,
} from '@senseyeinc/react-native-senseye-sdk';
import { Spacing, Colors, Sizing, Typography } from '../styles';

export type WelcomeProps = {
  welcomeMessage: string;
};
export default function Welcome(props: WelcomeProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <Image style={styles.logo} source={ormCheckLogo} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.welcomeMessage}</Text>
        </View>
        <TouchableHighlight>
          <Image style={styles.arrow} source={forwardArrow} />
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Sizing.parentContainer,
    backgroundColor: Colors.secondary.dark,
  },
  bodyContainer: {
    ...Spacing.childContainer,
    ...Sizing.childContainer,
    ...Colors.shadow,
    backgroundColor: Colors.secondary.light,
  },
  textContainer: {
    ...Spacing.bodyContainer,
  },
  logo: {
    ...Sizing.logo,
    ...Spacing.logo,
  },
  text: {
    ...Typography.header,
    color: Colors.tertiary.brand,
  },
  arrow: {
    ...Sizing.arrow,
    alignSelf: 'flex-end',
  },
});

Welcome.defaultProps = {
  welcomeMessage:
    '\
  This application uses the front facing camera. \
  \n\n For optimal data collection the app will rotate on the next screen.\
  \n\n Please rotate phone accordingly. ',
};
