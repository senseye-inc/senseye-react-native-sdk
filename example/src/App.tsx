import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { styles } from './styles';
import {
  CalibrationScreen,
  NystagmusScreen,
  PlrScreen,
  FullDemoScreen,
} from './screens';

const SenseyeTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00D8BB',
    background: '#DBEEF1',
    card: '#22294E',
    text: '#DBEEF1',
    border: '#6F93ED',
  },
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={SenseyeTheme}>
      <Tab.Navigator
        initialRouteName="Calibration"
        tabBarOptions={{
          labelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen name="Calibration" component={CalibrationScreen} />
        <Tab.Screen name="Nystagmus" component={NystagmusScreen} />
        <Tab.Screen name="PLR" component={PlrScreen} />
        <Tab.Screen name="Full Demo" component={FullDemoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
