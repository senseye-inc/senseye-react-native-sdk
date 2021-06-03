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
  delay: number;
  /**
   * Defines the starting angle, measured in radians, of the target for each cycle/iteration.
   * At `0`, the target's starting position will lie on the positive x-axis. As the value increases,
   * the position will shift in a counterclockwise direction.
   */
  startAngle: number;
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
  /** Defines the radius of the stationary target. */
  fixationRadius: number;
  /** Defines the color of the stationary target. */
  fixationColor: string;
};

/**  Smooth pursuit assessment. Displays a target that the participant follows with their eyes. */
export default function SmoothPursuit(props: SmoothPursuitProps) {
  const {
    offset,
    delay,
    targetOutlineRadius,
    cycles,
    iterations,
    speed,
    startAngle,
    onStart,
    onEnd,
    onUpdate,
  } = props;
  const [iterationCount, setIterationCount] = React.useState(0);
  const [isTargetMoving, setIsTargetMoving] = React.useState(false);
  const [angle, setAngle] = React.useState(startAngle);
  const [animatedStyles, setAnimatedStyles] = React.useState({});
  // instantiates animation object
  const moveAnimationValue = React.useRef(new Animated.ValueXY()).current;

  React.useEffect(() => {
    const xPos = WINDOW_WIDTH / 2 + Math.cos(angle) * offset - targetOutlineRadius;
    const yPos = WINDOW_HEIGHT / 2 + Math.sin(angle) * offset - targetOutlineRadius;
    // iterates through x-coordinates values
    const targetXPos = moveAnimationValue.x.interpolate({
      inputRange: [angle, angle],
      outputRange: [xPos, xPos],
    });
    // iterates through y-coordinates valuess
    const targetYPos = moveAnimationValue.y.interpolate({
      inputRange: [angle, angle],
      outputRange: [yPos, yPos],
    });
    // updates the target's xy position values
    setAnimatedStyles({
      transform: [{ translateX: targetXPos }, { translateY: targetYPos }],
    });
  }, [moveAnimationValue, angle, offset, targetOutlineRadius]);

  React.useEffect(() => {
    let curAngle: number | undefined = undefined;
    const listenerId = moveAnimationValue.addListener((value) => {
      const { x, y } = value;
      if (onUpdate && curAngle !== x && x === y) {
        curAngle = x;
        // returns data containing a timestamp and the target's updated (x,y) position, angle, speed and current iteration
        onUpdate({
          timestamp: getCurrentTimestamp(),
          data: {
            x: WINDOW_WIDTH / 2 + Math.cos(curAngle) * offset,
            y: WINDOW_HEIGHT / 2 + Math.sin(curAngle) * offset,
            angle: curAngle,
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
      toValue: { x: angle, y: angle },
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      // 1 radian = 360 degrees / (2 * pi) => 1 cycle (360 degrees) = (2 * pi) radians
      if (angle < cycles * 2 * Math.PI + startAngle) {
        // if the target hasn't completed all cycles within the iteration yet, continue moving
        setAngle(angle + speed);
      } else if (iterationCount < iterations - 1) {
        // otherwise, if not all iterations are complete yet, initiate another one
        setIsTargetMoving(false);
        setTheta(startAngle);
        setIterationCount(iterationCount + 1);
      } else {
        _onEnd();
      }
    });
  }, [
    moveAnimationValue,
    startAngle,
    angle,
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
      }, delay);
    } else {
      moveDot();
    }
  }, [moveDot, isTargetMoving, delay]);

  return (
    <View style={styles(props).container}>
      <View onLayout={_onStart} style={styles(props).fixation} />
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
      flex: 0,
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
    fixation: {
      width: props.fixationRadius * 2,
      height: props.fixationRadius * 2,
      borderRadius: props.fixationRadius,
      backgroundColor: props.fixationColor,
      top: WINDOW_HEIGHT / 2 - props.fixationRadius,
      left: WINDOW_WIDTH / 2 - props.fixationRadius,
    },
  });

SmoothPursuit.defaultProps = {
  background: '#000000',
  duration: 3000,
  cycles: 3,
  iterations: 3,
  speed: 0.05,
  offset: 150,
  delay: 3000,
  startAngle: Math.PI / 2,
  targetRadius: 7,
  targetColor: '#FF0000',
  targetOutlineRadius: 14,
  targetOutlineColor: '#FFFFFF',
  fixationRadius: 10,
  fixationColor: '#FFFFFF',
  instructions:
    '\
Please keep your head still throughout the assessment.\n\n\
Stare at the dot at the center of the screen. When a target appears, follow the target with your eyes as it moves around in a circle. When the target disappears, stare at the center dot again.\n\n\
Double tap the screen to begin.',
  width: '100%',
  height: '100%',
  name: 'Smooth Pursuit',
};
