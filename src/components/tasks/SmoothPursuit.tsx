import * as React from 'react';
import { Animated, Dimensions, View, StyleSheet } from 'react-native';

import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { TaskProps } from '@senseyeinc/react-native-senseye-sdk';

// window screen height and width
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export type SmoothPursuitProps = TaskProps & {
  /** Defines the number of cycles in an iteration the moving target will circle around the stationary target. */
  cycles: number;
  /** Defines the number of times the moving target will appear and perform its cycles. */
  iterations: number;
  /** Defines how fast the moving target circles around the centered focal point. */
  speed: number;
  /** Defines how far away the moving target will be from the stationary target. */
  offset: number;
  /** Defines the amount of time (milliseconds) the moving target will disappear and pause between each iteration. */
  targetDelay: number;
  /** Defines the size of the moving target. */
  targetRadius: number;
  /**
   * Defines the size of the moving target's outline. The outline is drawn as a circle behind the target itself,
   * i.e. set this less than or equal to `targetRadius` to make the outline disappear.
   */
  targetOutlineRadius: number;
  /** Defines the color of the moving target. */
  targetColor: string;
  /** Defines the color of the moving target's outline. */
  targetOutlineColor: string;
  /** Defines the radius on the stationary target. */
  bullseyeRadius: number;
  /** Defines the color of the stationary target. */
  bullseyeColor: string;
};

/**  Smooth pursuit assessment. Displays a target that the participant follows with their eyes. */
export default function SmoothPursuit(props: SmoothPursuitProps) {
  const {
    offset,
    targetDelay,
    targetOutlineRadius,
    cycles,
    iterations,
    speed,
    onStart,
    onEnd,
    onUpdate,
  } = props;
  const [iterationCount, setIterationCount] = React.useState(0);
  const [isTargetMoving, setIsTargetMoving] = React.useState(false);
  const [theta, setTheta] = React.useState(0);
  const [animatedStyles, setAnimatedStyles] = React.useState({});
  // instantiates animation object
  const moveAnimationValue = React.useRef(new Animated.ValueXY()).current;

  React.useEffect(() => {
    const xPos =
      WINDOW_WIDTH / 2 + Math.cos(theta) * offset - targetOutlineRadius;
    const yPos =
      WINDOW_HEIGHT / 2 + Math.sin(theta) * offset - targetOutlineRadius;
    // iterates through x-coordinates values
    const targetXPos = moveAnimationValue.x.interpolate({
      inputRange: [0, theta],
      outputRange: [xPos, xPos],
    });
    // iterates through y-coordinates valuess
    const targetYPos = moveAnimationValue.y.interpolate({
      inputRange: [0, theta],
      outputRange: [yPos, yPos],
    });
    // updates the target's xy position values
    setAnimatedStyles({
      transform: [{ translateX: targetXPos }, { translateY: targetYPos }],
    });
  }, [moveAnimationValue, theta, offset, targetOutlineRadius]);

  React.useEffect(() => {
    const listenerId = moveAnimationValue.addListener((value) => {
      if (onUpdate) {
        // returns data containing a timestamp and the target's updated (x,y) position, theta, speed and current iteration
        onUpdate({
          timestamp: getCurrentTimestamp(),
          data: {
            x: WINDOW_WIDTH / 2 + Math.cos(value.x) * offset,
            y: WINDOW_HEIGHT / 2 + Math.sin(value.y) * offset,
            theta: value.x,
            speed: speed,
            iteration: iterationCount,
          },
        });
      }
    });
    return () => {
      // remove the previous listener
      moveAnimationValue.removeListener(listenerId);
    };
  }, [moveAnimationValue, onUpdate, offset, speed, iterationCount]);

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

  // manages the dot position animation
  const moveDot = React.useCallback(() => {
    Animated.timing(moveAnimationValue, {
      toValue: { x: theta, y: theta },
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      // radians = degrees * pi / 180 => 1 cycle (360 degrees) = 2 * pi
      if (theta < cycles * 2 * Math.PI) {
        // if the target hasn't completed all cycles within the iteration yet, continue moving
        setTheta(theta + speed);
      } else if (iterationCount < iterations - 1) {
        // otherwise, if not all iterations are complete yet, initiate another one
        setIsTargetMoving(false);
        setTheta(0);
        setIterationCount(iterationCount + 1);
      } else {
        _onEnd();
      }
    });
  }, [
    moveAnimationValue,
    theta,
    cycles,
    speed,
    iterations,
    iterationCount,
    _onEnd,
  ]);

  React.useEffect(() => {
    if (!isTargetMoving) {
      setTimeout(() => {
        setIsTargetMoving(true);
      }, targetDelay);
    } else {
      moveDot();
    }
  }, [moveDot, isTargetMoving, targetDelay]);

  return (
    <View style={styles(props).container}>
      <View onLayout={_onStart} style={styles(props).bullseye} />
      {isTargetMoving ? (
        <Animated.View style={[styles(props).targetOutline, animatedStyles]}>
          <View style={[styles(props).target]} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = (props: SmoothPursuitProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: props.height,
      width: props.width,
      backgroundColor: props.background,
    },
    targetOutline: {
      width: props.targetOutlineRadius * 2,
      height: props.targetOutlineRadius * 2,
      borderRadius: 100,
      backgroundColor: props.targetOutlineColor,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    target: {
      width: props.targetRadius * 2,
      height: props.targetRadius * 2,
      borderRadius: 100,
      backgroundColor: props.targetColor,
    },
    bullseye: {
      width: props.bullseyeRadius * 2,
      height: props.bullseyeRadius * 2,
      borderRadius: props.bullseyeRadius,
      backgroundColor: props.bullseyeColor,
      top: WINDOW_HEIGHT / 2 - props.bullseyeRadius,
      left: WINDOW_WIDTH / 2 - props.bullseyeRadius,
    },
  });

SmoothPursuit.defaultProps = {
  background: '#000000',
  duration: 3000,
  cycles: 2,
  iterations: 2,
  speed: 0.05,
  offset: 120,
  targetDelay: 3000,
  targetRadius: 7,
  targetColor: '#FF0000',
  targetOutlineRadius: 14,
  targetOutlineColor: '#FFFFFF',
  bullseyeRadius: 10,
  bullseyeColor: '#FFFFFF',
  instructions:
    '\
Please keep your head still throughout the assessment.\n\n\
Stare at the dot in the center of the screen. When a target appears, follow the target with your eyes as it moves around in a circle. When the target disappears, stare at the center dot again.\n\n\
Double tap the screen to begin.',
  width: '100%',
  height: '100%',
  name: 'smooth_pursuit',
};
