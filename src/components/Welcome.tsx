/** Welcome screen */
import * as React from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Text,
} from 'react-native';

import { SenseyeButton } from '@senseyeinc/react-native-senseye-sdk';

const WINDOW_WIDTH = Dimensions.get('window').width;

export function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/senseye-white-logo.png')}
      />
      <ScrollView
        style={styles.innerContainer}
        contentContainerStyle={styles.layout}
      >
        <Text style={styles.warning}>{'hi'}</Text>

        <SenseyeButton title="Submit" type={'primaryCta'} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: '100%',
    backgroundColor: '#141726',
  },
  layout: {
    //TODO: https://developer.android.com/training/keyboard-input/visibility
    height: '400%',
  },
  innerContainer: {
    margin: 30,
    padding: 30,
    backgroundColor: '#21284E',
  },
  text: {
    color: '#DBEEF1',
    marginLeft: 10,
    marginTop: 5,
    padding: 5,
  },
  logo: {
    minHeight: 50,
    maxHeight: 190,
    height: 10,
    minWidth: 90,
    maxWidth: 160,
    alignSelf: 'flex-start',
    resizeMode: 'cover',
    margin: 10,
  },
  clockStyles: {
    height: 70,
    flexDirection: 'row',
    marginBottom: 30,
  },
  warning: {
    color: '#d7b357',
  },
});
