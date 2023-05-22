import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/navigation.type';

import StepOfSteps from '../../../component/common/StepofSteps';
import Button from '../../../component/common/Buttons/Button';

import CompleteProfileStep1 from './CompleteProfileStep1';
import CompleteProfileStep2 from './CompleteProfileStep2';
import CompleteProfileStep3 from './CompleteProfileStep3';
import CompleteProfileStep4 from './CompleteProfileStep4';
import CompleteProfileFinish from './CompleteProfileFinish';

const CompleteProfileStack = createNativeStackNavigator<RootStackParamList>();

export type CompleteProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CompleteProfileScreen'
>;

interface ICompleteProfileProps {
  component: any;
}

const CompleteProfile: React.FC<ICompleteProfileProps> = ({ component }) => {
  return (
    <SafeAreaView className="bg-white">{component && component()}</SafeAreaView>
  );
};

const CompleteProfileScreen1 = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileStep1 navigation={navigation} />}
    />
  );
};

const CompleteProfileScreen2 = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileStep2 navigation={navigation} />}
    />
  );
};

const CompleteProfileScreen3 = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileStep3 navigation={navigation} />}
    />
  );
};

const CompleteProfileScreen4 = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileStep4 navigation={navigation} />}
    />
  );
};

const CompleteProfileFinishScreen = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileFinish navigation={navigation} />}
    />
  );
};

const CompleteProfileScreen = () => {
  return (
    <CompleteProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CompleteProfileStack.Screen
        name="CompleteProfileStep1Screen"
        component={CompleteProfileScreen1}
      />
      <CompleteProfileStack.Screen
        name="CompleteProfileStep2Screen"
        component={CompleteProfileScreen2}
      />
      <CompleteProfileStack.Screen
        name="CompleteProfileStep3Screen"
        component={CompleteProfileScreen3}
      />
      <CompleteProfileStack.Screen
        name="CompleteProfileStep4Screen"
        component={CompleteProfileScreen4}
      />
      <CompleteProfileStack.Screen
        name="CompleteProfileFinishScreen"
        component={CompleteProfileFinishScreen}
      />
    </CompleteProfileStack.Navigator>
  );
};

export default CompleteProfileScreen;
