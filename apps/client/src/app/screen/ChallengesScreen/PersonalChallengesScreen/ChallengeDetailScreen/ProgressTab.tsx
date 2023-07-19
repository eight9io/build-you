import { View, Text, ScrollView, FlatList } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  IChallenge,
  IChallengeOwner,
  IProgressChallenge,
} from '../../../../types/challenge';
import { useUserProfileStore } from '../../../../store/user-data';

import AddIcon from '../../../../component/asset/add.svg';
import Button from '../../../../component/common/Buttons/Button';
import ProgressCard from '../../../../component/Card/ProgressCard/ProgressCard';
import AddNewChallengeProgressModal from '../../../../component/modal/AddNewChallengeProgressModal';
import httpInstance from '../../../../utils/http';

import SkeletonLoadingCommon from '../../../../component/common/SkeletonLoadings/SkeletonLoadingCommon';
import EditChallengeProgressModal from '../../../../component/modal/EditChallengeProgressModal';
import { useIsFocused } from '@react-navigation/native';
import { IUserData } from 'apps/client/src/app/types/user';

interface IProgressTabProps {
  shouldRefresh: boolean;
  challengeData: IChallenge;
  isJoined?: boolean | null;
  isOtherUserProfile?: boolean;
  isChallengeCompleted?: boolean | null;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProgressTab: FC<IProgressTabProps> = ({
  isJoined = false,
  shouldRefresh,
  challengeData,
  setShouldRefresh,
  isChallengeCompleted = false,
  isOtherUserProfile = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [localProgressData, setLocalProgressData] = useState<
    IProgressChallenge[]
  >([]);
  const [progressIndexToUpdate, setProgressIndexToUpdate] =
    useState<number>(-1);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const [progressLoading, setProgressLoading] = useState<boolean>(true);
  const [isShowEditModal, setIsShowEditModal] = useState(false);

  const isFocused = useIsFocused();

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  const challengeOwner: IChallengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData.owner;
  const isCurrentUserOwnerOfChallenge = userData?.id === challengeOwner?.id;

  const { t } = useTranslation();
  useEffect(() => {
    const progressData =
      challengeData?.progress &&
      challengeData?.progress.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    progressData?.forEach((progress) => {
      httpInstance
        .get(`/challenge/progress/like/${progress.id}`)
        .then((res) => {
          progress.likes = res.data;
        })
        .catch((_) => {
          progress.likes = [];
        });
    });
    setLocalProgressData(progressData as IProgressChallenge[]);
    setTimeout(() => {
      setProgressLoading(false);
    }, 800);
  }, [challengeData]);

  useEffect(() => {
    if (!challengeData?.id) return;
    if (shouldRefetch || shouldRefresh || isFocused) {
      setProgressLoading(true);

      httpInstance.get(`/challenge/one/${challengeData.id}`).then((res) => {
        const progressDataLocal =
          res.data?.progress &&
          res.data?.progress.sort(
            (
              a: { createdAt: string | number | Date },
              b: { createdAt: string | number | Date }
            ) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
          );

        setLocalProgressData(progressDataLocal);
      });
      setShouldRefetch(false);
      setTimeout(() => {
        setProgressLoading(false);
      }, 800);
    }
  }, [shouldRefetch, isFocused]);

  const handleEditProgress = () => {
    setShouldRefresh(true);
  };

  const AddNewChallengeProgressButton = () => {
    return (
      <View className="pt-4">
        <View className="mx-4 ">
          <Button
            isDisabled={challengeData.status === 'closed'}
            containerClassName="bg-primary-default flex-none px-1"
            textClassName="line-[30px] text-center text-md font-medium text-white ml-2"
            disabledContainerClassName="bg-gray-light flex-none px-1"
            disabledTextClassName="line-[30px] text-center text-md font-medium text-gray-medium ml-2"
            title={t('challenge_detail_screen.upload_new_progress') as string}
            Icon={
              <AddIcon
                fill={challengeData.status === 'closed' ? '#C5C8D2' : 'white'}
              />
            }
            onPress={() => setIsModalVisible(true)}
          />
          <AddNewChallengeProgressModal
            setProgressLoading={setProgressLoading}
            setShouldRefetch={setShouldRefetch}
            challengeId={challengeData.id}
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
        </View>
      </View>
    );
  };

  const handleConfirmEditChallengeProgress = async () => {
    setIsShowEditModal(false); // Close the edit modal
    handleEditProgress(); // Navigate to the challenge progresses screen to refresh the list
  };

  return (
    <View className="h-full flex-1">
      {progressIndexToUpdate > -1 && (
        <EditChallengeProgressModal
          progress={localProgressData[progressIndexToUpdate]}
          isVisible={isShowEditModal}
          onClose={() => setIsShowEditModal(false)}
          onConfirm={handleConfirmEditChallengeProgress}
        />
      )}
      {progressLoading && <SkeletonLoadingCommon />}
      {!progressLoading && localProgressData?.length > 0 && (
        <FlatList
          data={localProgressData}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            (isJoined || isCurrentUserOwnerOfChallenge) && !isChallengeCompleted ? (
              <AddNewChallengeProgressButton />
            ) : null
          }
          renderItem={({ item, index }) => (
            <ProgressCard
              isJoined={isJoined}
              userData={item.owner}
              isOtherUserProfile={isOtherUserProfile}
              itemProgressCard={item}
              challengeId={challengeData.id}
              challengeName={challengeData.goal}
              setShouldRefresh={setShouldRefresh}
              setIsShowEditModal={setIsShowEditModal}
              challengeOwner={(challengeData.owner as IChallengeOwner[])[0]}
              isChallengeCompleted={challengeData.status === 'closed'}
              setProgressIndexToUpdate={() => setProgressIndexToUpdate(index)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      {!progressLoading && localProgressData?.length == 0 && (
        <View className="px-4 py-4">
          <Text className="selection: text-base">
            {t('challenge_detail_screen.no_progress_yet') as string}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProgressTab;
