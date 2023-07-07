import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { FC, useState } from 'react';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import AddIcon from '../../../../asset/add.svg';
import BinIcon from '../../../../asset/bin.svg';

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
  // let newUrl = item.avatar;
  // if (newUrl && !newUrl.startsWith('http')) {
  //   newUrl = `https://buildyou-front.stg.startegois.com${newUrl}`;
  // }
  // if (newUrl?.includes(';')) {
  //   newUrl = newUrl.split(';')[0];
  // }
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {}}
      className="mb-5 flex-row items-center justify-between gap-3 px-1"
    >
      <View className="flex flex-row items-center justify-center">
        <Image
          source={{ uri: item.avatar }}
          className="h-10 w-10 rounded-full"
        />
        <Text className="text-basic-black pl-3 text-base font-semibold">
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const EmployeesCompany: FC<IEmployeesTabProps> = ({ employeeList }) => {
  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

  return (
    <View className="flex-1">
      <View className="mt-5 px-4">
        {employeeList.length > 0 && (
          <FlatList
            data={employeeList}
            renderItem={({ item }) => (
              <EmployeesItem
                item={item}
                isCompany={userProfile?.companyAccount}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>

      {employeeList.length == 0 && !userProfile?.companyAccount && (
        <View className="align-center mt-[150px] items-center justify-center ">
          <Text className="text-lg text-gray-400 ">
            {t('empty_employee.content_1')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default EmployeesCompany;
