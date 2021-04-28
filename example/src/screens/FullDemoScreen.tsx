import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ProcessingScreen,
  ResultsScreen,
  TaskInstructions,
  Welcome,
  Login,
} from './index';
import { Tasks } from '@senseyeinc/react-native-senseye-sdk';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Calibration Instructions">
        {(props) => (
          <TaskInstructions
            {...props}
            taskName={Tasks.Calibration.name}
            instruction={Tasks.Calibration.defaultProps.instructions}
            page={Tasks.Calibration.name}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Calibration" component={Tasks.Calibration} />
      <Stack.Screen name="Nystagmus Instructions">
        {(props) => (
          <TaskInstructions
            {...props}
            taskName={Tasks.Nystagmus.name}
            instruction={Tasks.Nystagmus.defaultProps.instructions}
            page={Tasks.Nystagmus.name}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Nystagmus" component={Tasks.Nystagmus} />
      <Stack.Screen name="PLR Instructions">
        {(props) => (
          <TaskInstructions
            {...props}
            taskName={Tasks.Plr.name}
            instruction={Tasks.Plr.defaultProps.instructions}
            page={Tasks.Plr.name}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Plr" component={Tasks.Plr} />
      <Stack.Screen name="Processing">
        {(props) => <ProcessingScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}
