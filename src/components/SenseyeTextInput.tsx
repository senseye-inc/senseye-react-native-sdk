import * as React from 'react';
import { View, StyleSheet, Text, TextInput, KeyboardType } from 'react-native';

export type SenseyeTextInputProps = {
  label: string;
  keyboardType: KeyboardType;
  placeholderText: string;
  placeholderTextColor: string;
  value: string;
  height: string | number;
  width: string | number;
  background: string;
  borderBottomColor: string;
  borderBottomWidth: number;
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
    text: {
      color: '#0FA697',
      marginLeft: 10,
      marginTop: 5,
      padding: 5,
      textTransform: 'uppercase',
      fontWeight: '700',
    },
    inputContainer: {
      height: props.height,
      width: props.width,
      backgroundColor: props.background,
      borderBottomColor: props.borderBottomColor,
      borderBottomWidth: props.borderBottomWidth,
      color: '#0FA697',
      marginBottom: 20,
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
