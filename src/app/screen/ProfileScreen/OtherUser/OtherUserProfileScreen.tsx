import { AxiosError } from "axios";
import React, { FC, useLayoutEffect, useState } from "react";
import { View, SafeAreaView, Text, FlatList } from "react-native";
import { NavigationProp, Route, useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import IconCompany from "./asset/company.svg";
import { IUserData } from "../../../types/user";

import { RootStackParamList } from "../../../navigation/navigation.type";

import { isObjectEmpty } from "../../../utils/common";

import CoverImage from "../../../component/Profile/CoverImage/CoverImage";
import ProfileAvatar from "../../../component/common/Avatar/ProfileAvatar/ProfileAvatar";
import Button, {
  OutlineButton,
} from "../../../component/common/Buttons/Button";
import SkeletonLoadingCommon from "../../../component/common/SkeletonLoadings/SkeletonLoadingCommon";

import DefaultAvatar from "../../../component/asset/default-avatar.svg";
import OtherUserProfileTabs from "../../../component/Profile/ProfileTabs/OtherUser/OtherUserProfileTabs";
import GlobalDialogController from "../../../component/common/Dialog/GlobalDialog/GlobalDialogController";
import ConfirmDialog from "../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";

import {
  useFollowingListStore,
  useUserProfileStore,
} from "../../../store/user-store";
import { serviceFollow, serviceUnfollow } from "../../../service/profile";
import { useGetOtherUserData } from "../../../hooks/useGetUser";
import { fetchNewFollowingData } from "../../../utils/profile";
import { onShareUserLink } from "../../../utils/native/share/shareLink.util";

import ShareIcon from "../../../../../assets/svg/share.svg";

interface IOtherUserProfileComponentProps {
  route: Route<
    "OtherUserProfileScreen",
    { userId: string; isFollowing?: boolean; isFollower?: boolean }
  >;
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
    } catch (error: AxiosError | any) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          (t("error_general_message") as string) || "Something went wrong",
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
        title: t("dialog.err_title"),
        message:
          (t("error_general_message") as string) || "Something went wrong",
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
  route,
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
      title: t("dialog.err_title"),
      message: (t("error_general_message") as string) || "Something went wrong",
    });
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  }

  return (
    <View className={clsx("relative h-full flex-1 flex-col bg-white")}>
      {otherUserData && (
        <View className="relative h-full flex-1 flex-col">
          <TopSectionOtherProfile otherUserData={otherUserData} />
          <View className={clsx("bg-white px-4 pb-2 pt-12")}>
            <Text className={clsx("text-[26px] font-medium")}>
              {otherUserData?.name} {otherUserData?.surname}
            </Text>
          </View>
          {otherUserData?.isShowCompany && otherUserData?.employeeOf?.name && (
            <View className={clsx(" flex-row gap-2 px-4 pt-1")}>
              <IconCompany />

              <Text className={clsx(" text-[14px]  font-medium ")}>
                {otherUserData?.employeeOf?.name}
              </Text>
            </View>
          )}
          <OtherUserProfileTabs otherUserData={otherUserData} route={route} />
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View className="mr-3">
            <Button
              Icon={<ShareIcon />}
              onPress={() => onShareUserLink(userId)}
            />
          </View>
        );
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView className="justify-content: space-between h-full flex-1 bg-gray-50">
      <View className="h-full">
        <OtherUserProfileComponent
          route={route}
          userId={userId}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
};

export default OtherUserProfileScreen;
