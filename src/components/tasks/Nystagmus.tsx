import * as React from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { TaskProps } from '@senseyeinc/react-native-senseye-sdk';

export type NystagmusProps = TaskProps & {
  /** The amount of time (milliseconds) the focal point pauses when at the far left and far right side of screen. */
  pause_time: number;
  /** The amount of time (milliseconds) to wait before the assessment starts. */
  start_pause_time: number;
  /** Defines how many times the target will repeat its cycle. One cycle is when the target moves from the far right side of the screen, to the left, back to the right. */
  iterations: number;
  /** Defines how fast the moving target moves across the screen. */
  speed: number;
  /** Defines the width and height of the focal point. */
  targetSize: number;
  /** The color of the moving focal point. */
  targetColor: string;
  /** initial x-position of the focal point in the task. */
  initialX: number;
};

export default function Nystagmus(props: NystagmusProps) {
  const {
    start_pause_time,
    speed,
    pause_time,
    iterations,
    onStart,
    onEnd,
    onUpdate,
  } = props;
  const [iterationCount, setIterationCount] = React.useState(0);
  // instaniates animation object with default starting value
  const xAxisAnimation = React.useRef(new Animated.Value(props.initialX))
    .current;
  // x-coordinates placements
  const targetXPos = xAxisAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 160, -160],
  });
  // consumes x-axis value and updates the target to that position
  const animatedStyles = {
    transform: [{ translateX: targetXPos }],
  };

  React.useEffect(() => {
    const listenerId = xAxisAnimation.addListener((value) => {
      if (onUpdate) {
        // returns data containing a timestamp and the target's updated x position
        onUpdate({
          timestamp: getCurrentTimestamp(),
          data: {
            value: value.value, // TODO: Not implemented properly
            iteration: iterationCount,
          },
        });
      }
    });
    return () => {
      // remove the previous listener
      xAxisAnimation.removeListener(listenerId);
    };
  }, [xAxisAnimation, onUpdate, iterationCount]);

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

  /* controls how the target animates across
    the screen and the amount of times the animation iterates. */
  const moveDot = React.useCallback(() => {
    let sequence: Animated.CompositeAnimation[] = [];
    if (iterationCount === 0) {
      sequence = [
        /* moves target from the center of the screen to the start position (right side).
          this initial motion does not count as being part of an iteration. */
        Animated.delay(start_pause_time),
        Animated.timing(xAxisAnimation, {
          toValue: 1,
          duration: 10000 / speed,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ];
    }
    // moves target for 1 iteration
    sequence = [
      ...sequence,
      // move to the left
      Animated.timing(xAxisAnimation, {
        toValue: 2,
        duration: 10000 / speed,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: pause_time,
      }),
      // pause
      Animated.delay(pause_time),
      // move to the right
      Animated.timing(xAxisAnimation, {
        toValue: 1, // when it gets here reset to go right or pause here depending on iteration
        duration: 10000 / speed,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ];
    // run constructed animation sequence
    Animated.sequence(sequence).start(() => {
      if (iterationCount < iterations - 1) {
        setIterationCount(iterationCount + 1);
      } else {
        _onEnd();
      }
    });
  }, [
    xAxisAnimation,
    start_pause_time,
    speed,
    pause_time,
    iterations,
    iterationCount,
    _onEnd,
  ]);

  React.useEffect(() => {
    moveDot();
  }, [moveDot]);

  return (
    <View style={styles(props).container}>
      <Animated.View
        onLayout={_onStart}
        style={[styles(props).target, animatedStyles]}
      />
    </View>
  );
}

const styles = (props: NystagmusProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.background,
      height: props.height,
      width: props.width,
    },
    target: {
      width: props.targetSize,
      height: props.targetSize,
      borderRadius: 100,
      backgroundColor: props.targetColor,
    },
  });

Nystagmus.defaultProps = {
  background: '#000000',
  pause_time: 4000,
  start_pause_time: 1000,
  iterations: 1,
  speed: 5,
  targetSize: 30,
  targetColor: '#FFFFFF',
  initialX: 0,
  name: 'nystagmus',
  instructions:
    '\
Please keep your head still throughout the assessment.\n\n\
Follow the target with your eyes as it moves back and forth across the screen.\n\n\
Double tap the screen to begin.',
  width: '100%',
  height: '100%',
};
