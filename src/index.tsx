import { NativeModules } from 'react-native';

type SenseyeSdkType = {
  multiply(a: number, b: number): Promise<number>;
};

const { SenseyeSdk } = NativeModules;

export default SenseyeSdk as SenseyeSdkType;
