import { View, Text, ScrollView, FlatList } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IChallenge, IProgressChallenge } from '../../../../types/challenge';
import { useUserProfileStore } from '../../../../store/user-data';

import AddIcon from '../../../../component/asset/add.svg';
import Button from '../../../../component/common/Buttons/Button';
import ProgressCard from '../../../../component/Card/ProgressCard/ProgressCard';
import AddNewChallengeProgressModal from '../../../../component/modal/AddNewChallengeProgressModal';
import httpInstance from '../../../../utils/http';

import SkeletonLoadingCommon from '../../../../component/common/SkeletonLoadings/SkeletonLoadingCommon';

interface IProgressTabProps {
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  challengeData: IChallenge;
}

export const ProgressTab: FC<IProgressTabProps> = ({
  setShouldRefresh,
  challengeData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [localProgressData, setLocalProgressData] = useState<
    IProgressChallenge[]
  >([]);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const [progressLoading, setProgressLoading] = useState<boolean>(true);

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
        .catch((err) => {
          console.log(err);
        });
    });
    setLocalProgressData(progressData as IProgressChallenge[]);
    setTimeout(() => {
      setProgressLoading(false);
    }, 800);
  }, [challengeData]);

  useEffect(() => {
    if (shouldRefetch) {
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
  }, [shouldRefetch]);

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const handleEditProgress = () => {
    setShouldRefresh(true);
  };

  const handleDeleteProgressSuccess = () => {
    setShouldRefresh(true);
  };
  const AddNewChallengeProgressButton = () => {
    return (
      <View className="pt-4">
        <View className="mx-4 ">
          <Button
            containerClassName="  bg-primary-default flex-none px-1 "
            textClassName="line-[30px] text-center text-md font-medium text-white ml-2"
            title={t('challenge_detail_screen.upload_new_progress') as string}
            Icon={<AddIcon fill={'white'} />}
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

  return (
    <View className="h-full flex-1">
      {progressLoading && <SkeletonLoadingCommon />}
      {!progressLoading && (
        <FlatList
          data={localProgressData}
          ListHeaderComponent={<AddNewChallengeProgressButton />}
          renderItem={({ item }) => (
            <ProgressCard
              itemProgressCard={item}
              userData={userData}
              onEditProgress={handleEditProgress}
              onDeleteProgressSuccess={handleDeleteProgressSuccess}
            />
          )}
          contentContainerStyle={{ paddingBottom: 300 }}
        />
      )}
    </View>
  );
};

export default ProgressTab;
