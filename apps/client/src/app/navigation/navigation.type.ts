import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  IntroScreen: undefined;
  HomeScreen: undefined;
  InnerScreen: undefined;
  AlertsScreen: undefined;
  ChallengeDetailScreen: undefined;
  SettingsScreen: undefined;
  ProfileScreen: undefined;
  ModalScreen: undefined;
  CreateChallengeScreen: undefined;
  PersonalChallengesScreen: undefined;
  PersonalChallengeDetailScreen: undefined;
  RegisterScreen: undefined;
  SkillStepThreeScreen: undefined;

  CompleteProfileScreen: undefined;
  CompleteProfileStep1Screen: undefined;
  CompleteProfileStep2Screen: undefined;
  CompleteProfileStep3Screen: undefined;
  CompleteProfileStep4Screen: undefined;
  CompleteProfileFinishScreen: undefined;

};

export type NavigationRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;

export const useNav = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
};
