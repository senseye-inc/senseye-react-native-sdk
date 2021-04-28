import * as React from 'react';
import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  forwardArrow,
  ormCheckLogo,
} from '@senseyeinc/react-native-senseye-sdk';
import { Spacing, Colors, Sizing, Typography } from '../styles';

export type WelcomeProps = {
  welcomeMessage: string;
  onPress?: any;
  navigation?: string[];
};
export default function Welcome(props: WelcomeProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <Image style={styles.logo} source={ormCheckLogo} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.welcomeMessage}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (props.navigation) props.navigation.push('Login');
          }}
        >
          <Image style={styles.arrow} source={forwardArrow} />
        </TouchableOpacity>
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
