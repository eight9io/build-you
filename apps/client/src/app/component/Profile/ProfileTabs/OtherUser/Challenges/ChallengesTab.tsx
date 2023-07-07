import React, { FC, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { getChallengeByUserId } from '../../../../../service/challenge';
import { IChallenge } from '../../../../../types/challenge';
import ChallengeCard from '../../../../Card/ChallengeCard/ChallengeCard';
import { RootStackParamList } from '../../../../../navigation/navigation.type';
import GolbalDialogController from '../../../../common/Dialog/GlobalDialogController';

interface IChallengesTabProps {
  userId: string | null | undefined;
  isCurrentUserInCompany?: boolean;
  isCompanyAccount: boolean | undefined | null;
}

const ChallengesTab: FC<IChallengesTabProps> = ({
  userId,
  isCompanyAccount = false,
  isCurrentUserInCompany = false,
}) => {
  const { t } = useTranslation();
  const [otherUserChallenge, setOtherUserChallenge] = React.useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    getChallengeByUserId(userId)
      .then((res) => {
        //TODO: if current user is in company, show all challenges, else show only public challenges
        // if (!isCurrentUserInCompany) {
        //   res.data = res.data.filter((item) => item.public);
        // }
        setOtherUserChallenge(res.data);
      })
      .catch((err) => {
        GolbalDialogController.showModal({
          title: 'Error',
          message: 'Something went wrong. Please try again later.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  if (!userId) {
    return (
      <View>
        <Text>{t('error_general_message')}</Text>
      </View>
    );
  }

  const handleNavigateToChallengeDetail = (challengeId: string) => {
    navigation.navigate('OtherUserProfileChallengeDetailsScreen', {
      challengeId,
      isCompanyAccount: isCompanyAccount ? true : false,
    });
  };

  return (
    <View className="h-full  px-4">
      {otherUserChallenge.length > 0 && (
        <FlatList
          className="px-4 pt-4"
          data={otherUserChallenge}
          renderItem={({ item }: { item: IChallenge }) => (
            <ChallengeCard
              item={item}
              isCompanyAccount={isCompanyAccount}
              isFromOtherUser
              imageSrc={`${item.image}`}
              handlePress={() => handleNavigateToChallengeDetail(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {otherUserChallenge.length === 0 && !isLoading && (
        <View className=" h-full flex-1 items-center justify-center pt-4">
          <Text className="text-lg text-gray-400 ">
            {t('company_profile_screen.no_challenge')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ChallengesTab;
