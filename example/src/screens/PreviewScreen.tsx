import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { FaceOutline } from '@senseyeinc/react-native-senseye-sdk';
import { Sizing } from '../styles';

export type PreviewScreenProps = {
  welcomeMessage: string;
};
export default function PreviewScreen(props: PreviewScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <FaceOutline />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.welcomeMessage}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: Sizing.screen.width,
    height: Sizing.screen.height,
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
});

PreviewScreen.defaultProps = {
  welcomeMessage: 'Please tap the screen to begin recording',
};
