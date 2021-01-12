import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import type { CalibrationProps } from './types';

/** Measures pupillary light reflex by manipulating the luminance of the screen  */
export default function Calibration(props: CalibrationProps) {
  // instaniates animation object with default starting value
  const moveAnimationValue = React.useRef(new Animated.ValueXY({ x: 0, y: 0 }))
    .current;

  // x-coordinates placements
  const targetXPos = moveAnimationValue.x.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    // outputRange: [0.2, 0.4, 0.6, 0.8, 0.25, 0.5, 0.75, 0.2, 0.4, 0.6, 0.8],
    outputRange: [20, 40, 60, 80, 25, 50, 75, 20, 40, 60, 80],
    extrapolate: 'clamp',
  });

  // y-coordinates placements
  const targetYPos = moveAnimationValue.y.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    // outputRange: [0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.75, 0.75, 0.75, 0.75],
    outputRange: [25, 25, 25, 25, 50, 50, 50, 75, 75, 75, 75],
    extrapolate: 'clamp',
  });

  // consumes outputRange value and updates the target to that position
  const animatedStyles = {
    transform: [{ translateX: targetXPos }, { translateY: targetYPos }],
  };

  // responsible for the timing and positioning of each dot on the screen
  let moveDot = () => {
    const animations = props.dot_points.map((coordinates: [number, number]) =>
      Animated.timing(moveAnimationValue, {
        toValue: { x: coordinates[0], y: coordinates[1] },
        duration: 500,
        useNativeDriver: true,
      })
    );
    Animated.sequence(animations).start();
  };

  return (
    <View style={styles(props).container}>
      <Animated.View
        onLayout={moveDot}
        style={{ ...styles(props).dot, ...animatedStyles }}
      />
    </View>
  );
}

const styles = (props: CalibrationProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: props.height,
      width: props.width,
      backgroundColor: props.background,
    },
    dot: {
      backgroundColor: props.dot_color,
      height: props.radius,
      width: props.radius,
      borderRadius: 100,
    },
  });

Calibration.defaultProps = {
  background: '#000000',
  duration: 2,
  radius: 15,
  dot_color: '#FFFFFF',
  dot_points: [
    [0.2, 0.25],
    [0.4, 0.25],
    [0.6, 0.25],
    [0.8, 0.25],
    [0.25, 0.5],
    [0.5, 0.5],
    [0.75, 0.5],
    [0.2, 0.75],
    [0.4, 0.75],
    [0.6, 0.75],
    [0.8, 0.75],
  ],
  instructions:
    'Please keep your head still throughout the assessment.\n\nAs each dot appears, look at it immediately, and continue to stare at the dot until a new dot appears.\n\nPress the space bar to begin',
  width: '100%',
  height: '100%',
  callback: undefined,
  onStart: undefined,
  onEnd: undefined,
};
