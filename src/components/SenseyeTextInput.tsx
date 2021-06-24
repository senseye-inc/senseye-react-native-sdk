import * as React from 'react';
import { View, StyleSheet, Text, TextInput, KeyboardType } from 'react-native';

export type SenseyeTextInputProps = {
  /** Label message to be displayed for field */
  label: string;
  /** Determines which keyboard to use, e.g.numeric */
  keyboardType: KeyboardType;
  /** The string that will be rendered before text input has been entered */
  placeholderText: string;
  /** The color that will determine placeholder text */
  placeholderTextColor: string;
  /** The value to show for the text input */
  value: string | undefined;
  /** Sets height of the field container */
  height: string | number;
  /** Sets width of the field container */
  width: string | number;
  /** Sets background color of the field container */
  background: string;
  /** Sets border color for the field container */
  borderBottomColor: string;
  /** The numeric width to use for field container border */
  borderBottomWidth: number;
  /** A string that displays an alert message */
  onChangeText?(text: string): void;
};

export default function SenseyeTextInput(props: SenseyeTextInputProps) {
  function _onChangeText(text: string) {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  }

  return (
    <View style={styles(props).inputContainer}>
      <Text style={styles(props).text}>{props.label}</Text>
      <TextInput
        style={styles(props).inputField}
        keyboardType={props.keyboardType}
        placeholder={props.placeholderText}
        placeholderTextColor={props.placeholderTextColor}
        value={props.value}
        returnKeyType={'done'}
        returnKeyLabel={'done'}
        onChangeText={(text) => _onChangeText(text)}
      />
    </View>
  );
}

const styles = (props: SenseyeTextInputProps) =>
  StyleSheet.create({
    inputContainer: {
      height: props.height,
      width: props.width,
      backgroundColor: props.background,
      color: '#0FA697',
      marginBottom: 20,
      borderWidth: 1,
      borderTopColor: '#000',
      borderLeftColor: '#000',
      borderRightColor: '#000',
      borderBottomColor: '#000',
    },
    text: {
      color: '#0FA697',
      marginLeft: 10,
      marginTop: 5,
      padding: 5,
      textTransform: 'uppercase',
      fontWeight: '700',
    },
    inputField: {
      marginLeft: 10,
      paddingLeft: 5,
      color: '#ebf1f2',
    },
  });

SenseyeTextInput.defaultProps = {
  label: '',
  keyboardType: 'default',
  placeholderText: 'Type here',
  placeholderTextColor: 'rgba(216,249,255, 0.2)',
  height: 70,
  width: 'auto',
  background: '#191C31',
  borderBottomColor: 'transparent',
  borderBottomWidth: 0,
};
