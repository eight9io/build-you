import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/navigation.type";

import CompanyChallengeDetailScreen from "./CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import { t } from "i18next";
import AppTitle from "../../../component/common/AppTitle";
import NavButton from "../../../component/common/Buttons/NavButton";
import ProgressCommentScreen from "../ProgressCommentScreen/ProgressCommentScreen";
import OtherUserProfileScreen from "../../ProfileScreen/OtherUser/OtherUserProfileScreen";
import OtherUserProfileChallengeDetailsScreen from "../../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import CompanyChallengsScreen from "./CompnayChallengsScreen";

const CompanyChallengesStack = createNativeStackNavigator<RootStackParamList>();

const CompanyChallengesNavigator = () => {
  return (
    <CompanyChallengesStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerShown: true,
      }}
    >
      <CompanyChallengesStack.Screen
        name="CompanyChallengesScreen"
        component={CompanyChallengsScreen}
        options={({ navigation }) => ({
          headerTitle: () => <AppTitle title={t("top_nav.challenges")} />,
        })}
      />

      <CompanyChallengesStack.Screen
        name="CompanyChallengeDetailScreen"
        component={CompanyChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("top_nav.challenges") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />

      <CompanyChallengesStack.Screen
        name="OtherUserProfileScreen"
        component={OtherUserProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => {
                navigation.goBack();
              }}
              withBackIcon
            />
          ),
        })}
      />

      <CompanyChallengesStack.Screen
        name="OtherUserProfileChallengeDetailsScreen"
        component={OtherUserProfileChallengeDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />

      <CompanyChallengesStack.Screen
        name="ProgressCommentScreen"
        component={ProgressCommentScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      
      {/* TODO: Add challenge detail screens to navigate through new message notification */}
    </CompanyChallengesStack.Navigator>
  );
};

export default CompanyChallengesNavigator;
