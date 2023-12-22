import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { serviceGetOtherUserData } from "../../../../service/user";
import { getChallengeById } from "../../../../service/challenge";

import { isObjectEmpty } from "../../../../utils/common";
import { useTabIndex } from "../../../../hooks/useTabIndex";
import { onShareChallengeLink } from "../../../../utils/shareLink.uitl";

import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
import { IUserData } from "../../../../types/user";
import { CHALLENGE_TABS_KEY } from "../../../../common/enum";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import CoachTab from "./CoachTab";
import ChatCoachTab from "./ChatCoachTab";
import CoachSkillsTab from "./CoachSkillsTab";
import CompanySkillsTab from "./CompanySkillsTab";
import Button from "../../../../component/common/Buttons/Button";
import CustomTabView from "../../../../component/common/Tab/CustomTabView";
import ProgressTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab";
import DescriptionTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab";
import IndividualCoachCalendarTab from "../../../../component/IndividualCoachCalendar/IndividualCoachCalendarTab";
import CompanyCoachCalendarTabCoachView from "../../CompanyChallengesScreen/ChallengeDetailScreen/CompanyCoachCalendarTabCoachView";

import ShareIcon from "../assets/share.svg";
import CustomActivityIndicator from "../../../../component/common/CustomActivityIndicator";

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
  const [challengeData, setChallengeData] = useState<IChallenge>(
    {} as IChallenge
  );
  const [coachData, setCoachData] = useState<IUserData>({} as IUserData);
  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(true);
  const [challengeState, setChallengeState] =
    useState<ICertifiedChallengeState>({} as ICertifiedChallengeState);
  const [shouldScreenRefresh, setShouldScreenRefresh] =
    useState<boolean>(false);

  const challengeId = route?.params?.challengeId;

  const isCompanyChallenge = (
    Array.isArray(challengeData?.owner)
      ? challengeData?.owner[0]
      : challengeData?.owner
  )?.companyAccount;
  const challengeCoach = challengeData?.coach;

  const { t } = useTranslation();
  const [tabRoutes, setTabRoutes] = useState([
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
  ]);

  const { index, setTabIndex } = useTabIndex({ tabRoutes, route });

  const isChallengeInProgress =
    (!isObjectEmpty(challengeState) &&
      challengeState.intakeStatus === "in-progress") ||
    challengeState.checkStatus === "in-progress" ||
    challengeState.closingStatus === "in-progress";

  const isChallengeCompleted = challengeData.status === "closed";
  const isChatChallenge = challengeData?.package?.type === "chat";
  const isVideoChallenge = challengeData?.package?.type === "videocall";

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

  useEffect(() => {
    const getCoachData = async () => {
      if (!challengeCoach) return;
      try {
        const response = await serviceGetOtherUserData(challengeCoach);
        setCoachData(response.data);
      } catch (error) {
        console.error("get coach data error", error);
      }
    };
    getCoachData();
  }, [challengeCoach]);

  useEffect(() => {
    if (shouldScreenRefresh) {
      setShouldScreenRefresh(false);
    }
  }, [shouldScreenRefresh]);

  useEffect(() => {
    const tempTabRoutes = [...tabRoutes];
    if (isVideoChallenge) {
      if (
        !tempTabRoutes.find(
          (tabRoute) => tabRoute.key === CHALLENGE_TABS_KEY.COACH_CALENDAR
        )
      ) {
        tempTabRoutes.push({
          key: CHALLENGE_TABS_KEY.COACH_CALENDAR,
          title: t("challenge_detail_screen.coach_calendar"),
        });
      }
    } else if (isChatChallenge) {
      if (
        !tempTabRoutes.find(
          (tabRoute) => tabRoute.key === CHALLENGE_TABS_KEY.CHAT
        )
      ) {
        tempTabRoutes.push({
          key: CHALLENGE_TABS_KEY.CHAT,
          title: t("challenge_detail_screen.chat_coach"),
        });
      }
    }
    setTabRoutes(tempTabRoutes);
  }, [isVideoChallenge, isChatChallenge]);

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
            setShouldScreenRefresh={setShouldScreenRefresh}
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
      case CHALLENGE_TABS_KEY.COACH_CALENDAR:
        return (
          <>
            {isCompanyChallenge ? (
              <CompanyCoachCalendarTabCoachView
                challengeId={challengeId}
                challengeState={challengeState}
                shouldScreenRefresh={shouldScreenRefresh}
              />
            ) : (
              <IndividualCoachCalendarTab
                coachData={coachData}
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
      <CustomActivityIndicator isVisible={isScreenLoading} />
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
