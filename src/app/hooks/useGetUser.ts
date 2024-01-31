import { useEffect } from "react";
import {
  useFollowingListStore,
  useUserProfileStore,
} from "../store/user-store";

import { serviceGetOtherUserData } from "../service/user";
import { serviceGetMyProfile } from "../service/auth";
import { serviceGetListFollowing } from "../service/profile";
import GlobalDialogController from "../component/common/Dialog/GlobalDialog/GlobalDialogController";
import { useTranslation } from "react-i18next";
import { CrashlyticService } from "../service/crashlytic";

export const useGetUserData = (setLoading?: any) => {
  const { setUserProfile } = useUserProfileStore();

  const fetchingUserData = async () => {
    setLoading && setLoading(true);
    await serviceGetMyProfile()
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.error("err", err);
        CrashlyticService({
          errorType: "Get User Data Error",
          error: err,
        });
      });
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
  const { t } = useTranslation();
  if (!userId || userId === null) return null;

  const fetchingUserData = async () => {
    try {
      await serviceGetOtherUserData(userId)
        .then((res) => {
          setOtherUserData(res.data);
        })
        .catch(() => {
          GlobalDialogController.showModal({
            title: t("dialog.err_title"),
            message: t("user_not_found"),
          });
        });
    } catch (error) {
      setOtherUserData(null);
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message: t("user_not_found"),
      });
    }
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
