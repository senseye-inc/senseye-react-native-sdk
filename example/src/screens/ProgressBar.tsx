import React, { useRef, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { Colors, Typography } from '../styles';

/* TODO: reformat to take in `uploadProgress` instead of mock progress data */
/* custom hook by Dan Abramov
https://overreacted.io/making-setinterval-declarative-with-react-hooks/ */
function useInterval(callback: (() => void) | undefined, delay: number | null) {
  const savedCallback = React.useRef<any>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return;
  }, [delay]);
}
export type ProgressBarProps = {
  /** denotes how much of the video has been uploaded */
  uploadProgress: string | number;
};
const ProgressBar = (_props: ProgressBarProps) => {
  let animation = useRef(new Animated.Value(0));
  const [progress, setProgress] = useState(0);
  useInterval(() => {
    if (progress < 100) {
      setProgress(progress + 5);
    }
  }, 1000);

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.bar,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>
      <Text style={styles.text}>{`${progress}%`}</Text>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    height: 20,
    width: '100%',
    borderWidth: 4,
    backgroundColor: Colors.tertiary.light,
    borderColor: Colors.secondary.light,
    ...Colors.shadow,
  },
  bar: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary.brand,
  },
  text: {
    color: Colors.tertiary.brand,
    ...Typography.header,
  },
});

ProgressBar.defaultProps = {
  uploadProgress: 0,
};
