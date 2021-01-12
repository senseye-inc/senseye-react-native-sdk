import * as React from 'react';
import { Animated, View, StyleSheet, Dimensions, Easing } from 'react-native';

import type { PlrProps } from './types';

/** Measures pupillary light reflex by manipulating the luminance of the screen  */
export default function Plr(props: PlrProps) {
  // instaniates animation object with default starting value
  const screenColor = React.useRef(new Animated.Value(0)).current;

  /* TO-DO: fetch colors from props.color_values
    and feed in more inputRange/outputRange
    depending on how many colors were provided in props */
  let color = screenColor.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      'rgb(127, 127, 127)',
      'rgb(0, 0, 0)',
      'rgb(255, 255, 255)',
      'rgb(0, 0, 0)',
    ],
  });

  // consumes outputRange value and updates the  screen color
  const animatedStyles = {
    backgroundColor: color,
  };

  // responsible for the pace that each screen updates
  const handleScreenColor = () => {
    Animated.timing(screenColor, {
      toValue: 0,
      duration: props.duration * 1000,
      easing: Easing.step0,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(screenColor, {
        toValue: 1,
        duration: props.duration * 1000,
        easing: Easing.step1,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(screenColor, {
          toValue: 2,
          duration: props.duration * 1000,
          easing: Easing.step1,
          useNativeDriver: false,
        }).start(() => {
          Animated.timing(screenColor, {
            toValue: 3,
            duration: props.duration * 1000,
            easing: Easing.step1,
            useNativeDriver: false,
          }).start();
        });
      });
    });
  };

  return (
    <View style={styles(props).container}>
      <Animated.View
        onLayout={handleScreenColor}
        style={{ ...styles(props).plrBackground, ...animatedStyles }}
      />
      <View style={{ ...styles(props).crossVertical }} />
      <View style={{ ...styles(props).crossHorizontal }} />
    </View>
  );
}

// gets device screen height and width
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = (props: PlrProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.background,
      height: props.height,
      width: props.width,
    },
    plrBackground: {
      width: props.width,
      height: props.height,
      position: 'relative',
    },
    crossVertical: {
      height: props.fixation_length,
      width: props.fixation_width,
      position: 'absolute',
      right: props.width / 2 - props.fixation_width / 2,
      bottom: props.height / 2 - props.fixation_length / 2,
      backgroundColor: '#888888',
      borderRightColor: '#555555',
      borderTopColor: '#555555',
      borderBottomColor: '#555555',
      borderLeftColor: '#555555',
      borderWidth: props.fixation_outline_size,
      zIndex: 4,
    },
    crossHorizontal: {
      height: props.fixation_width,
      width: props.fixation_length,
      position: 'absolute',
      right: props.width / 2 - props.fixation_length / 2,
      bottom: props.height / 2 - props.fixation_width / 2,
      backgroundColor: '#888888',
      borderRightColor: '#555555',
      borderTopColor: '#555555',
      borderBottomColor: '#555555',
      borderLeftColor: '#555555',
      borderWidth: props.fixation_outline_size,
      zIndex: 5,
    },
  });

Plr.defaultProps = {
  color_values: [127, 0, 255, 0],
  fixation_width: 10,
  fixation_length: 40,
  fixation_outline_size: 2,
  duration: 5,
  instructions:
    'Please keep your head still throughout the assessment.\n\nContinue to look at the cross in the center of the screen as the screen changes from gray to black to white to black.\n\nPress the space bar to begin',
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  onEnd: undefined,
};
