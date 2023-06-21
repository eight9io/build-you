import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../component/common/Buttons/Button';

import AddIcon from '../../../../asset/add.svg';
import BinIcon from '../../../../asset/bin.svg';

import AddNewEmployeeModal from '../../../../modal/company/AddNewEmployeeModal';
import { MOCK_FOLLOW_USERS } from '../../../../../mock-data/follow';

interface IEmployeesTabProps {}

interface IEmployeesItemProps {
  item: any;
}

const EmployeesItem: FC<IEmployeesItemProps> = ({ item }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {}}
      className="mb-5 flex-row items-center justify-between gap-3"
    >
      <View className="flex flex-row items-center justify-center">
        <Image
          source={{ uri: item.avatar }}
          resizeMode="contain"
          className="h-10 w-10 rounded-full"
        />
        <Text className="text-basic-black pl-3 text-base font-semibold">
          {item.name}
        </Text>
      </View>

      <View>
        <Button Icon={<BinIcon fill={'black'} />} />
      </View>
    </TouchableOpacity>
  );
};

export const EmployeesTab: FC<IEmployeesTabProps> = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const AddNewChallengeEmployeesButton = () => {
    return (
      <View className="pb-4">
        <View className=" h-12">
          <Button
            title={t('challenge_detail_screen.add_new_employees') as string}
            containerClassName="bg-primary-default"
            textClassName="text-white text-md font-semibold py-4 ml-2"
            Icon={<AddIcon fill={'white'} />}
            onPress={() => setIsModalVisible(true)}
          />
          <AddNewEmployeeModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={MOCK_FOLLOW_USERS}
      ListHeaderComponent={<AddNewChallengeEmployeesButton />}
      renderItem={({ item }) => <EmployeesItem item={item} />}
      contentContainerStyle={{ paddingBottom: 300 }}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default EmployeesTab;
