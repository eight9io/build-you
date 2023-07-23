import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { EmployeesItemOtherCompany } from "../Company/Employees/Employees";

import { Image } from "expo-image";
import { useUserProfileStore } from "../../../../store/user-data";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/navigation.type";

interface IEmployeesTabProps {
  employeeList: any[];
}

export const EmployeesCompany: FC<IEmployeesTabProps> = ({ employeeList }) => {
  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1">
      <View className="mt-5 px-4">
        {employeeList.length > 0 && (
          <FlatList
            data={employeeList}
            renderItem={({ item }) => (
              <EmployeesItemOtherCompany
                item={item}
                isCompany={userProfile?.companyAccount}
                navigation={navigation}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>

      {employeeList.length == 0 && !userProfile?.companyAccount && (
        <View className="align-center mt-[150px] items-center justify-center ">
          <Text className="text-lg text-gray-400 ">
            {t("empty_employee.content_1")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default EmployeesCompany;
