import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";

import httpInstance from "../../../utils/http";
import { IChallenge } from "../../../types/challenge";
import { useUserProfileStore } from "../../../store/user-store";
import { RootStackParamList } from "../../../navigation/navigation.type";

import PersonalChallengeDetailScreen from "./PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import SkeletonLoadingChallengesScreen from "../../../component/common/SkeletonLoadings/SkeletonLoadingChallengesScreen";

import CurrentUserChallengeCard from "../../../component/Card/ChallengeCard/CurrentUserChallengeCard";
import AppTitle from "../../../component/common/AppTitle";
import NavButton from "../../../component/common/Buttons/NavButton";
import OtherUserProfileScreen from "../../ProfileScreen/OtherUser/OtherUserProfileScreen";

import OtherUserProfileChallengeDetailsScreen from "../../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen";
import { sortChallengeByStatusFromResponse } from "../../../utils/common";
import ProgressCommentScreen from "../ProgressCommentScreen/ProgressCommentScreen";

const PersonalChallengesStack =
  createNativeStackNavigator<RootStackParamList>();

type PersonalChallengesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PersonalChallengesScreen"
>;

const EmptyChallenges = ({
  navigation,
}: {
  navigation: PersonalChallengesScreenNavigationProp;
}) => {
  return (
    <View className={clsx("flex h-3/4 flex-col items-center justify-center")}>
      <Text className={clsx("text-lg")}>
        You have no challenges at the moment.
      </Text>
      <Text className={clsx("text-lg")}>
        Click
        <Text
          className={clsx("text-primary-default")}
          onPress={() => navigation.navigate("CreateChallengeScreen")}
        >
          {" "}
          Create{" "}
        </Text>
        to Create new challenge.
      </Text>
    </View>
  );
};

const PersonalChallenges = ({
  navigation,
}: {
  navigation: PersonalChallengesScreenNavigationProp;
}) => {
  const [personalChallengesList, setPersonalChallengesList] = useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingError, setIsFetchingError] = useState<boolean>(false);
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const res = await httpInstance.get(`/challenge/all/${userData?.id}`);
      setPersonalChallengesList(sortChallengeByStatusFromResponse(res));
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setIsFetchingError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFocused) return;
    fetchData();
  }, [isFocused]);

  return (
    <SafeAreaView className={clsx("flex-1 bg-white")}>
      {isLoading && <SkeletonLoadingChallengesScreen />}
      {!isLoading && !isFetchingError && (
        <View className={clsx("h-full w-full flex-1 bg-gray-50 pb-[65px]")}>
          {personalChallengesList.length === 0 ? (
            <EmptyChallenges navigation={navigation} />
          ) : (
            <FlatList
              className="px-4 pt-4"
              data={personalChallengesList}
              renderItem={({ item }: { item: IChallenge }) => (
                <CurrentUserChallengeCard
                  item={item}
                  imageSrc={item?.image}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => item.id}
              ListFooterComponent={<View className="h-4" />}
              refreshing={isLoading}
              onRefresh={fetchData}
            />
          )}
        </View>
      )}
      {!isLoading && isFetchingError && (
        <View
          className={clsx("flex h-full flex-col items-center justify-center")}
        >
          <Text className={clsx("text-md font-medium")}>
            Something went wrong.
          </Text>
          <Text className={clsx("text-md font-medium")}>
            Please try again later or contact us.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const PersonalChallengesNavigator = () => {
  const { t } = useTranslation();
  return (
    <PersonalChallengesStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerShown: true,
      }}
    >
      <PersonalChallengesStack.Screen
        name="PersonalChallengesScreen"
        component={PersonalChallenges}
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
    </PersonalChallengesStack.Navigator>
  );
};

export default PersonalChallengesNavigator;
