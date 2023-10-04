import clsx from "clsx";

import { useTranslation } from "react-i18next";
import { FC, useState } from "react";
import { View, Text } from "react-native";

import CoverImage from "./CoverImage/CoverImage";

import { OutlineButton } from "../common/Buttons/Button";
import ProfileAvatar from "../common/Avatar/ProfileAvatar/ProfileAvatar";

import { IUserData } from "../../types/user";
import { useUserProfileStore } from "../../store/user-store";
import ProfileTabs from "./ProfileTabs/Users/ProfileTabs";
import IconCompany from "./ProfileTabs/common/asset/company.svg";

export interface ITopSectionProfileProps {
  navigation: any;
  userData: IUserData | null;
  setIsLoading: (value: boolean) => void;
}

export interface IProfileComponentProps {
  userData: IUserData | null;
  navigation: any;
  setIsLoading: (value: boolean) => void;
}

export const TopSectionProfile: FC<ITopSectionProfileProps> = ({
  navigation,
  userData,
  setIsLoading,
}) => {
  const { t } = useTranslation();
  const handleClicked = () => {
    const isCompany = userData?.companyAccount || false;
    if (isCompany) {
      navigation.navigate("EditCompanyProfileScreen");
      return;
    }
    navigation.navigate("EditPersonalProfileScreen");
  };

  return (
    <View className={clsx("relative z-10")}>
      <CoverImage
        src={userData?.cover as string}
        setIsLoadingCover={setIsLoading}
      />

      <View className={clsx("absolute bottom-[-40px] left-0 ml-4")}>
        <ProfileAvatar
          src={userData?.avatar as string}
          setIsLoadingAvatar={setIsLoading}
        />
      </View>
      <View className={clsx("absolute bottom-[-25px] right-4 ")}>
        <OutlineButton
          title={t("button.edit_profile")}
          containerClassName="px-11 py-2"
          textClassName="text-base"
          onPress={handleClicked}
        />
      </View>
    </View>
  );
};

const ProfileComponent: FC<IProfileComponentProps> = ({
  userData,
  navigation,
  setIsLoading,
}) => {
  return (
    <View className={clsx("relative h-full w-full flex-1 flex-col bg-white")}>
      <TopSectionProfile
        navigation={navigation}
        userData={userData}
        setIsLoading={setIsLoading}
      />
      <View className={clsx(" px-4 pt-12")}>
        <Text className={clsx("text-[26px] font-medium")}>
          {userData?.name} {userData?.surname}
        </Text>
      </View>
      {userData?.isShowCompany && userData?.employeeOf?.user?.name && (
        <View className={clsx(" mb-3 flex-row gap-2 px-4")}>
          <IconCompany />

          <Text className={clsx(" text-[14px]  font-medium ")}>
            {userData?.employeeOf?.user?.name}
          </Text>
        </View>
      )}
      <ProfileTabs />
    </View>
  );
};

export default ProfileComponent;
