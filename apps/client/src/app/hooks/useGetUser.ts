import { useEffect, useState } from 'react';
import httpInstance, { setAuthToken } from '../utils/http';
import { useUserProfileStore } from '../store/user-data';
import { useAuthStore } from '../store/auth-store';

import { IUserData } from '../types/user';

export const useGetUserData = () => {
  const [isCompleteProfile, setIsCompleteProfile] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessToken } = useAuthStore();
  const { setUserProfile } = useUserProfileStore();

  const accessToken = getAccessToken();

  useEffect(() => {
    if (accessToken !== null) {
      setLoading(true);
      setAuthToken(accessToken);

      httpInstance
        .get('/user/me')
        .then((res) => {
          setUserProfile(res.data);
          if (!!res.data?.birth) {
            setIsCompleteProfile(true);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
      setLoading(false);
    }
  }, [accessToken]);

  return { isCompleteProfile, setIsCompleteProfile, loading };
};
