/** Login screen */
import * as React from 'react';
import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {
  SenseyeTextInput,
  backArrow,
  forwardArrow,
  pictorialGradientLogo,
} from '@senseyeinc/react-native-senseye-sdk';

import { Spacing, Colors, Sizing } from '../styles';

export default function Login() {
  const [uid, setUID] = React.useState<string>('');
  const [groupID, setGroupID] = React.useState<string>('');
  return (
    <SafeAreaView style={styles.parentContainer as StyleProp<ViewStyle>}>
      <View style={styles.childContainer as StyleProp<ViewStyle>}>
        <Image style={styles.logo} source={pictorialGradientLogo} />
        <View style={styles.bodyContainer}>
          <SenseyeTextInput
            label=""
            placeholderText="GROUP ID"
            keyboardType="number-pad"
            value={groupID}
            background="transparent"
            borderBottomColor={Colors.tertiary.brand}
            borderBottomWidth={1}
            onChangeText={(text) => setGroupID(text)}
          />
          <SenseyeTextInput
            label=""
            placeholderText="UNIQUE ID"
            keyboardType="number-pad"
            value={uid}
            background="transparent"
            borderBottomColor={Colors.tertiary.brand}
            borderBottomWidth={1}
            onChangeText={(text) => setUID(text)}
          />
        </View>
        <View style={styles.navContainer}>
          <Image style={styles.arrow as ImageStyle} source={backArrow} />
          <Image style={styles.arrow as ImageStyle} source={forwardArrow} />
        </View>
      </View>
    </SafeAreaView>
  );
}
interface Styles {
  parentContainer: ViewStyle;
  childContainer: ViewStyle;
  bodyContainer: ViewStyle;
  navContainer: ViewStyle;
  logo: ImageStyle;
  arrow: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  parentContainer: {
    ...Sizing.parentContainer,
    backgroundColor: Colors.secondary.dark,
  },
  childContainer: {
    ...Spacing.childContainer,
    ...Sizing.childContainer,
    ...Colors.shadow,
    backgroundColor: Colors.secondary.light,
  },
  bodyContainer: {
    ...Spacing.bodyContainer,
  },
  navContainer: {
    ...Spacing.navContainer,
  },
  logo: {
    ...Sizing.logo,
    ...Spacing.logo,
  },
  arrow: {
    ...Sizing.arrow,
    alignSelf: 'flex-end',
  },
});
