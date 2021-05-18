/** Task Instruction Screen */
import React from 'react';
import { SafeAreaView, StyleSheet, Text, Modal, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SenseyeButton } from '@senseyeinc/react-native-senseye-sdk';

import { Colors, Typography, Spacing } from '../styles';

type TaskInstructionsProps = {
  title: string;
  instructions: string;
  visible: boolean;
  onButtonPress?(): void;
};

export default function TaskInstructions(props: TaskInstructionsProps) {
  const { title, instructions, visible, onButtonPress } = props;
  const [modalVisible, setModalVisible] = React.useState<boolean>(true);

  const _onButtonPress = React.useCallback(() => {
    if (onButtonPress) {
      onButtonPress();
    }
  }, [onButtonPress]);

  React.useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.parentContainer}>
          <ScrollView contentContainerStyle={styles.childContainer}>
            <Text style={styles.header}>{title}</Text>
            <Text style={styles.subheader}>{instructions}</Text>
            <SenseyeButton title={'OK'} type={'primaryCta'} onPress={_onButtonPress} />
          </ScrollView>
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
    width: '80%',
  },
  childContainer: {
    ...Spacing.childContainer,
    ...Colors.shadow,
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
  title: 'task name',
  instructions: 'task instructions will display here',
};
