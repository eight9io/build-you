import React, { FC } from 'react';
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
}

const ChallengesTab: FC<IChallengesTabProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [otherUserChallenge, setOtherUserChallenge] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    getChallengeByUserId(userId)
      .then((res) => {
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
    navigation.navigate('OtherUserProfileDetailsScreen', {
      challengeId,
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
              isFromOtherUser
              imageSrc={`${item.image}`}
              handlePress={() => handleNavigateToChallengeDetail(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {otherUserChallenge.length === 0 && !isLoading && (
        <View className=" h-full flex-1 items-center justify-center">
          <Text className="text-lg text-gray-400 ">
            {t('company_profile_screen.no_challenge')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ChallengesTab;
