import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { FC, useState } from 'react';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Button from '../../../../common/Buttons/Button';

import AddIcon from '../../../../asset/add.svg';
import BinIcon from '../../../../asset/bin.svg';

import AddNewEmployeeModal from '../../../../modal/company/AddNewEmployeeModal';
import { MOCK_FOLLOW_USERS } from '../../../../../mock-data/follow';
import { IUserData } from 'apps/client/src/app/types/user';
import Empty from '../../../../asset/emptyFollow.svg';
import clsx from 'clsx';
import { useUserProfileStore } from 'apps/client/src/app/store/user-data';
interface IEmployeesTabProps {
  employeeList: any[];
}

interface IEmployeesItemProps {
  item: any;
  isCompany?: boolean | null;
}

const EmployeesItem: FC<IEmployeesItemProps> = ({ item, isCompany }) => {
  let newUrl = item.avatar;
  if (newUrl && !newUrl.startsWith('http')) {
    newUrl = `https://buildyou-front.stg.startegois.com${newUrl}`;
  }
  if (newUrl?.includes(';')) {
    newUrl = newUrl.split(';')[0];
  }
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {}}
      className="mb-5 mr-5 flex-row items-center justify-between gap-3"
    >
      <View className="flex flex-row items-center justify-center">
        <Image
          source={{ uri: newUrl }}
          contentFit="contain"
          className="h-10 w-10 rounded-full"
        />
        <Text className="text-basic-black pl-3 text-base font-semibold">
          {item.name}
        </Text>
      </View>

      {isCompany && (
        <View>
          <Button Icon={<BinIcon fill={'black'} />} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const EmployeesTab: FC<IEmployeesTabProps> = ({ employeeList }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const AddNewChallengeEmployeesButton = () => {
    return (
      <View className="mr-2 px-4 pb-4 pt-4 ">
        <View className=" mt-4 h-12">
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
    <View className="flex-1 p-5">
      {employeeList.length > 0 && (
        <FlatList
          data={employeeList}
          ListHeaderComponent={
            userProfile?.companyAccount ? (
              <AddNewChallengeEmployeesButton />
            ) : null
          }
          renderItem={({ item }) => (
            <EmployeesItem
              item={item}
              isCompany={userProfile?.companyAccount}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {employeeList.length == 0 && userProfile?.companyAccount && (
        <>
          <AddNewChallengeEmployeesButton />
          <View className=" mx-6 mb-[100px] flex-1 items-center justify-center">
            <Empty />
            <View
              className={clsx(
                'mt-4 flex flex-col items-center justify-center text-[#6C6E76]'
              )}
            >
              <Text className={clsx('text-lg text-[#6C6E76]')}>
                {t('empty_employee.content_1')}
              </Text>
              <Text className={clsx('text-center text-lg text-[#6C6E76]')}>
                {t('empty_employee.content_2')}
                <Text className={clsx('text-primary-default')}>
                  {' '}
                  {t('empty_employee.content_3')}{' '}
                </Text>
                {t('empty_employee.content_4')}{' '}
              </Text>
            </View>
          </View>
        </>
      )}
      {employeeList.length == 0 && !userProfile?.companyAccount && (
        <View className="align-center mt-[150px] items-center justify-center ">
          <Text className="text-lg text-gray-400 ">
            {t('company_profile_screen.no_challenge')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default EmployeesTab;
