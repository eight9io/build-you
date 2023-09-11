import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TPackageType } from "../screen/ChallengesScreen/CartScreen";

export type RootStackParamList = {
  IntroScreen: undefined;
  FeedScreen: undefined;
  FeedScreenUnregister: undefined;
  HomeScreen: {
    screen?: string;
    params?: Record<string, any>;
  };
  InnerScreen: undefined;
  NotificationsScreen: undefined;
  ChallengeDetailScreen: undefined;
  SettingsScreen: undefined;
  SettingsScreenRoot: undefined;
  PersonalInformationScreen: undefined;
  TermsOfServicesScreen: undefined;
  PrivacyPolicyScreen: undefined;
  DeleteAccountScreen: undefined;
  ProfileScreen: undefined;
  ModalScreen: undefined;
  CreateChallengeScreen: undefined;
  PersonalChallengesScreen: undefined;
  PersonalChallengeDetailScreen: {
    challengeId: string;
  };
  RegisterScreen: undefined;
  SkillStepThreeScreen: undefined;

  EditPersonalProfileScreen: undefined;
  EditCompanyProfileScreen: undefined;

  CompleteProfileScreen: undefined;
  CompleteProfileStep1Screen: undefined;
  CompleteProfileStep2Screen: undefined;
  CompleteProfileStep3Screen: undefined;
  CompleteProfileStep4Screen: undefined;
  CompleteProfileFinishScreen: undefined;

  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;

  CompanyProfileScreen: undefined;
  CompanyChallengesScreen: undefined;
  CompanyChallengeDetailScreen: {
    challengeId: string;
  };
  CreateCompanyChallengeScreen: undefined;

  CreateChallengeScreenMain: undefined;
  CreateCretifiedChallengeScreen: undefined;
  CreateCretifiedCompanyChallengeScreen: undefined;

  ProgressCommentScreen: {
    progressId: string;
    ownerId?: string;
    challengeName?: string;
    challengeId: string;
  };

  ProfileScreenLoading: undefined;

  Challenges: {
    screen: string;
    params: {
      challengeId: string;
    };
  };
  HomeScreenWithoutLogin: undefined;

  OtherUserProfileScreen: {
    userId: string;
    isFollowing?: boolean;
    isFollower?: boolean;
  };

  OtherUserProfileChallengeDetailsScreen: {
    challengeId: string;
    isCompanyAccount?: boolean;
  };

  MainSearchScreen: undefined;
  BottomNavBar: undefined;
  SplashScreen: undefined;
  NotFound: undefined;
};

export type NavigationRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;
