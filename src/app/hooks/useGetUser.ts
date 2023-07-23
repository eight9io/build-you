import { useEffect, useState } from "react";
import httpInstance from "../utils/http";
import { useFollowingListStore, useUserProfileStore } from "../store/user-data";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { serviceGetOtherUserData } from "../service/user";
import { serviceGetMyProfile } from "../service/auth";
import { serviceGetListFollowing } from "../service/profile";
import { useAuthStore } from "../store/auth-store";
import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";

export const useGetUserData = (setLoading?: any) => {
  const { setUserProfile } = useUserProfileStore();

  const fetchingUserData = async () => {
    setLoading && setLoading(true);
    const accessToken = await AsyncStorage.getItem("@auth_token");
    if (accessToken !== null) {
      await serviceGetMyProfile()
        .then((res) => {
          setUserProfile(res.data);
        })
        .catch((err) => {
          console.error("err", err);
        });
    }
    setLoading && setLoading(false);
  };

  useEffect(() => {
    fetchingUserData();
  }, []);
};

export const useGetOtherUserData = (
  userId: string | null | undefined,
  setOtherUserData?: any
) => {
  if (!userId || userId === null) return null;

  const fetchingUserData = async () => {
    await serviceGetOtherUserData(userId)
      .then((res) => {
        setOtherUserData(res.data);
      })
      .catch((err) => {
        GlobalDialogController.showModal({
          title: "Error",
          message: "User not found",
        });
      });
  };

  useEffect(() => {
    fetchingUserData();
  }, [userId]);
};

export const useGetListFollowing = () => {
  const { getAccessToken } = useAuthStore();
  const { getUserProfile } = useUserProfileStore();
  const isToken = getAccessToken();
  const userProfile = getUserProfile();
  const { setFollowingList } = useFollowingListStore();
  if (!isToken) return null;
  const fetchFollowingData = async () => {
    if (!userProfile?.id) return null;
    await serviceGetListFollowing(userProfile?.id)
      .then((res) => {
        setFollowingList(res.data);
      })
      .catch((err) => {
        if (err.response.status == 404) setFollowingList([]);
      });
  };
  useEffect(() => {
    fetchFollowingData();
  }, [userProfile?.id]);
};
