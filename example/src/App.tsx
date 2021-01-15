import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Experiments } from '@senseyeinc/react-native-senseye-sdk';

export default function App() {
  return (
    <View style={styles.container}>
      <Experiments.Nystagmus iterations={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
