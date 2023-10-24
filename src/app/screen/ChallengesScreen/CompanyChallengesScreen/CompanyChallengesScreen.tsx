import { useEffect, useState } from "react";
import clsx from "clsx";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView, View, Text, FlatList } from "react-native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { IChallenge } from "../../../types/challenge";
import { RootStackParamList } from "../../../navigation/navigation.type";

import httpInstance from "../../../utils/http";
import { sortChallengeByStatusFromResponse } from "../../../utils/common";

import { useUserProfileStore } from "../../../store/user-store";

import AppTitle from "../../../component/common/AppTitle";
import NavButton from "../../../component/common/Buttons/NavButton";
import ProgressCommentScreen from "../ProgressCommentScreen/ProgressCommentScreen";
import ChallengeCardCompany from "../../../component/Card/ChallengeCard/ChallengeCardCompany";
import OtherUserProfileScreen from "../../ProfileScreen/OtherUser/OtherUserProfileScreen";
import CompanyChallengeDetailScreen from "./CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import SkeletonLoadingChallengesScreen from "../../../component/common/SkeletonLoadings/SkeletonLoadingChallengesScreen";
import OtherUserProfileChallengeDetailsScreen from "../../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";

const CompanyChallengesStack = createNativeStackNavigator<RootStackParamList>();

type CompanyChallengesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompanyChallengesScreen"
>;

const EmptyChallenges = ({
  navigation,
}: {
  navigation: CompanyChallengesScreenNavigationProp;
}) => {
  const { t } = useTranslation();
  return (
    <View className={clsx("flex h-3/4 flex-col items-center justify-center")}>
      <Text className={clsx("text-lg")}>
        {t("empty_challenge") || "You have no challenges at the moment."}
      </Text>
      <Text className={clsx("text-lg")}>
        {t("click") || "Click"}
        <Text
          className={clsx("text-primary-default")}
          onPress={() => navigation.navigate("CreateCompanyChallengeScreen")}
        >
          {" "}
          {t("create") || "Create"}{" "}
        </Text>
        {t("to_create_new_challenge") || "to create new challenge"}
      </Text>
    </View>
  );
};

const CompanyChallenges = ({
  navigation,
}: {
  navigation: CompanyChallengesScreenNavigationProp;
}) => {
  const [companyChallengesList, setCompanyChallengesList] = useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const isFocused = useIsFocused();

  const fetchCompanyChallenges = async () => {
    try {
      const res = await httpInstance.get(`/challenge/all/${userData?.id}`);
      setCompanyChallengesList(sortChallengeByStatusFromResponse(res));
      setTimeout(() => {
        setIsLoading(false);
        setIsError(false);
      }, 500);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!isFocused) return;
    fetchCompanyChallenges();
  }, [isFocused]);

  return (
    <SafeAreaView className={clsx("flex-1 bg-white")}>
      {isLoading && <SkeletonLoadingChallengesScreen />}
      {!isLoading && !isError && (
        <View className={clsx("h-full w-full flex-1 bg-gray-50")}>
          {companyChallengesList.length === 0 ? (
            <EmptyChallenges navigation={navigation} />
          ) : (
            <FlatList
              className="px-4 pt-4"
              data={companyChallengesList}
              renderItem={({ item }: { item: IChallenge }) => (
                <ChallengeCardCompany
                  item={item}
                  imageSrc={item?.image}
                  navigation={navigation}
                  isCompanyAccount={userData?.companyAccount ? true : false}
                />
              )}
              keyExtractor={(item) => item.id}
              ListFooterComponent={<View className="h-20" />}
              refreshing={isLoading}
              onRefresh={fetchCompanyChallenges}
            />
          )}
        </View>
      )}
      {isError && (
        <View
          className={clsx("flex h-3/4 flex-col items-center justify-center")}
        >
          <Text className={clsx("text-md font-medium")}>
            {t("error_general_message") ||
              "Something went wrong. Please try again later."}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const CompanyChallengesScreen = () => {
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
        component={CompanyChallenges}
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
    </CompanyChallengesStack.Navigator>
  );
};

export default CompanyChallengesScreen;
