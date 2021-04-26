/** Task Instruction Screen */
import React from 'react';
import { SafeAreaView, StyleSheet, Text, Modal, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SenseyeButton } from '@senseyeinc/react-native-senseye-sdk';
import { Colors, Typography, Spacing, Sizing } from '../styles';

type TaskInstructionsProps = {
  taskName: string;
  instruction: string;
};
export default function TaskInstructions(props: TaskInstructionsProps) {
  const [modalVisible, setModalVisible] = React.useState<boolean>(true);

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.parentContainer}>
          <View style={styles.childContainer}>
            <ScrollView contentContainerStyle={Spacing.container}>
              <Text style={styles.header}>{props.taskName}</Text>
              <Text style={styles.subheader}>{props.instruction}</Text>
            </ScrollView>
          </View>
          <View style={styles.button}>
            <SenseyeButton
              title={'Start'}
              type={'primaryCta'}
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...Spacing.centeredFlexView,
  },
  parentContainer: {
    backgroundColor: Colors.secondary.dark,
    height: Sizing.screen.height / 2,
  },
  childContainer: {
    ...Spacing.childContainer,
    flex: 0,
    backgroundColor: Colors.secondary.light,
  },
  header: {
    ...Typography.header,
    fontSize: Typography.fontSize.x50,
    lineHeight: Typography.lineHeight.x50,
    color: Colors.tertiary.brand,
  },
  subheader: {
    ...Typography.header,
    color: Colors.tertiary.brand,
  },
  button: {
    width: '100%',
    ...Spacing.marginAuto,
  },
});
TaskInstructions.defaultProps = {
  taskName: 'task name',
  instruction: 'task instructions will display here',
};
