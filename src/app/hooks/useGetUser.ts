import { useEffect } from "react";
import {
  useFollowingListStore,
  useUserProfileStore,
} from "../store/user-store";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { serviceGetOtherUserData } from "../service/user";
import { serviceGetMyProfile } from "../service/auth";
import { serviceGetListFollowing } from "../service/profile";
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
      .catch(() => {
        GlobalDialogController.showModal({
          title: "Error",
          message: "User not found",
        });
      });
  };

  useEffect(() => {
    fetchingUserData();
  }, []);
};

export const useGetListFollowing = () => {
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const { setFollowingList } = useFollowingListStore();
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
  }, []);
};
