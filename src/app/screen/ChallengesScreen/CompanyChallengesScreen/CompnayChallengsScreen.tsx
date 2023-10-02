import { useEffect, useState } from "react";
import React from "react";
import clsx from "clsx";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useTranslation } from "react-i18next";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../navigation/navigation.type";

import ChallengeCardCompany from "../../../component/Card/ChallengeCard/ChallengeCardCompany";
import { IChallenge } from "../../../types/challenge";
import { useUserProfileStore } from "../../../store/user-store";
import SkeletonLoadingChallengesScreen from "../../../component/common/SkeletonLoadings/SkeletonLoadingChallengesScreen";
import { sortChallengeByStatus } from "../../../utils/common";
import { getChallengeByUserId } from "../../../service/challenge";

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
        {t("challenge_screen.empty_challenge") ||
          "You have no challenges at the moment."}
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
        {t("challenge_screen.to_create_new_challenge") ||
          "to create new challenge"}
      </Text>
    </View>
  );
};

const CompanyTab = () => {
  const [companyChallengesList, setCompanyChallengesList] = useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const { getUserProfile } = useUserProfileStore();
  const { t } = useTranslation();
  const userData = getUserProfile();
  const navigation = useNavigation<CompanyChallengesScreenNavigationProp>();

  const isFocused = useIsFocused();

  const fetchCompanyChallenges = async () => {
    try {
      const res = await getChallengeByUserId(userData?.id);
      // filter out certified challenges
      const personalChallenges = res.data.filter(
        (challenge) => challenge.type === "free"
      );
      setCompanyChallengesList(sortChallengeByStatus(personalChallenges));
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
    <View className="flex-1">
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
    </View>
  );
};

const CoachingTab = () => {
  const [companyChallengesList, setCompanyChallengesList] = useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const navigation = useNavigation<CompanyChallengesScreenNavigationProp>();

  const fetchCompanyChallenges = async () => {
    try {
      const res = await getChallengeByUserId(userData?.id);
      const coachChallenges = res.data.filter(
        (challenge) => challenge.type !== "free"
      );
      setCompanyChallengesList(sortChallengeByStatus(coachChallenges));
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
    <View className="flex-1">
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
    </View>
  );
};

const CompanyChallengsScreen = ({
  navigation,
}: {
  navigation: CompanyChallengesScreenNavigationProp;
}) => {
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: "company", title: "Company" },
    { key: "coaching", title: "Coaching" },
  ]);
  const { t } = useTranslation();
  const layout = useWindowDimensions();

  const MemoizedCompanyTab = React.memo(CompanyTab);
  const MemoizedCoachingTab = React.memo(CoachingTab);

  const renderScene = React.useCallback(({ route }) => {
    switch (route.key) {
      case "company":
        return <MemoizedCompanyTab />;
      case "coaching":
        return <MemoizedCoachingTab />;
      default:
        return null;
    }
  }, []);

  return (
    <SafeAreaView className={clsx("flex-1 bg-white")}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor="#34363F"
            inactiveColor="#6C6E76"
            style={{ backgroundColor: "#FFFFFF" }}
            indicatorStyle={{ backgroundColor: "#FF7B1C" }}
          />
        )}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        removeClippedSubviews={true}
        lazy={true}
      />
    </SafeAreaView>
  );
};

export default CompanyChallengsScreen;
