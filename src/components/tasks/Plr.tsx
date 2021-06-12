import * as React from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

import { getCurrentTimestamp } from '@senseyeinc/react-native-senseye-sdk';
import type { TaskProps } from '@senseyeinc/react-native-senseye-sdk';

export type PlrProps = TaskProps & {
  /** The color sequence of the background. */
  colorSequence: string[] | number[];
  /** The center cross width. */
  fixationWidth: number;
  /** The center cross length. */
  fixationLength: number;
  /** The thickness of the center cross outline. Set to 0 to make the outline disappear. */
  fixationOutlineSize: number;
  /** The amount of time (milliseconds) to display each background color. */
  duration: number;
};

/** Measures pupillary light reflex by manipulating the luminance of the screen. */
export default function Plr(props: PlrProps) {
  const { duration, colorSequence, onStart, onEnd, onUpdate } = props;
  const [updateCount, setUpdateCount] = React.useState(0);
  // instantiates animation object with default starting value
  const screenColor = React.useRef(new Animated.Value(0)).current;
  const color = screenColor.interpolate({
    inputRange: [...Array(colorSequence.length).keys()],
    outputRange: colorSequence,
  });
  // consumes outputRange value and updates the screen color
  const animatedStyles = {
    backgroundColor: color,
  };

  React.useEffect(() => {
    let curIndex = -1;
    const listenerId = screenColor.addListener((value) => {
      if (onUpdate && curIndex !== value.value) {
        curIndex = value.value;
        // returns data containing a timestamp and the updated background color
        onUpdate({
          timestamp: getCurrentTimestamp(),
          data: {
            bgColor: colorSequence[curIndex],
          },
        });
      }
    });
    return () => {
      // remove the previous listener
      screenColor.removeListener(listenerId);
    };
  }, [screenColor, onUpdate, colorSequence]);

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

  // responsible for the pace that each screen updates
  const handleScreenColor = React.useCallback(() => {
    Animated.timing(screenColor, {
      toValue: updateCount,
      duration: duration,
      easing: Easing.step0,
      useNativeDriver: false,
    }).start(() => {
      if (updateCount < colorSequence.length - 1) {
        setUpdateCount(updateCount + 1);
      } else {
        _onEnd();
      }
    });
  }, [screenColor, duration, colorSequence, updateCount, _onEnd]);

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
      flex: 0,
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
      height: props.fixationLength - props.fixationOutlineSize * 2,
      width: props.fixationWidth - props.fixationOutlineSize * 2,
      position: 'absolute',
      backgroundColor: '#888888',
      zIndex: 5,
    },
    crossHorizontal: {
      height: props.fixationWidth - props.fixationOutlineSize * 2,
      width: props.fixationLength - props.fixationOutlineSize * 2,
      position: 'absolute',
      backgroundColor: '#888888',
      zIndex: 5,
    },
    crossOutlineVertical: {
      height: props.fixationLength,
      width: props.fixationWidth,
      position: 'absolute',
      backgroundColor: '#555555',
      zIndex: 4,
    },
    crossOutlineHorizontal: {
      height: props.fixationWidth,
      width: props.fixationLength,
      position: 'absolute',
      backgroundColor: '#555555',
      zIndex: 4,
    },
  });

Plr.defaultProps = {
  background: '#000000',
  colorSequence: [
    'rgb(127, 127, 127)',
    'rgb(0, 0, 0)',
    'rgb(255, 255, 255)',
    'rgb(0, 0, 0)',
  ],
  fixationWidth: 16,
  fixationLength: 40,
  fixationOutlineSize: 4,
  duration: 5000,
  name: 'PLR',
  instructions:
    '\
Please keep your head still throughout the assessment.\n\n\
Continue to look at the cross in the center of the screen as the background changes from gray to black to white to black.\n\n\
Double tap the screen to begin.',
  width: '100%',
  height: '100%',
};
