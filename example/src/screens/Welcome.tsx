/** Welcome screen */
import * as React from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
  Text,
} from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

export type WelcomeProps = {
  welcomeMessage: string;
};
export default function Welcome(props: WelcomeProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <Image
          style={styles.logo}
          source={require('../../../src/assets/senseye-orm-check.png')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.welcomeMessage}</Text>
        </View>
        <Image
          style={styles.arrow}
          source={require('../../../src/assets/forward-arrow.png')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: '100%',
    backgroundColor: '#141726',
  },
  bodyContainer: {
    margin: 30,
    padding: 30,
    minHeight: '70%',
    backgroundColor: '#21284E',
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  logo: {
    minHeight: 50,
    maxHeight: 190,
    height: 10,
    minWidth: 90,
    maxWidth: 160,
    alignSelf: 'center',
    resizeMode: 'contain',
    margin: 0,
  },
  text: {
    color: '#9FB7C6',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  arrow: {
    height: 60,
    width: 60,
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
