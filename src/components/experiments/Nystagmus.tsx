import * as React from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

import { getCurrentTimestamp } from '@utils';
import type { ExperimentProps } from '@types';

type NystagmusProps = ExperimentProps & {
  /** The amount of time (in seconds) the focal point pauses when at the far left and far right side of screen  */
  pause_time: number;
  /** The amount of time that passes before the assessment starts  */
  start_pause_time: number;
  /** Defines how many iterations that the assesment will cycle through  */
  iterations: number;
  /** Defines how fast the moving target moves across the screen  */
  speed: number;
  /** Defines the width and height of the focal point  */
  targetSize: number;
  /** The color of the moving focal point  */
  targetColor: string;
  /** initial x-position of the focal point in the experiment */
  initialX: number;
};

export default function Nystagmus(props: NystagmusProps) {
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
  // an iteration is complete when the dot moves from the far right side of the screen, to the left, back to the right
  const [iterationCount, setIterationCount] = React.useState(1);
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

  xAxisAnimation.addListener((value) => {
    if (props.onUpdate) {
      // returns data containing a timestamp and the dot's updated x position
      props.onUpdate({
        timestamp: getCurrentTimestamp(),
        data: {
          value: value.value, // TODO: Not implemented properly
        },
      });
    }
  });

  /* Responsible for moving target from center of screen to the start position (right side).
    because the dot starts in the center of the screen,
    the first time the dot reaches the right side of the
    screen doesn't count as being part of an iteration. */
  let moveToStartPos = () => {
    Animated.delay(props.start_pause_time * 1000);
    Animated.timing(xAxisAnimation, {
      toValue: 1,
      duration: props.speed * 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      moveDot();
    });
  };

  /* controls how the target animates across
    the screen and the amount of times the animation iterates */
  let moveDot = () => {
    Animated.sequence([
      // goes to the right
      Animated.timing(xAxisAnimation, {
        toValue: 2, // when it gets here reset to go leftwards or pause here depending on iteration
        duration: props.speed * 1000,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: props.pause_time * 1000,
      }),
      //pauses
      Animated.delay(props.pause_time * 1000),
      // goes to the left
      Animated.timing(xAxisAnimation, {
        toValue: 1,
        duration: props.speed * 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // if iterations is greater than 0, then rerun animation until all iterations have been fulfilled
      if (props.iterations > 0 && iterationCount < props.iterations) {
        setIterationCount(iterationCount + 1);
        // repeat animation until specified iterations is reached
        moveDot();
      }
      _onEnd();
    });
  };

  return (
    <View style={styles(props).container}>
      <Animated.View
        onLayout={() => {
          _onStart();
          moveToStartPos();
        }}
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
  pause_time: 4,
  start_pause_time: 4,
  iterations: 1,
  speed: 2,
  targetSize: 30,
  targetColor: '#FFFFFF',
  initialX: 0,
  instructions:
    '\
    Follow the target with your eyes as it moves.\n\n\
    Continue to track the target with your eyes until it stops moving.\n\n\
    Double tap the screen to begin.',
  width: '100%',
  height: '100%',
  onEnd: undefined,
};
