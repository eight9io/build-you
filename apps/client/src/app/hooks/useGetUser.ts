import { useEffect, useState } from 'react';
import httpInstance, { setAuthTokenToHttpHeader } from '../utils/http';
import { useUserProfileStore } from '../store/user-data';
import { useAuthStore } from '../store/auth-store';

import { IUserData } from '../types/user';

export const useGetUserData = () => {
  const [isCompleteProfile, setIsCompleteProfile] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { getAccessToken } = useAuthStore();
  const { setUserProfile } = useUserProfileStore();

  const accessToken = getAccessToken();

  const fetchingUserData = async () => {
    console.log('runned');
    setLoading(true);
    if (accessToken !== null) {
      setAuthTokenToHttpHeader(accessToken);
      await httpInstance
        .get('/user/me')
        .then((res) => {
          setUserProfile(res.data);
          if (!!res.data?.birth) {
            setIsCompleteProfile(true);
          }
        })
        .catch((err) => {
          console.error('err', err);
        });
    } else {
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingUserData();
  }, [accessToken]);

  return {
    isCompleteProfile,
    setIsCompleteProfile,
    fetchingUserDataLoading: loading,
  };
};
