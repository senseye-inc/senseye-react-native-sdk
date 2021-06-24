import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import type { Datum } from '@senseyeinc/react-native-senseye-sdk';

export type SenseyePickerProps = {
  /** A collection of options a user can select from */
  options: {
    /** A list of displayed values of the collection */
    labels: string[];
    /** A list of the actual values of the collection */
    values: Datum[];
  };
  /** Displayed value on the Picker Item  */
  label: string;
  /** Sets the width of the picker container  */
  width: string | number;
  /** Sets the background color of the picker container */
  pickerBackground: string;
  /** Sets the bottom margin of the picker container */
  marginBottom: string | number;
  /** Stores which value is selected */
  selectedValue: Datum;
  /** Specifies the stack order */
  zIndex: number;
  /** Specifies the inverse stack order */
  zIndexInverse: number;
  /** Function to be called when an item is selected */
  onChangeValue?(value: Datum): void;
};

export default function SenseyePicker(props: SenseyePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [initValue, setValue] = React.useState(props.selectedValue);
  const [items, setItems] = React.useState(_buildItems(props.options));
  /** @description must be set to `ScrollView` otherwise will have a VirtualizedLists error messages */
  DropDownPicker.setListMode('SCROLLVIEW');

  /**
   * @function _buildItems parses through dropdown option items and values
   * @returns an array of objects
   */
  function _buildItems(options: SenseyePickerProps['options']) {
    let formData: any[] = [];
    options.values.forEach((el: Datum, i: number) => {
      formData.push({
        label: options.labels[i],
        value: el,
        key: `${el}-${i}`,
      });
    });
    return formData;
  }
  function _onChangeValue(val: Datum | Datum[]) {
    if (props.onChangeValue && typeof val !== 'object') {
      props.onChangeValue(val);
    }
  }
  /**
   * @todo function that manages closing of multiple open dropdown picker(s) to avoid overlapping
   * @url https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/next/tutorials/close-other-pickers
   const onSetOpen = React.useCallback(() => {
     setOpen(true);
   }, []);
   */

  return (
    <View style={styles(props).hmm}>
      {props.label && <Text style={styles(props).label}>{props.label}</Text>}
      <DropDownPicker
        open={open}
        value={initValue}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={(val) => _onChangeValue(val)}
        key={props.label}
        closeAfterSelecting={true}
        zIndex={props.zIndex}
        zIndexInverse={props.zIndexInverse}
        textStyle={styles(props).text}
        style={styles(props).pickerContainer}
        arrowIconStyle={styles(props).arrow}
        tickIconStyle={styles(props).tick}
        dropDownContainerStyle={styles(props).dropDown}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />
    </View>
  );
}

const styles = (props: SenseyePickerProps) =>
  StyleSheet.create({
    hmm: {
      zIndex: 8000,
      /** @todo fix style issues on the AM/PM picker, container issues */
      backgroundColor: props.pickerBackground,
    },
    pickerContainer: {
      backgroundColor: '#191C31',
      marginBottom: props.marginBottom,
      width: props.width,
      zIndex: props.zIndex,
      borderRadius: 0,
    },
    text: {
      marginLeft: 10,
      paddingLeft: 5,
      color: 'rgba(216,249,255, 0.5)',
    },
    label: {
      color: '#0FA697',
      padding: 5,
      textTransform: 'uppercase',
      fontWeight: '700',
      display: 'flex',
    },
    arrow: {
      backgroundColor: 'rgba(216,249,255, 0.5)',
      borderRadius: 100,
    },
    dropDown: {
      backgroundColor: '#191C31',
      zIndex: 3000,
    },
    tick: {
      backgroundColor: 'rgba(216,249,100, 0.5)',
      borderRadius: 100,
    },
  });

SenseyePicker.defaultProps = {
  label: '',
  selectedValue: null,
  width: 'auto',
  marginBottom: 20,
  zIndex: 100,
  zIndexInverse: 300,
  pickerBackground: 'transparent',
};
