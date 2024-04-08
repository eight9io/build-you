import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, View } from "react-native";

import { useUserProfileStore } from "../../../store/user-store";

import { RootStackParamList } from "../../../navigation/navigation.type";

import ProfileComponent from "../../../component/Profile/ProfileComponent";
import AppTitle from "../../../component/common/AppTitle";
import NavButton from "../../../component/common/Buttons/NavButton";
import PersonalCoachChallengeDetailScreen from "../../ChallengesScreen/CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import PersonalChallengeDetailScreen from "../../ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import ProgressCommentScreen from "../../ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen";
import OtherUserProfileChallengeDetailsScreen from "../OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import OtherUserProfileScreen from "../OtherUser/OtherUserProfileScreen";

import { RouteProp } from "@react-navigation/native";
import CompanyChallengeDetailScreen from "../../ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import CustomActivityIndicator from "../../../component/common/CustomActivityIndicator";
import Button from "../../../component/common/Buttons/Button";
import { onShareUserLink } from "../../../utils/shareLink.util";

import ShareIcon from "../../../../../assets/svg/share.svg";
import SettingsIcon from "../../../component/common/Buttons/ButtonWithIcon/asset/settings.svg";
import SettingsScreen from "../../SettingsScreen/SettingsScreen";
import EditPersonalProfileScreen from "./EditPersonalProfileScreen/EditPersonalProfileScreen";
import AddHardSkillsScreen from "./AddHardSkillsScreen";
import AddManualSkillScreen from "../../HardSkills/AddManualSkillScreen";
import AddNewChallengeProgressScreen from "../../ChallengesScreen/AddNewChallengeProgressScreen";
import EditChallengeScreen from "../../ChallengesScreen/EditChallengeScreen";
import EditChallengeProgressScreen from "../../ChallengesScreen/EditChallengeProgressScreen";
import ConfirmVideoCoachScreen from "../../ChallengesScreen/ConfirmVideoCoachScreen";
import CoachRateCompanyChallengeScreen from "../../ChallengesScreen/CoachRateCompanyChallengeScreen";
import CoachRateChallengeScreen from "../../ChallengesScreen/CoachRateChallengeScreen";
import EditScheduleLinkScreen from "../../ChallengesScreen/EditScheduleLinkScreen";
import ScheduleDetailScreen from "../../ChallengesScreen/ScheduleDetailScreen";
import CoachCreateScheduleScreen from "../../ChallengesScreen/CoachCreateScheduleScreen";
import EditScheduleScreen from "../../ChallengesScreen/EditScheduleScreen";
import AddScheduleLinkScreen from "../../ChallengesScreen/AddScheduleLinkScreen";
import { RefreshProvider } from "../../../context/refresh.context";

const ProfileStack = createNativeStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProfileScreen"
>;

interface IProfileProps {
  route: RouteProp<RootStackParamList, "ProfileScreen">;
  navigation: ProfileScreenNavigationProp;
}

const Profile: React.FC<IProfileProps> = ({ route, navigation }: any) => {
  const { getUserProfile } = useUserProfileStore();
  const { t } = useTranslation();

  const userData = getUserProfile();
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      contentStyle: {
        display: "flex",
        justifyContent: "center",
      },
      headerTitle: () => <AppTitle title={t("profile_title")} />,
      headerRight: () => {
        return (
          <View className="flex w-20 flex-row justify-between">
            <Button
              Icon={<ShareIcon />}
              onPress={() => onShareUserLink(userData.id)}
            />
            <Button
              Icon={<SettingsIcon />}
              onPress={() => navigation.push("SettingsScreenRoot")}
            />
          </View>
        );
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView className="justify-content: space-between h-full w-full flex-1 bg-gray-50 ">
      <CustomActivityIndicator isVisible={isLoading} />

      <View className="h-full ">
        <ProfileComponent
          route={route}
          userData={userData}
          navigation={navigation}
          setIsLoading={setIsLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const PersonalProfileScreen = () => {
  const { t } = useTranslation();
  return (
    <RefreshProvider>
      <ProfileStack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerTitleAlign: "center",
          headerShown: true,
        }}
      >
        <ProfileStack.Screen
          name="ProfileScreen"
          component={Profile}
          options={({ navigation }) => ({})}
        />
        <ProfileStack.Screen
          name="OtherUserProfileScreen"
          component={OtherUserProfileScreen}
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
        <ProfileStack.Screen
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

        <ProfileStack.Screen
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

        <ProfileStack.Screen
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
        <ProfileStack.Screen
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

        <ProfileStack.Screen
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

        {/* Screens that are in root navigation will stretch up to window size 
      and override the drawer layout in desktop view
      Screens put below will override the root navigation
       */}
        <ProfileStack.Screen
          name="SettingsScreenRoot"
          component={SettingsScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="EditPersonalProfileScreen"
          component={EditPersonalProfileScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => <AppTitle title="Edit profile" />,
            headerLeft: () => (
              <NavButton
                text="Back"
                onPress={() => navigation.goBack()}
                withBackIcon
              />
            ),
          })}
        />
        <ProfileStack.Screen
          name="AddHardSkillsScreen"
          component={AddHardSkillsScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="AddManualSkillScreen"
          component={AddManualSkillScreen}
          options={{
            headerShown: false,
          }}
        />
        <ProfileStack.Screen
          name="AddNewChallengeProgressScreen"
          component={AddNewChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="EditChallengeScreen"
          component={EditChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="EditChallengeProgressScreen"
          component={EditChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="ConfirmVideoCoachScreen"
          component={ConfirmVideoCoachScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="CoachRateCompanyChallengeScreen"
          component={CoachRateCompanyChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="CoachRateChallengeScreen"
          component={CoachRateChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="EditScheduleLinkScreen"
          component={EditScheduleLinkScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="ScheduleDetailScreen"
          component={ScheduleDetailScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="CoachCreateScheduleScreen"
          component={CoachCreateScheduleScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="EditScheduleScreen"
          component={EditScheduleScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <ProfileStack.Screen
          name="AddScheduleLinkScreen"
          component={AddScheduleLinkScreen}
          options={() => ({
            headerShown: false,
          })}
        />
      </ProfileStack.Navigator>
    </RefreshProvider>
  );
};

export default PersonalProfileScreen;
