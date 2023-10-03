import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";
import { useTranslation } from "react-i18next";

import { onShareChallengeLink } from "../../../../utils/shareLink.uitl";

import { useUserProfileStore } from "../../../../store/user-store";

import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import TabView from "../../../../component/common/Tab/TabView";
import Button from "../../../../component/common/Buttons/Button";

import ShareIcon from "../assets/share.svg";

import ProgressTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab";
import DescriptionTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab";
import CoachTab from "./CoachTab";
import CoachSkillsTab from "./CoachSkillsTab";
import { ChatCoachTab } from "./ChatCoachTab";
import { getChallengeById } from "../../../../service/challenge";
import { isObjectEmpty } from "../../../../utils/common";

type CoachChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PersonalCoachChallengeDetailScreen"
>;

interface IRightCoachChallengeDetailOptionsProps {
  challengeId: string;
}

export const RightCoachChallengeDetailOptions: FC<
  IRightCoachChallengeDetailOptionsProps
> = ({ challengeId }) => {
  const onShare = () => {
    onShareChallengeLink(challengeId);
  };
  return (
    <View>
      <View className="-mt-1 flex flex-row items-center">
        <View className="pl-4 pr-2">
          <Button Icon={<ShareIcon />} onPress={onShare} />
        </View>
      </View>
    </View>
  );
};

const PersonalCoachChallengeDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: CoachChallengeDetailScreenNavigationProp;
}) => {
  const [index, setIndex] = useState<number>(0);
  const [challengeData, setChallengeData] = useState<IChallenge>(
    {} as IChallenge
  );
  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(true);
  const [challengeState, setChallengeState] =
    useState<ICertifiedChallengeState>({} as ICertifiedChallengeState);

  const challengeId = route?.params?.challengeId;

  const { t } = useTranslation();

  const isChallengeInProgress =
    !isObjectEmpty(challengeState) &&
    challengeState.intakeStatus !== "init" &&
    challengeState.intakeStatus !== "open" &&
    challengeState.closingStatus !== "closed";

  const isChallengeCompleted = challengeData.status === "closed";

  useLayoutEffect(() => {
    // Set header options, must set it manually to handle the onPress event inside the screen
    navigation.setOptions({
      headerRight: () => (
        <RightCoachChallengeDetailOptions challengeId={challengeId} />
      ),
    });
  }, []);

  const getChallengeData = async () => {
    setIsScreenLoading(true);
    try {
      await getChallengeById(challengeId).then((res) => {
        setChallengeData(res.data);
      });
    } catch (error) {
      console.log("CoachChallengeDetailScreen - Error fetching data:", error);
    }
    setIsScreenLoading(false);
  };

  useEffect(() => {
    getChallengeData();
  }, []);

  const CHALLENGE_TABS_TITLE_TRANSLATION = [
    t("challenge_detail_screen.progress"),
    t("challenge_detail_screen.description"),
    t("challenge_detail_screen.coach"),
    t("challenge_detail_screen.skills"),
    t("challenge_detail_screen.chat_coach"),
  ];

  return (
    <SafeAreaView className="bg-[#FAFBFF]">
      {isScreenLoading && <Spinner visible={isScreenLoading} />}
      <View className="flex h-full flex-col bg-white pt-2">
        <View className="flex flex-row items-center justify-between px-4">
          <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
            <View className="flex-1">
              <Text className="text-2xl font-semibold">
                {challengeData?.goal}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-2 flex flex-1">
          <TabView
            titles={CHALLENGE_TABS_TITLE_TRANSLATION}
            activeTabIndex={index}
            setActiveTabIndex={setIndex}
          >
            <ProgressTab
              isJoined={false}
              isChallengeCompleted={false}
              challengeData={challengeData}
            />
            <DescriptionTab challengeData={challengeData} />

            <CoachTab
              coachID={challengeData?.coach}
              challengeId={challengeId}
              challengeState={challengeState}
              setChallengeState={setChallengeState}
              isChallengeCompleted={isChallengeCompleted}
            />
            <CoachSkillsTab
              challengeData={challengeData}
              challengeState={challengeState}
            />
            {challengeData?.type === "certified" && (
              <ChatCoachTab
                challengeData={challengeData}
                isChallengeInProgress={isChallengeInProgress}
              />
            )}
          </TabView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PersonalCoachChallengeDetailScreen;
