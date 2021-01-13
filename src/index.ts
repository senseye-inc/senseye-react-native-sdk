import { NativeModules } from 'react-native';

type SenseyeSdkType = {
  multiply(a: number, b: number): Promise<number>;
};

const { SenseyeSdk } = NativeModules;

export default SenseyeSdk as SenseyeSdkType;

// TODO: The above code was generated by bob.
//  leaving as reference for now, but will be removed/updated in the future

export * from './api';
export * from './components';
export * from './types';
export * from './utils';
