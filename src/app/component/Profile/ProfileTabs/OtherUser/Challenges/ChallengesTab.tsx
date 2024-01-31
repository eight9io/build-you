import React, { FC, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import {
  NavigationProp,
  // StackActions,
  // useIsFocused,
  useNavigation,
} from "@react-navigation/native";

import { getChallengeByUserId } from "../../../../../service/challenge";
import { IChallenge, IChallengeOwner } from "../../../../../types/challenge";
import ChallengeCard from "../../../../Card/ChallengeCard/ChallengeCard";
import { RootStackParamList } from "../../../../../navigation/navigation.type";
import GlobalDialogController from "../../../../common/Dialog/GlobalDialog/GlobalDialogController";
import { sortChallengeByStatus } from "../../../../../utils/common";
import { useUserProfileStore } from "../../../../../store/user-store";

interface IChallengesTabProps {
  userId: string | null | undefined;
  isCurrentUserInCompany?: boolean | null;
  isCurrentUserInSameCompanyWithViewingUser?: boolean | null;
  isCompanyAccount: boolean | undefined | null;
}

const ChallengesTab: FC<IChallengesTabProps> = ({
  userId,
  isCompanyAccount = false,
  isCurrentUserInSameCompanyWithViewingUser = false,
  isCurrentUserInCompany = null,
}) => {
  const { t } = useTranslation();
  const [otherUserChallenge, setOtherUserChallenge] = React.useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  // const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { getUserProfile, getUserAllChallengeIds } = useUserProfileStore();
  const userProfile = getUserProfile();
  const currentUserAllChallengeIds = getUserAllChallengeIds();

  useEffect(() => {
    if (!userId || isCurrentUserInCompany == null) return;
    setIsLoading(true);
    getChallengeByUserId(userId)
      .then((res) => {
        let challengeList = res.data.flat() as IChallenge[];
        const originalChallengeList = res.data.flat() as IChallenge[];

        if (!isCurrentUserInCompany) {
          challengeList = challengeList.filter(
            (item: IChallenge) => item?.public == true || item?.public == null
          );
        }
        // if current user is company, add back the challenge that is not public when the owner is the current user
        challengeList = challengeList.concat(
          originalChallengeList.filter(
            (item: IChallenge) =>
              item?.public == false &&
              (item?.owner as IChallengeOwner)?.id === userProfile?.id
          )
        );
        if (isCurrentUserInSameCompanyWithViewingUser) {
          challengeList = originalChallengeList;
        }
        setOtherUserChallenge(sortChallengeByStatus(challengeList));
      })
      .catch(() => {
        GlobalDialogController.showModal({
          title: t("dialog.err_title"),
          message:
            (t("error_general_message") as string) || "Something went wrong",
          button: t("dialog.ok"),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId, isCurrentUserInCompany]);

  if (!userId) {
    return (
      <View>
        <Text>{t("error_general_message")}</Text>
      </View>
    );
  }

  return (
    <View className="h-full px-2">
      {otherUserChallenge.length > 0 && (
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          className="px-4 pt-4"
          data={otherUserChallenge}
          renderItem={({ item }: { item: IChallenge }) => (
            <ChallengeCard
              item={item}
              isCompanyAccount={isCompanyAccount}
              isFromOtherUser
              imageSrc={`${item.image}`}
              navigation={navigation}
              currentUserAllChallengeIds={currentUserAllChallengeIds}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {otherUserChallenge.length === 0 && !isLoading && (
        <View className=" h-full w-full flex-1 items-center justify-center pt-44">
          <Text className="text-lg text-gray-400 ">
            {t("company_profile_screen.no_challenge")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ChallengesTab;
