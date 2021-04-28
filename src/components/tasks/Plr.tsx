import * as React from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { TaskProps } from '@senseyeinc/react-native-senseye-sdk';

export type PlrProps = TaskProps & {
  /** Dictates the color sequence of the background. */
  color_values: string[] | number[];
  /** The centered cross width. */
  fixation_width: number;
  /** Defines the centered cross length. */
  fixation_length: number;
  /** Defines how thick the outline on the centered cross, set to 0 to make outline disappear. */
  fixation_outline_size: number;
  /** Defines the amount of time (milliseconds) to display each background color. */
  duration: number;
  /** set the navigational page */
  navigation?: string[];
};

/** Measures pupillary light reflex by manipulating the luminance of the screen. */
export default function Plr(props: PlrProps) {
  const { duration, color_values, onStart, onEnd, onUpdate } = props;
  const [updateCount, setUpdateCount] = React.useState(0);
  // instantiates animation object with default starting value
  const screenColor = React.useRef(new Animated.Value(0)).current;
  const color = screenColor.interpolate({
    inputRange: [...Array(color_values.length).keys()],
    outputRange: color_values,
  });
  // consumes outputRange value and updates the screen color
  const animatedStyles = {
    backgroundColor: color,
  };

  React.useEffect(() => {
    const listenerId = screenColor.addListener((value) => {
      if (onUpdate) {
        // returns data containing a timestamp and the updated background color
        onUpdate({
          timestamp: getCurrentTimestamp(),
          data: {
            bg_color: color_values[value.value],
          },
        });
      }
    });
    return () => {
      // remove the previous listener
      screenColor.removeListener(listenerId);
    };
  }, [screenColor, onUpdate, color_values]);

  const _onStart = () => {
    if (onStart) {
      onStart();
    }
  };
  const _onEnd = React.useCallback(() => {
    if (onEnd) {
      // onEnd();
    }
    if (props.navigation) props.navigation.push('Processing');
  }, [onEnd, props.navigation]);

  // responsible for the pace that each screen updates
  const handleScreenColor = React.useCallback(() => {
    Animated.timing(screenColor, {
      toValue: updateCount,
      duration: duration,
      easing: Easing.step0,
      useNativeDriver: false,
    }).start(() => {
      if (updateCount < color_values.length - 1) {
        setUpdateCount(updateCount + 1);
      } else {
        _onEnd();
      }
    });
  }, [screenColor, duration, color_values, updateCount, _onEnd]);

  React.useEffect(() => {
    handleScreenColor();
  }, [handleScreenColor]);

  return (
    <View style={styles(props).container}>
      <Animated.View
        onLayout={_onStart}
        style={{ ...styles(props).plrBackground, ...animatedStyles }}
      />
      <View style={{ ...styles(props).crossVertical }} />
      <View style={{ ...styles(props).crossHorizontal }} />
      <View style={{ ...styles(props).crossOutlineVertical }} />
      <View style={{ ...styles(props).crossOutlineHorizontal }} />
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
      height: props.fixation_length - props.fixation_outline_size * 2,
      width: props.fixation_width - props.fixation_outline_size * 2,
      position: 'absolute',
      backgroundColor: '#888888',
      zIndex: 5,
    },
    crossHorizontal: {
      height: props.fixation_width - props.fixation_outline_size * 2,
      width: props.fixation_length - props.fixation_outline_size * 2,
      position: 'absolute',
      backgroundColor: '#888888',
      zIndex: 5,
    },
    crossOutlineVertical: {
      height: props.fixation_length,
      width: props.fixation_width,
      position: 'absolute',
      backgroundColor: '#555555',
      zIndex: 4,
    },
    crossOutlineHorizontal: {
      height: props.fixation_width,
      width: props.fixation_length,
      position: 'absolute',
      backgroundColor: '#555555',
      zIndex: 4,
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
  duration: 5000,
  name: 'plr',
  instructions:
    '\
Please keep your head still throughout the assessment.\n\n\
Continue to look at the cross in the center of the screen as the background changes from gray to black to white to black.\n\n\
Double tap the screen to begin.',
  width: '100%',
  height: '100%',
};
