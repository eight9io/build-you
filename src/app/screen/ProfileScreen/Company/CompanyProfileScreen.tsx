import React, { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, View } from "react-native";

import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../navigation/navigation.type";

import AppTitle from "../../../component/common/AppTitle";
import Button from "../../../component/common/Buttons/Button";
import NavButton from "../../../component/common/Buttons/NavButton";
import OtherUserProfileScreen from "../OtherUser/OtherUserProfileScreen";
import ButtonWithIcon from "../../../component/common/Buttons/ButtonWithIcon";
import CompanyComponent from "../../../component/Profile/Company/CompanyProfileComponent";

import { serviceGetMyProfile } from "../../../service/auth";
import { useUserProfileStore } from "../../../store/user-store";
import { CrashlyticService } from "../../../service/crashlytic";
import { useGetListEmployee } from "../../../hooks/useGetCompany";
import { onShareUserLink } from "../../../utils/shareLink.util";

import PersonalCoachChallengeDetailScreen from "../../ChallengesScreen/CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import CompanyChallengeDetailScreen from "../../ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import PersonalChallengeDetailScreen from "../../ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import ProgressCommentScreen from "../../ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen";
import OtherUserProfileChallengeDetailsScreen from "../OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import CustomActivityIndicator from "../../../component/common/CustomActivityIndicator";

import ShareIcon from "../../../../../assets/svg/share.svg";
import SettingsIcon from "../../../component/common/Buttons/ButtonWithIcon/asset/settings.svg";
import SettingsScreen from "../../SettingsScreen/SettingsScreen";
import EditCompanyProfileScreen from "./EditCompanyProfileScreen/EditCompanyProfileScreen";

const CompanyStack = createNativeStackNavigator<RootStackParamList>();

type CompanyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompanyProfileScreen"
>;

interface ICompanyProps {
  navigation: CompanyScreenNavigationProp;
  route: RouteProp<RootStackParamList, "CompanyProfileScreen">;
}

const Company: React.FC<ICompanyProps> = ({ navigation, route }) => {
  useGetListEmployee();
  const { t } = useTranslation();
  const [shouldNotLoadOnFirstFocus, setShouldNotLoadOnFirstFocus] =
    useState<boolean>(true);

  const { setUserProfile, getUserProfile } = useUserProfileStore();
  useEffect(() => {
    if (shouldNotLoadOnFirstFocus) {
      setShouldNotLoadOnFirstFocus(false);
      return;
    }
    useGetListEmployee();
    serviceGetMyProfile()
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.error("err", err);
        CrashlyticService({
          errorType: "Fetch My Company Profile Error",
          error: err,
        });
      });
  }, []);

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

  const userData = getUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SafeAreaView className="justify-content: space-between h-full flex-1 bg-gray-50">
      <CustomActivityIndicator isVisible={isLoading} />
      <View className="h-full ">
        <CompanyComponent
          route={route}
          userData={userData}
          navigation={navigation}
          setIsLoading={setIsLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const CompanyProfileScreen = () => {
  const { t } = useTranslation();

  return (
    <CompanyStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerShown: true,
      }}
    >
      <CompanyStack.Screen
        name="CompanyProfileScreen"
        component={Company}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title={t("profile_title")} />,
          headerRight: (props) => (
            <ButtonWithIcon
              icon="setting"
              onPress={() => navigation.push("SettingsScreenRoot")}
              testID="settings_btn"
            />
          ),
        })}
      />
      <CompanyStack.Screen
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
      <CompanyStack.Screen
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

      <CompanyStack.Screen
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

      <CompanyStack.Screen
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
      <CompanyStack.Screen
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

      <CompanyStack.Screen
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
      <CompanyStack.Screen
        name="SettingsScreenRoot"
        component={SettingsScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <CompanyStack.Screen
        name="EditCompanyProfileScreen"
        component={EditCompanyProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title="Edit profile" />,
          headerLeft: () => (
            <NavButton
              text={t("button.back") || "Back"}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
    </CompanyStack.Navigator>
  );
};

export default CompanyProfileScreen;
