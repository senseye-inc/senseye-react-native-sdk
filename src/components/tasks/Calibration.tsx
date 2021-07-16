import * as React from 'react';
import { Animated, Dimensions, Easing, View, StyleSheet } from 'react-native';

import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { Point, TaskProps } from '@senseyeinc/react-native-senseye-sdk';

// application window height and width
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export type CalibrationProps = TaskProps & {
  /** Amount of time (milliseconds) a dot is displayed on-screen. */
  duration: number;
  /** @deprecated since version 0.4.0 */
  delay?: number;
  /** Defines the radius of the dots. */
  radius: number;
  /** Defines the color of the dots. */
  dotColor: string;
  /** Determines the sequence of xy coordinates of the dots. */
  dotSequence: Point[];
};

/**
 * This task is used to calibrate the gaze tracking system to provide accurate
 * gaze information used to assess behavior in the other tasks.
 */
export default function Calibration(props: CalibrationProps) {
  const { duration, dotSequence, radius, onStart, onEnd, onUpdate } = props;
  const [dotMoveCount, setDotMoveCount] = React.useState(0);
  // instantiates animation object
  const moveAnimationValue = React.useRef(new Animated.ValueXY()).current;
  // returns an array of index values from dotSequence
  const dotIndexes = dotSequence.map((_, i) => i);
  // grabs first index: [x,y] grabs x-coordinate within the bounds of WINDOW_HEIGHT
  const xOutput = dotSequence.map((point) => point.x * WINDOW_WIDTH - radius).flat(2);
  // grabs second index: [x,y] grabs y-coordinate within the bounds of WINDOW_HEIGHT
  const yOutput = dotSequence.map((point) => point.y * WINDOW_HEIGHT - radius).flat(2);
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

  React.useEffect(() => {
    let curIndex = -1;
    const listenerId = moveAnimationValue.addListener((value) => {
      const { x, y } = value;
      if (onUpdate && curIndex !== x && x === y) {
        // round to nearest integer because x may evaluate to imprecise float in some devices
        curIndex = Math.round(x);
        /*
          Returns data containing a timestamp and the dot's updated (x,y) position relative to the canvas.
            (0, 0) represents the top left of the canvas.
            (1, 1) represents the bottom right of the canvas.
        */
        onUpdate({
          timestamp: getCurrentTimestamp(),
          data: {
            x: dotSequence[curIndex].x,
            y: dotSequence[curIndex].y,
          },
        });
      }
    });
    return () => {
      // remove the previous listener
      moveAnimationValue.removeListener(listenerId);
    };
  }, [moveAnimationValue, onUpdate, dotSequence]);

  const _onStart = () => {
    if (onStart) {
      onStart();
    }
  };
  const _onEnd = React.useCallback(() => {
    if (onEnd) {
      onEnd();
    }
  }, [onEnd]);

  // updates dot position
  const moveDot = React.useCallback(() => {
    Animated.timing(moveAnimationValue, {
      toValue: { x: dotMoveCount, y: dotMoveCount },
      duration: duration,
      easing: Easing.step0,
      useNativeDriver: true,
    }).start(() => {
      if (dotMoveCount < dotSequence.length - 1) {
        setDotMoveCount(dotMoveCount + 1);
      } else {
        _onEnd();
      }
    });
  }, [moveAnimationValue, duration, dotSequence, dotMoveCount, _onEnd]);

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
      flex: 0,
      height: props.height,
      width: props.width,
      backgroundColor: props.background,
    },
    dot: {
      backgroundColor: props.dotColor,
      height: props.radius * 2,
      width: props.radius * 2,
      borderRadius: 100,
    },
  });

Calibration.defaultProps = {
  background: '#000000',
  duration: 2000,
  radius: 15,
  dotColor: '#FFFFFF',
  dotSequence: [
    { x: 0.2, y: 0.25 },
    { x: 0.4, y: 0.25 },
    { x: 0.6, y: 0.25 },
    { x: 0.8, y: 0.25 },
    { x: 0.25, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.75, y: 0.5 },
    { x: 0.2, y: 0.75 },
    { x: 0.4, y: 0.75 },
    { x: 0.6, y: 0.75 },
    { x: 0.8, y: 0.75 },
  ],
  name: 'Calibration',
  instructions:
    '\
Please keep your head still throughout the assessment.\n\n\
As each dot appears, immediately look at the dot and continue to stare at it until a new dot appears.\n\n\
Double tap the screen to begin.',
  width: '100%',
  height: '100%',
};
