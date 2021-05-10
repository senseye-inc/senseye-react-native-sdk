import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { FaceOutline } from '@senseyeinc/react-native-senseye-sdk';
import { Sizing, Spacing, Colors, Typography } from '../styles';

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
    ...Sizing.parentContainer,
  },
  bodyContainer: {
    ...Spacing.childContainer,
    ...Sizing.childContainer,
  },
  textContainer: {
    width: Sizing.screen.width,
    flexWrap: 'wrap',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    ...Typography.header,
    color: Colors.tertiary.brand,
  },
});

PreviewScreen.defaultProps = {
  welcomeMessage: 'Please tap the screen to begin recording',
};
