import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { SafeAreaView, View, Text } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";
import { useTranslation } from "react-i18next";

import { onShareChallengeLink } from "../../../../utils/shareLink.uitl";

import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import Button from "../../../../component/common/Buttons/Button";

import ShareIcon from "../assets/share.svg";

import ProgressTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab";
import DescriptionTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab";
import CoachTab from "./CoachTab";
import CoachSkillsTab from "./CoachSkillsTab";
import ChatCoachTab from "./ChatCoachTab";
import { getChallengeById } from "../../../../service/challenge";
import { useNotificationStore } from "../../../../store/notification-store";
import { isObjectEmpty } from "../../../../utils/common";
import CustomTabView from "../../../../component/common/Tab/CustomTabView";
import { CHALLENGE_TABS_KEY } from "../../../../common/enum";
import CompanySkillsTab from "./CompanySkillsTab";

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
  const { setShouldDisplayNewMessageNotification } = useNotificationStore();
  const [challengeState, setChallengeState] =
    useState<ICertifiedChallengeState>({} as ICertifiedChallengeState);

  const challengeId = route?.params?.challengeId;

  const isCompanyChallenge = challengeData?.owner?.[0].companyAccount;

  const { t } = useTranslation();
  const [tabRoutes] = useState([
    {
      key: CHALLENGE_TABS_KEY.PROGRESS,
      title: t("challenge_detail_screen.progress"),
    },
    {
      key: CHALLENGE_TABS_KEY.DESCRIPTION,
      title: t("challenge_detail_screen.description"),
    },
    {
      key: CHALLENGE_TABS_KEY.COACH,
      title: t("challenge_detail_screen.coach"),
    },
    {
      key: CHALLENGE_TABS_KEY.SKILLS,
      title: t("challenge_detail_screen.skills"),
    },
    {
      key: CHALLENGE_TABS_KEY.CHAT,
      title: t("challenge_detail_screen.chat_coach"),
    },
  ]);

  const setTabIndex = (nextIndex: number) => {
    if (index === nextIndex) return;
    if (chatTabIndex === null || chatTabIndex === undefined)
      return setIndex(nextIndex);
    if (nextIndex === chatTabIndex)
      // Disable new message notification if user switch to chat tab
      setShouldDisplayNewMessageNotification(false);
    else if (index === chatTabIndex)
      // Enable new message notification if user switch to another tab from chat tab
      setShouldDisplayNewMessageNotification(true);

    setIndex(nextIndex);
  };

  const chatTabIndex = useMemo(() => {
    const index = tabRoutes.findIndex(
      (route) => route.key === CHALLENGE_TABS_KEY.CHAT
    );
    if (index === -1) return null;
    return index;
  }, [t]);

  useEffect(() => {
    if (chatTabIndex && route?.params?.hasNewMessage) {
      // Set chat tab as active tab if this screen is opened from new message notification
      setTabIndex(chatTabIndex);
    }
  }, [chatTabIndex, route]);

  const isChallengeInProgress =
    (!isObjectEmpty(challengeState) &&
      challengeState.intakeStatus === "in-progress") ||
    challengeState.checkStatus === "in-progress" ||
    challengeState.closingStatus === "in-progress";

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

  const renderScene = ({ route }) => {
    switch (route.key) {
      case CHALLENGE_TABS_KEY.PROGRESS:
        return (
          <ProgressTab
            isJoined={false}
            isChallengeCompleted={false}
            challengeData={challengeData}
          />
        );
      case CHALLENGE_TABS_KEY.DESCRIPTION:
        return <DescriptionTab challengeData={challengeData} />;
      case CHALLENGE_TABS_KEY.COACH:
        return (
          <CoachTab
            coachID={challengeData?.coach}
            challengeId={challengeId}
            challengeState={challengeState}
            setChallengeState={setChallengeState}
            isChallengeCompleted={isChallengeCompleted}
          />
        );
      case CHALLENGE_TABS_KEY.SKILLS:
        return (
          <>
            {isCompanyChallenge ? (
              <CompanySkillsTab
                challengeData={challengeData}
                challengeState={challengeState}
              />
            ) : (
              <CoachSkillsTab
                challengeData={challengeData}
                challengeState={challengeState}
              />
            )}
          </>
        );
      case CHALLENGE_TABS_KEY.CHAT:
        return (
          <>
            {challengeData?.type === "certified" && (
              <ChatCoachTab
                challengeData={challengeData}
                isChallengeInProgress={isChallengeInProgress}
              />
            )}
          </>
        );
    }
  };

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

        <View className="mt-2 flex flex-1 bg-gray-veryLight">
          <CustomTabView
            routes={tabRoutes}
            renderScene={renderScene}
            index={index}
            setIndex={setTabIndex}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PersonalCoachChallengeDetailScreen;
