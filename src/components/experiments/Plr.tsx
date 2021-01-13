import * as React from 'react';
import { Animated, Dimensions, Easing, View, StyleSheet } from 'react-native';

import { getCurrentTimestamp } from '@utils';
import type { ExperimentProps } from '@types';

// device screen height and width
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

type PlrProps = ExperimentProps & {
  /** Dictates the color sequence of the background */
  color_values: string[] | number[];
  /** The centered cross width  */
  fixation_width: number;
  /** Defines the centered cross length  */
  fixation_length: number;
  /** Defines how thick the outline on the centered cross, set to 0 to make outline disappear  */
  fixation_outline_size: number;
  /** Defines the time that passes until the next screen is displayed  */
  duration: number;
};

/** Measures pupillary light reflex by manipulating the luminance of the screen  */
export default function Plr(props: PlrProps) {
  function _onStart() {
    if (props.onStart) {
      props.onStart();
    }
  }
  function _onEnd() {
    if (props.onEnd) {
      props.onEnd();
    }
  }
  const [updateCount, setUpdateCount] = React.useState(0);
  // instantiates animation object with default starting value
  const screenColor = React.useRef(new Animated.Value(0)).current;
  const color = screenColor.interpolate({
    inputRange: [...Array(props.color_values.length).keys()],
    outputRange: props.color_values,
  });
  // consumes outputRange value and updates the screen color
  const animatedStyles = {
    backgroundColor: color,
  };

  screenColor.addListener((value) => {
    if (props.onUpdate) {
      // returns data containing a timestamp and the updated background color
      props.onUpdate({
        timestamp: getCurrentTimestamp(),
        data: {
          bg_color: props.color_values[value.value],
        },
      });
    }
  });

  // responsible for the pace that each screen updates
  const handleScreenColor = () => {
    Animated.timing(screenColor, {
      toValue: updateCount,
      duration: props.duration * 1000,
      easing: Easing.step0,
      useNativeDriver: false,
    }).start(() => {
      if (updateCount < props.color_values.length) {
        setUpdateCount(updateCount + 1);
        handleScreenColor();
      } else {
        _onEnd();
      }
    });
  };

  return (
    <View style={styles(props).container}>
      <Animated.View
        onLayout={() => {
          _onStart();
          handleScreenColor();
        }}
        style={{ ...styles(props).plrBackground, ...animatedStyles }}
      />
      <View style={{ ...styles(props).crossVertical }} />
      <View style={{ ...styles(props).crossHorizontal }} />
    </View>
  );
}

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
  background: '#000000',
  color_values: [
    'rgb(127, 127, 127)',
    'rgb(0, 0, 0)',
    'rgb(255, 255, 255)',
    'rgb(0, 0, 0)',
  ],
  fixation_width: 10,
  fixation_length: 40,
  fixation_outline_size: 2,
  duration: 5,
  instructions:
    '\
    Please keep your head still throughout the assessment.\n\n\
    Continue to look at the cross in the center of the screen as the background changes from gray to black to white to black.\n\n\
    Double tap the screen to begin.',
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  onEnd: undefined,
};
