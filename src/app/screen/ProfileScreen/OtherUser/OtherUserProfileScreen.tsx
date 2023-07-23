import React, { FC, useEffect, useState } from "react";
import { View, SafeAreaView, Text, ScrollView, FlatList } from "react-native";
import { NavigationProp, Route, useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import IconCompany from "./asset/company.svg";
import { IUserData } from "../../../types/user";

import { RootStackParamList } from "../../../navigation/navigation.type";

import { isObjectEmpty } from "../../../utils/common";

import CoverImage from "../../../component/Profile/CoverImage/CoverImage";
import ProfileAvatar from "../../../component/common/Avatar/ProfileAvatar/ProfileAvatar";
import { OutlineButton } from "../../../component/common/Buttons/Button";
import SkeletonLoadingCommon from "../../../component/common/SkeletonLoadings/SkeletonLoadingCommon";

import DefaultAvatar from "../../../component/asset/default-avatar.svg";
import OtherUserProfileTabs from "../../../component/Profile/ProfileTabs/OtherUser/OtherUserProfileTabs";
import GlobalDialogController from "../../../component/common/Dialog/GlobalDialogController";
import {
  useFollowingListStore,
  useUserProfileStore,
} from "../../../store/user-data";
import { serviceFollow, serviceUnfollow } from "../../../service/profile";
import { useGetOtherUserData } from "../../../hooks/useGetUser";
import ConfirmDialog from "../../../component/common/Dialog/ConfirmDialog";
import { fetchNewFollowingData } from "../../../utils/profile";

interface IOtherUserProfileComponentProps {
  userId: string | null | undefined;
  navigation: any;
}

interface ITopSectionOtherProfileProps {
  otherUserData: IUserData | null;
}

const TopSectionOtherProfile: FC<ITopSectionOtherProfileProps> = ({
  otherUserData,
}) => {
  const { t } = useTranslation();
  const { getFollowingList, setFollowingList } = useFollowingListStore();
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const isOtherUser = otherUserData?.id !== userProfile?.id;

  const followingList = getFollowingList();
  const isFollowing =
    followingList &&
    followingList.find((item) => item.id === otherUserData?.id);
  const [isShowModalUnfollow, setIsShowModalUnfollow] = useState(false);
  const handleFollowClicked = async () => {
    try {
      await serviceFollow(otherUserData?.id);
      fetchNewFollowingData(userProfile?.id, (res: any) =>
        setFollowingList(res)
      );
    } catch (error) {
      GlobalDialogController.showModal({
        title: "Error",
        message: t("errorMessage:500") as string,
      });
    }
  };

  const handleUnfollowClicked = async () => {
    try {
      await serviceUnfollow(otherUserData?.id);
      await fetchNewFollowingData(userProfile?.id, (res: any) =>
        setFollowingList(res)
      );
      setIsShowModalUnfollow(false);
    } catch (error) {
      GlobalDialogController.showModal({
        title: "Error",
        message: t("errorMessage:500") as string,
      });
    }
  };

  return (
    <View className={clsx("relative z-10 bg-white")}>
      <ConfirmDialog
        title={t("dialog.unfollow_user.title") || ""}
        description={t("dialog.unfollow_user.description") || ""}
        isVisible={isShowModalUnfollow}
        onClosed={() => setIsShowModalUnfollow(false)}
        closeButtonLabel={t("dialog.cancel") || ""}
        confirmButtonLabel={t("dialog.unfollow") || ""}
        onConfirm={() => handleUnfollowClicked()}
      />
      <CoverImage isOtherUser src={otherUserData?.cover as string} />

      <View className={clsx("absolute bottom-[-40px] left-0 ml-4")}>
        {otherUserData?.avatar ? (
          <ProfileAvatar isOtherUser src={otherUserData?.avatar as string} />
        ) : (
          <View className={clsx("h-[101px] w-[101px] rounded-full bg-white")}>
            <DefaultAvatar width={"100%"} height={"100%"} />
          </View>
        )}
      </View>
      {isOtherUser && (
        <View className={clsx("absolute bottom-[-25px] right-4 ")}>
          {!isFollowing ? (
            <OutlineButton
              title={t("button.follow")}
              containerClassName="px-11 py-2"
              textClassName="text-base"
              onPress={handleFollowClicked}
            />
          ) : (
            <OutlineButton
              title={t("button.unfollow")}
              containerClassName="px-11 py-2  border-[#6C6E76]"
              textClassName="text-base text-[#6C6E76]"
              onPress={() => setIsShowModalUnfollow(true)}
            />
          )}
        </View>
      )}
    </View>
  );
};

interface IOtherUserProfileScreenProps {
  route: Route<
    "OtherUserProfileScreen",
    { userId: string; isFollowing?: boolean; isFollower?: boolean }
  >;
}

const OtherUserProfileComponent: FC<IOtherUserProfileComponentProps> = ({
  userId,
  navigation,
}) => {
  const [otherUserData, setOtherUserData] = useState<any | undefined>({});

  const { t } = useTranslation();

  useGetOtherUserData(userId, setOtherUserData);
  if (otherUserData && isObjectEmpty(otherUserData)) {
    return (
      <View className={clsx("relative mb-24 h-full flex-1 flex-col ")}>
        <SkeletonLoadingCommon />
      </View>
    );
  } else if (!otherUserData) {
    GlobalDialogController.showModal({
      title: "Error",
      message: t("errorMessage:500") as string,
    });
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  }
  return (
    <View className={clsx("relative mb-24 h-full flex-1 flex-col bg-white")}>
      {otherUserData && (
        <View>
          <TopSectionOtherProfile otherUserData={otherUserData} />
          <View className={clsx("bg-white px-4 pb-3 pt-12")}>
            <Text className={clsx("text-[26px] font-medium")}>
              {otherUserData?.name} {otherUserData?.surname}
            </Text>
          </View>
          {otherUserData?.isShowCompany && otherUserData?.employeeOf?.name && (
            <View className={clsx("my-4 flex-row gap-2 px-4 pt-1")}>
              <IconCompany />

              <Text className={clsx(" text-[14px]  font-medium ")}>
                {otherUserData?.employeeOf?.name}
              </Text>
            </View>
          )}
          <OtherUserProfileTabs otherUserData={otherUserData} />
        </View>
      )}
    </View>
  );
};

const OtherUserProfileScreen: FC<IOtherUserProfileScreenProps> = ({
  route,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userId } = route.params;

  return (
    <SafeAreaView className="justify-content: space-between h-full flex-1 bg-gray-50">
      <FlatList
        data={[]}
        renderItem={() => <View></View>}
        ListHeaderComponent={
          <OtherUserProfileComponent userId={userId} navigation={navigation} />
        }
      />
    </SafeAreaView>
  );
};

export default OtherUserProfileScreen;
