import { useEffect, useState } from "react";
import clsx from "clsx";
import { SafeAreaView, View, Text, FlatList } from "react-native";
import { useTranslation } from "react-i18next";

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/navigation.type";

import CompanyChallengeDetailScreen from "./CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import ShareIcon from "../../../../../assets/svg/share.svg";
import ChallengeCard from "../../../component/Card/ChallengeCard/ChallengeCard";
import { t } from "i18next";
import AppTitle from "../../../component/common/AppTitle";
import NavButton from "../../../component/common/Buttons/NavButton";
import { IChallenge } from "../../../types/challenge";
import { useUserProfileStore } from "../../../store/user-store";
import { useIsFocused } from "@react-navigation/native";
import httpInstance from "../../../utils/http";
import SkeletonLoadingChallengesScreen from "../../../component/common/SkeletonLoadings/SkeletonLoadingChallengesScreen";
import { sortChallengeByStatusFromResponse } from "../../../utils/common";
import ProgressCommentScreen from "../ProgressCommentScreen/ProgressCommentScreen";
import OtherUserProfileScreen from "../../ProfileScreen/OtherUser/OtherUserProfileScreen";
import OtherUserProfileChallengeDetailsScreen from "../../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen";
import Button from "../../../component/common/Buttons/Button";

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
  return (
    <View className={clsx("flex h-3/4 flex-col items-center justify-center")}>
      <Text className={clsx("text-lg")}>
        You have no challenges at the moment.
      </Text>
      <Text className={clsx("text-lg")}>
        Click
        <Text
          className={clsx("text-primary-default")}
          onPress={() => navigation.navigate("CreateCompanyChallengeScreen")}
        >
          {" "}
          Create{" "}
        </Text>
        to Create new challenge.
      </Text>
    </View>
  );
};

const CompanyChallenges = ({
  navigation,
}: {
  navigation: CompanyChallengesScreenNavigationProp;
}) => {
  const { t } = useTranslation();
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
                <ChallengeCard
                  item={item}
                  imageSrc={item?.image}
                  navigation={navigation}
                  isCompanyAccount={userData?.companyAccount ? true : false}
                />
              )}
              keyExtractor={(item) => item.id}
              ListFooterComponent={<View className="h-4" />}
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
            Something went wrong.
          </Text>
          <Text className={clsx("text-md font-medium")}>
            Please try again later.
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
