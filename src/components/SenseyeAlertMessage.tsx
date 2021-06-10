import React from 'react';
import { Text, StyleSheet } from 'react-native';

export type SenseyeAlertMessageProps = {
  /** A string to describe whether the alert is a `warning` or `error` */
  alertType: 'warning' | 'error';
  /** A string that displays an alert message */
  message: string;
};
export default function SenseyeAlertMessage(props: SenseyeAlertMessageProps) {
  let typeStyling = props.alertType === 'warning' ? styles.warning : styles.error;
  return <Text style={[styles.message, typeStyling]}>{props.message}</Text>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
  },
  message: {
    fontStyle: 'normal' as 'normal',
    fontWeight: 'bold' as 'bold',
    fontSize: 13,
    lineHeight: 15,
    textAlign: 'center' as 'center',
    textTransform: 'uppercase' as 'uppercase',
    marginBottom: 10,
  },
  warning: {
    color: '#d7b357',
  },
  error: {
    color: '#cf1717',
  },
});
SenseyeAlertMessage.defaultProps = {
  alertType: 'warning',
  message: '',
};
