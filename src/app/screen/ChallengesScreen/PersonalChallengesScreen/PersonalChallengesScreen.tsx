import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useWindowDimensions,
  View,
  SafeAreaView,
  Text,
  FlatList,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { IChallenge } from "../../../types/challenge";
import { RootStackParamList } from "../../../navigation/navigation.type";

import {
  getChallengeByUserId,
  serviceGetAllChallengeByCoachId,
} from "../../../service/challenge";
import { sortChallengeByStatus } from "../../../utils/common";

import { useUserProfileStore } from "../../../store/user-store";
import CurrentUserChallengeCard from "../../../component/Card/ChallengeCard/CurrentUserChallengeCard";
import SkeletonLoadingChallengesScreen from "../../../component/common/SkeletonLoadings/SkeletonLoadingChallengesScreen";
import { useNewCreateOrDeleteChallengeStore } from "../../../store/new-challenge-create-store";
import CertifiedChallengeCard from "../../../component/Card/ChallengeCard/CertifiedChallengeCard";

type PersonalChallengesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PersonalChallengesScreen"
>;

const EmptyChallenges = ({
  navigation,
  type,
}: {
  navigation: PersonalChallengesScreenNavigationProp;
  type?: "free" | "certified";
}) => {
  const { t } = useTranslation();

  const handleNavigateToCreateChallengeScreen = () => {
    if (type === "free") navigation.navigate("CreateChallengeScreen");
    else if (type === "certified")
      navigation.navigate("CreateCertifiedChallengeScreen");
    else navigation.navigate("CreateChallengeScreen");
  };
  return (
    <View className={clsx("flex h-3/4 flex-col items-center justify-center")}>
      <Text className={clsx("text-lg")}>
        {t("challenge_screen.empty_challenge")}
      </Text>
      <Text className={clsx("text-lg")}>
        {t("click") || "Click"}
        <Text
          className={clsx("text-primary-default")}
          onPress={handleNavigateToCreateChallengeScreen}
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

const CoachEmptyChallenges = ({
  navigation,
}: {
  navigation: PersonalChallengesScreenNavigationProp;
}) => {
  const { t } = useTranslation();

  const handleNavigateToCreateChallengeScreen = () => {
    navigation.navigate("CreateChallengeScreen");
  };
  return (
    <View className={clsx("flex h-3/4 flex-col items-center justify-center")}>
      <Text className={clsx("text-lg")}>
        {t("challenge_screen.coach_empty_challenge") ||
          "You have no challenges at the moment."}
      </Text>
      <Text className={clsx("text-lg")}>
        {t("challenge_screen.coach_empty_challenge_description") ||
          "You have to be assinged for a challenge by the admin"}
      </Text>
    </View>
  );
};

const PersonalTab = () => {
  const [personalChallengesList, setPersonalChallengesList] = useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingError, setIsFetchingError] = useState<boolean>(false);

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  const navigation = useNavigation<PersonalChallengesScreenNavigationProp>();

  const fetchChallengeData = async () => {
    try {
      const res = await getChallengeByUserId(userData?.id);
      // filter out certified challenges
      const personalChallenges = res.data.filter(
        (challenge) => challenge.type === "free"
      );
      setPersonalChallengesList(sortChallengeByStatus(personalChallenges));
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setIsFetchingError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
  }, []);

  return (
    <View className="flex-1">
      {isLoading && <SkeletonLoadingChallengesScreen />}
      {!isLoading && !isFetchingError && (
        <View className={clsx("h-full w-full flex-1 bg-gray-50")}>
          {personalChallengesList.length === 0 ? (
            <EmptyChallenges navigation={navigation} type="free" />
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
              ListFooterComponent={<View className="h-20" />}
              refreshing={isLoading}
              onRefresh={fetchChallengeData}
            />
          )}
        </View>
      )}
      {!isLoading && isFetchingError && (
        <View
          className={clsx("flex h-full flex-col items-center justify-center")}
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

const CertifiedTab = () => {
  const [coachChallengesList, setCoachChallengesList] = useState<IChallenge[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingError, setIsFetchingError] = useState<boolean>(false);

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const navigation = useNavigation<PersonalChallengesScreenNavigationProp>();

  const fetchChallengeData = async () => {
    try {
      const res = await getChallengeByUserId(userData?.id);
      const coachChallenges = res.data.filter(
        (challenge) => challenge.type !== "free"
      );
      setCoachChallengesList(sortChallengeByStatus(coachChallenges));
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setIsFetchingError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
  }, []);

  return (
    <View className="flex-1">
      {isLoading && <SkeletonLoadingChallengesScreen />}
      {!isLoading && !isFetchingError && (
        <View className={clsx("h-full w-full flex-1 bg-gray-50")}>
          {coachChallengesList?.length === 0 ? (
            <EmptyChallenges navigation={navigation} type="certified" />
          ) : (
            <FlatList
              className="px-4 pt-4"
              data={coachChallengesList}
              renderItem={({ item }: { item: IChallenge }) => (
                <CurrentUserChallengeCard
                  item={item}
                  imageSrc={item?.image}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => item.id}
              ListFooterComponent={<View className="h-20" />}
              refreshing={isLoading}
              onRefresh={fetchChallengeData}
            />
          )}
        </View>
      )}
      {!isLoading && isFetchingError && (
        <View
          className={clsx("flex h-full flex-col items-center justify-center")}
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

const CoachTab = () => {
  const [coachChallengesList, setCoachChallengesList] = useState<IChallenge[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingError, setIsFetchingError] = useState<boolean>(false);

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  // current user is coach
  const userData = getUserProfile();
  const navigation = useNavigation<PersonalChallengesScreenNavigationProp>();

  const fetchChallengeData = async () => {
    try {
      const res = await serviceGetAllChallengeByCoachId(userData?.id);
      setCoachChallengesList(sortChallengeByStatus(res.data));
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setIsFetchingError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
  }, []);

  return (
    <View className="flex-1">
      {isLoading && <SkeletonLoadingChallengesScreen />}
      {!isLoading && !isFetchingError && (
        <View className={clsx("h-full w-full flex-1 bg-gray-50")}>
          {coachChallengesList.length === 0 ? (
            <CoachEmptyChallenges navigation={navigation} />
          ) : (
            <FlatList
              className="px-4 pt-4"
              data={coachChallengesList}
              renderItem={({ item }: { item: IChallenge }) => (
                <CertifiedChallengeCard
                  item={item}
                  imageSrc={item?.image}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => item.id}
              ListFooterComponent={<View className="h-20" />}
              refreshing={isLoading}
              onRefresh={fetchChallengeData}
            />
          )}
        </View>
      )}
      {!isLoading && isFetchingError && (
        <View
          className={clsx("flex h-full flex-col items-center justify-center")}
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

const PersonalChallengesScreen = ({
  navigation,
}: {
  navigation: PersonalChallengesScreenNavigationProp;
}) => {
  const [index, setIndex] = useState<number>(0);
  const [routes, setRoutes] = useState([
    { key: "personal", title: "Personal" },
    { key: "certified", title: "Certified" },
  ]);

  const { getUserProfile } = useUserProfileStore();
  const { getNewChallengeId, getDeletedChallengeId } =
    useNewCreateOrDeleteChallengeStore();
  const newChallengeId = getNewChallengeId();
  const deletedChallengeId = getDeletedChallengeId();

  const userData = getUserProfile();
  const isUserCoach = userData?.isCoach;

  useEffect(() => {
    if (isUserCoach) {
      setRoutes([
        { key: "personal", title: "Personal" },
        { key: "certified", title: "Certified" },
        {
          key: "coach",
          title: "Coach",
        },
      ]);
    }
  }, [isUserCoach]);

  const layout = useWindowDimensions();

  const MemoizedPersonalTab = React.memo(PersonalTab);
  const MemoizedCertifiedTab = React.memo(CertifiedTab);
  const MemoizedCoachTab = React.memo(CoachTab);

  const renderScene = React.useCallback(
    ({ route }) => {
      switch (route.key) {
        case "personal":
          return <MemoizedPersonalTab />;
        case "certified":
          return <MemoizedCertifiedTab />;
        case "coach":
          return <MemoizedCoachTab />;
        default:
          return null;
      }
    },
    [newChallengeId, deletedChallengeId]
  );

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

export default PersonalChallengesScreen;
