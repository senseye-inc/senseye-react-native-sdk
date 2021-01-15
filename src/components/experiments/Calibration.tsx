import * as React from 'react';
import { Animated, Dimensions, Easing, View, StyleSheet } from 'react-native';

import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { ExperimentProps } from '@senseyeinc/react-native-senseye-sdk';

// device screen height and width
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

type CalibrationProps = ExperimentProps & {
  /** How long a dot is displayed on-screen in milliseconds.  */
  duration: number;
  /** Delay (ms) between render of old dot and new dot. */
  delay: number;
  /** Defines the radius of the dots. */
  radius: number;
  /** Defines the color of the dots. */
  dot_color: string;
  /** Determines the x,y coordinates of the sequence of dots on the screen. */
  dot_points: [number, number][];
};

/**
 * This experiment is used to calibrate the gaze tracking system to provide accurate
 * gaze information used to assess behavior in the other tasks.
 */
export default function Calibration(props: CalibrationProps) {
  const [dotMoveCount, setDotMoveCount] = React.useState(0);
  // instantiates animation object
  const moveAnimationValue = React.useRef(new Animated.ValueXY()).current;
  // returns an array of index values from props.dot_points
  const dotIndexes = props.dot_points.map((_, i) => i);
  // grabs first index: [x,y] grabs x-coordinate within the bounds of SCREEN_HEIGHT
  const xOutput = props.dot_points.map((xy) => xy[0] * SCREEN_WIDTH).flat(2);
  // grabs second index: [x,y] grabs y-coordinate within the bounds of SCREEN_HEIGHT
  const yOutput = props.dot_points.map((xy) => xy[1] * SCREEN_HEIGHT).flat(2);
  // iterates through x-coordinates values
  const targetXPos = moveAnimationValue.x.interpolate({
    inputRange: dotIndexes,
    outputRange: xOutput,
    extrapolate: 'clamp',
  });
  // iterates through y-coordinates values
  const targetYPos = moveAnimationValue.y.interpolate({
    inputRange: dotIndexes,
    outputRange: yOutput,
    extrapolate: 'clamp',
  });
  const animatedStyles = {
    transform: [{ translateX: targetXPos }, { translateY: targetYPos }],
  };

  moveAnimationValue.addListener((value) => {
    if (props.onUpdate) {
      /*
        Returns data containing a timestamp and the dot's updated (x,y) position relative to the canvas.
          (0, 0) represents the top left of the canvas.
          (1, 1) represents the bottom right of the canvas.
        */
      props.onUpdate({
        timestamp: getCurrentTimestamp(),
        data: {
          x: props.dot_points[value.x][0],
          y: props.dot_points[value.y][1],
        },
      });
    }
  });

  const _onStart = () => {
    if (props.onStart) {
      props.onStart();
    }
  };
  const _onEnd = React.useCallback(() => {
    if (props.onEnd) {
      props.onEnd();
    }
  }, [props]);

  // updates dot position
  const moveDot = React.useCallback(() => {
    Animated.timing(moveAnimationValue, {
      toValue: { x: dotMoveCount, y: dotMoveCount },
      duration: props.duration,
      easing: Easing.step0,
      delay: props.delay,
      useNativeDriver: true,
    }).start(() => {
      if (dotMoveCount < props.dot_points.length - 1) {
        setDotMoveCount(dotMoveCount + 1);
      } else {
        _onEnd();
      }
    });
  }, [dotMoveCount, moveAnimationValue, props, _onEnd]);

  React.useEffect(() => {
    moveDot();
  }, [moveDot]);

  return (
    <View style={styles(props).container}>
      <Animated.View
        onLayout={_onStart}
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
  duration: 2000,
  delay: 0,
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
    '\
    Please keep your head still throughout the assessment.\n\n\
    As each dot appears, look at it immediately, and continue to stare at the dot until a new dot appears.\n\n\
    Double tap the screen to begin.',
  width: '100%',
  height: '100%',
  callback: undefined,
  onStart: undefined,
  onEnd: undefined,
};
