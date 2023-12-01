import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../../../navigation/navigation.type";

import CompanyComponent from "../../../component/Profile/Company/CompanyProfileComponent";
import AppTitle from "../../../component/common/AppTitle";
import ButtonWithIcon from "../../../component/common/Buttons/ButtonWithIcon";
import { serviceGetMyProfile } from "../../../service/auth";
import { useUserProfileStore } from "../../../store/user-store";
import OtherUserProfileScreen from "../OtherUser/OtherUserProfileScreen";
import NavButton from "../../../component/common/Buttons/NavButton";

import { useGetListEmployee } from "../../../hooks/useGetCompany";
import ProgressCommentScreen from "../../ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen";
import PersonalChallengeDetailScreen from "../../ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import PersonalCoachChallengeDetailScreen from "../../ChallengesScreen/CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import OtherUserProfileChallengeDetailsScreen from "../OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import CompanyChallengeDetailScreen from "../../ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import { CrashlyticService } from "../../../service/crashlytic";

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

  const userData = getUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SafeAreaView className="justify-content: space-between h-full flex-1 bg-gray-50">
      {isLoading && <Spinner visible={isLoading} />}
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
    </CompanyStack.Navigator>
  );
};

export default CompanyProfileScreen;
