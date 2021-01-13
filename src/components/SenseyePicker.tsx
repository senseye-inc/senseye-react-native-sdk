import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type SenseyePickerProps = {
  options: {
    labels: string[];
    values: React.ReactText[];
  };
  label: string;
  width: string | number;
  marginBottom: string | number;
  selectedValue: any;
  onChangeValue?(itemValue: React.ReactText, itemPosition: number): void;
};

export default function SenseyePicker(props: SenseyePickerProps) {
  function _buildItems(options: SenseyePickerProps['options']) {
    let items: any[] = [];
    options.values.forEach((el: React.ReactText, i: number) => {
      items.push(
        <Picker.Item
          label={options.labels[i]}
          value={el}
          key={`pickerItem${i}`}
        />
      );
    });
    return items;
  }

  function _onChangeValue(itemValue: React.ReactText, itemPosition: number) {
    if (props.onChangeValue) {
      props.onChangeValue(itemValue, itemPosition);
    }
  }

  return (
    <View style={styles(props).pickerContainer}>
      {props.label && <Text style={styles(props).text}>{props.label}</Text>}
      <Picker
        mode="dropdown"
        dropdownIconColor={'#EBF1F2'}
        itemStyle={styles(props).itemStyle}
        style={styles(props).itemStyle}
        selectedValue={props.selectedValue}
        onValueChange={(itemValue, itemPosition) =>
          _onChangeValue(itemValue, itemPosition)
        }
      >
        {_buildItems(props.options)}
      </Picker>
    </View>
  );
}

const styles = (props: SenseyePickerProps) =>
  StyleSheet.create({
    pickerContainer: {
      backgroundColor: '#191C31',
      marginBottom: props.marginBottom,
      width: props.width,
    },
    text: {
      color: '#0FA697',
      marginLeft: 10,
      marginTop: 5,
      padding: 5,
      textTransform: 'uppercase',
      fontWeight: '700',
    },
    itemStyle: {
      height: 50,
      marginLeft: 5,
      paddingLeft: 5,
      color: 'rgba(216,249,255, 0.5)',
      textAlign: 'left',
    },
  });

SenseyePicker.defaultProps = {
  label: '',
  width: 'auto',
  marginBottom: 20,
};
