import React from "react";
import { useTranslation } from "react-i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../../../navigation/navigation.type";

import AppTitle from "../../../component/common/AppTitle";
import NavButton from "../../../component/common/Buttons/NavButton";

import PersonalChallengesScreen from "./PersonalChallengesScreen";
import ProgressCommentScreen from "../ProgressCommentScreen/ProgressCommentScreen";
import OtherUserProfileScreen from "../../ProfileScreen/OtherUser/OtherUserProfileScreen";
import PersonalChallengeDetailScreen from "./PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import OtherUserProfileChallengeDetailsScreen from "../../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import PersonalCoachChallengeDetailScreen from "../CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import CompanyChallengeDetailScreen from "../CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import AddNewChallengeProgressScreen from "../AddNewChallengeProgressScreen";
import EditChallengeScreen from "../EditChallengeScreen";
import { RefreshProvider } from "../../../context/refresh.context";
import EditChallengeProgressScreen from "../EditChallengeProgressScreen";
import ConfirmVideoCoachScreen from "../ConfirmVideoCoachScreen";
import CoachRateCompanyChallengeScreen from "../CoachRateCompanyChallengeScreen";
import CoachRateChallengeScreen from "../CoachRateChallengeScreen";
import CreatePersonalChallengeScreen from "./CreateChallengeScreen/CreateChallengeScreen";
import CreateCertifiedChallengeScreen from "./CreateCertifiedChallengeScreen/CreateCertifiedChallengeScreen";
import EditScheduleLinkScreen from "../EditScheduleLinkScreen";

const PersonalChallengesStack =
  createNativeStackNavigator<RootStackParamList>();

const PersonalChallengesNavigator = () => {
  const { t } = useTranslation();
  return (
    <RefreshProvider>
      <PersonalChallengesStack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerTitleAlign: "center",
          headerShown: true,
        }}
      >
        <PersonalChallengesStack.Screen
          name="PersonalChallengesScreen"
          component={PersonalChallengesScreen}
          options={() => ({
            headerTitle: () => <AppTitle title={t("top_nav.challenges")} />,
          })}
        />
        <PersonalChallengesStack.Screen
          name="PersonalChallengeDetailScreen"
          component={PersonalChallengeDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => "",
            headerLeft: () => (
              <NavButton
                text={t("top_nav.challenges") as string}
                onPress={() => navigation.navigate("PersonalChallengesScreen")}
                withBackIcon
              />
            ),
          })}
        />
        <PersonalChallengesStack.Screen
          name="PersonalCoachChallengeDetailScreen"
          component={PersonalCoachChallengeDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => "",
            headerLeft: () => (
              <NavButton
                text={t("top_nav.challenges") as string}
                onPress={() => navigation.navigate("PersonalChallengesScreen")}
                withBackIcon
              />
            ),
          })}
        />
        <PersonalChallengesStack.Screen
          name="OtherUserProfileScreen"
          component={OtherUserProfileScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => "",
            headerLeft: () => (
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
        <PersonalChallengesStack.Screen
          name="OtherUserProfileChallengeDetailsScreen"
          component={OtherUserProfileChallengeDetailsScreen}
          options={({ navigation }) => ({
            headerShown: true,
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
        <PersonalChallengesStack.Screen
          name="ProgressCommentScreen"
          component={ProgressCommentScreen}
          options={({ navigation }) => ({
            headerShown: true,
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

        <PersonalChallengesStack.Screen
          name="CompanyChallengeDetailScreen"
          component={CompanyChallengeDetailScreen}
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
        <PersonalChallengesStack.Screen
          name="AddNewChallengeProgressScreen"
          component={AddNewChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <PersonalChallengesStack.Screen
          name="EditChallengeScreen"
          component={EditChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <PersonalChallengesStack.Screen
          name="EditChallengeProgressScreen"
          component={EditChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <PersonalChallengesStack.Screen
          name="ConfirmVideoCoachScreen"
          component={ConfirmVideoCoachScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <PersonalChallengesStack.Screen
          name="CoachRateCompanyChallengeScreen"
          component={CoachRateCompanyChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <PersonalChallengesStack.Screen
          name="CoachRateChallengeScreen"
          component={CoachRateChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />

        <PersonalChallengesStack.Screen
          name="CreateChallengeScreen"
          component={CreatePersonalChallengeScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <AppTitle title={t("new_challenge_screen.new_challenge") || ""} />
            ),
            headerLeft: ({}) => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                testID="user_create_challenge_close_btn"
                className="ml-3"
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            ),
          })}
        />
        <PersonalChallengesStack.Screen
          name="CreateCertifiedChallengeScreen"
          component={CreateCertifiedChallengeScreen}
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
            headerLeft: ({}) => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="ml-3"
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            ),
          })}
        />
        <PersonalChallengesStack.Screen
          name="EditScheduleLinkScreen"
          component={EditScheduleLinkScreen}
          options={() => ({
            headerShown: false,
          })}
        />
      </PersonalChallengesStack.Navigator>
    </RefreshProvider>
  );
};

export default PersonalChallengesNavigator;
