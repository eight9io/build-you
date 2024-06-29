import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { RootStackParamList } from "../../../navigation/navigation.type";

import CompanyChallengeDetailScreen from "./CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import AppTitle from "../../../component/common/AppTitle";
import NavButton from "../../../component/common/Buttons/NavButton";
import ProgressCommentScreen from "../ProgressCommentScreen/ProgressCommentScreen";
import OtherUserProfileScreen from "../../ProfileScreen/OtherUser/OtherUserProfileScreen";
import OtherUserProfileChallengeDetailsScreen from "../../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import CompanyChallengsScreen from "./CompanyChallengsScreen";
import PersonalChallengeDetailScreen from "../PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import PersonalCoachChallengeDetailScreen from "../CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import AddNewChallengeProgressScreen from "../AddNewChallengeProgressScreen";
import EditChallengeScreen from "../EditChallengeScreen";
import { RefreshProvider } from "../../../context/refresh.context";
import EditChallengeProgressScreen from "../EditChallengeProgressScreen";
import ConfirmVideoCoachScreen from "../ConfirmVideoCoachScreen";
import CoachRateChallengeScreen from "../CoachRateChallengeScreen";
import CoachRateCompanyChallengeScreen from "../CoachRateCompanyChallengeScreen";
import CreateCompanyChallengeScreen from "./CreateCompanyChallengeScreen/CreateNewCompanyChallenge";
import CreateCertifiedCompanyChallengeScreen from "./CreateCertifiedCompanyChallengeScreen/CreateCertifiedCompanyChallengeScreen";
import AddNewParticipantScreen from "../../ProfileScreen/Company/AddNewParticipantScreen";

const CompanyChallengesStack = createNativeStackNavigator<RootStackParamList>();

const CompanyChallengesNavigator = () => {
  return (
    <RefreshProvider>
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
          name="AddNewParticipantScreen"
          component={AddNewParticipantScreen}
          options={({ navigation }) => ({
            headerShown: false,
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

        <CompanyChallengesStack.Screen
          name="PersonalChallengeDetailScreen"
          component={PersonalChallengeDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => "",
            headerLeft: () => (
              <NavButton
                text={t("button.back") as string}
                onPress={() => navigation.goBack()}
                withBackIcon
              />
            ),
          })}
        />
        <CompanyChallengesStack.Screen
          name="PersonalCoachChallengeDetailScreen"
          component={PersonalCoachChallengeDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => "",
            headerLeft: () => (
              <NavButton
                text={t("button.back") as string}
                onPress={() => navigation.goBack()}
                withBackIcon
              />
            ),
          })}
        />
        <CompanyChallengesStack.Screen
          name="AddNewChallengeProgressScreen"
          component={AddNewChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <CompanyChallengesStack.Screen
          name="EditChallengeScreen"
          component={EditChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <CompanyChallengesStack.Screen
          name="EditChallengeProgressScreen"
          component={EditChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <CompanyChallengesStack.Screen
          name="ConfirmVideoCoachScreen"
          component={ConfirmVideoCoachScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <CompanyChallengesStack.Screen
          name="CoachRateCompanyChallengeScreen"
          component={CoachRateCompanyChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <CompanyChallengesStack.Screen
          name="CoachRateChallengeScreen"
          component={CoachRateChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />

        <CompanyChallengesStack.Screen
          name="CreateCompanyChallengeScreen"
          component={CreateCompanyChallengeScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <AppTitle
                title={
                  t("new_challenge_screen.new_challenge") || "New challenge"
                }
              />
            ),
            headerLeft: ({ }) => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="ml-3"
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            ),
          })}
        />
        <CompanyChallengesStack.Screen
          name="CreateCertifiedCompanyChallengeScreen"
          component={CreateCertifiedCompanyChallengeScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <AppTitle
                title={
                  t("new_challenge_screen.new_certified_challenge") ||
                  "New certified challenge"
                }
              />
            ),
            headerLeft: ({ }) => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="ml-3"
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            ),
          })}
        />
      </CompanyChallengesStack.Navigator>
    </RefreshProvider>
  );
};

export default CompanyChallengesNavigator;
