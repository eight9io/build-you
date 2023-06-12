import { View, Text, ScrollView, FlatList } from 'react-native';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IChallenge } from '../../../../types/challenge';
import { useUserProfileStore } from '../../../../store/user-data';

import AddIcon from '../../../../component/asset/add.svg';
import Button from '../../../../component/common/Buttons/Button';
import ProgressCard from '../../../../component/Card/ProgressCard/ProgressCard';
import AddNewChallengeProgressModal from '../../../../component/modal/AddNewChallengeProgressModal';


interface IProgressTabProps {
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  challengeData: IChallenge;
}

export const ProgressTab: FC<IProgressTabProps> = ({
  setShouldRefresh,
  challengeData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const progressData = challengeData.progress;
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

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
            setShouldProgressPageRefresh={setShouldRefresh}
            challengeId={challengeData.id}
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={progressData}
      ListHeaderComponent={<AddNewChallengeProgressButton />}
      renderItem={({ item }) => (
        <ProgressCard itemProgressCard={item} userData={userData} />
      )}
      contentContainerStyle={{ paddingBottom: 300 }}
    />
  );
};

export default ProgressTab;
