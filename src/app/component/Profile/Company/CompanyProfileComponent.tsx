import clsx from "clsx";

import { useTranslation } from "react-i18next";
import { FC } from "react";
import { View, Text } from "react-native";
import { RouteProp } from "@react-navigation/native";

import { IUserData } from "../../../types/user";
import { RootStackParamList } from "../../../navigation/navigation.type";

import CompanyProfileTabs from "../ProfileTabs/Company/CompanyProfileTabs";

import { TopSectionProfile } from "../ProfileComponent";

interface ICompanyProfileComponentProps {
  userData: IUserData | null;
  navigation: any;
  setIsLoading: (value: boolean) => void;
  route: RouteProp<RootStackParamList, "CompanyProfileScreen">;
}

const CompanyProfileComponent: FC<ICompanyProfileComponentProps> = ({
  route,
  userData,
  navigation,
  setIsLoading,
}) => {
  const { t } = useTranslation();
  return (
    <View className={clsx("relative h-full flex-1 flex-col bg-white")}>
      <TopSectionProfile
        navigation={navigation}
        userData={userData}
        setIsLoading={setIsLoading}
      />
      <View className={clsx("mb-3 px-4 pt-12")}>
        <Text className={clsx("text-[26px] font-medium")}>
          {userData?.name} {userData?.surname}
        </Text>
      </View>
      <CompanyProfileTabs route={route} />
    </View>
  );
};

export default CompanyProfileComponent;
