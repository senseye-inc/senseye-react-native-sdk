import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export type SenseyeButtonProps = {
  /** Title message to be displayed on the button */
  title: string;
  /** Describes which UI appearance to use for button */
  theme: 'primaryCta' | 'secondaryCta';
  onPress?(): void;
};

export default function SenseyeButton(props: SenseyeButtonProps) {
  // adjust the style on the button depending on the theme set for the button
  let themeStyling =
    props.theme === 'primaryCta' ? styles.primaryCtaButton : styles.secondaryCtaButton;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={[styles.buttonContainer, themeStyling]}
    >
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    elevation: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 75,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    margin: 10,
  },
  primaryCtaButton: {
    backgroundColor: '#0ea8a4',
  },
  secondaryCtaButton: {
    backgroundColor: '#2f4374',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
