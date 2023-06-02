import { useEffect, useState } from 'react';
import httpInstance, { setAuthTokenToHttpHeader } from '../utils/http';
import { useUserProfileStore } from '../store/user-data';
import { useAuthStore } from '../store/auth-store';

import { IUserData } from '../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IUseGetUserReturn {
  isCompleteProfile: boolean;
  setIsCompleteProfile: (value: boolean) => void;
  fetchingUserDataLoading: boolean;
}

export const useGetUserData: () => IUseGetUserReturn = () => {
  const [isCompleteProfile, setIsCompleteProfile] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { setUserProfile } = useUserProfileStore();

  const fetchingUserData = async () => {
    setLoading(true);
    const accessToken = await AsyncStorage.getItem('@auth_token');
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
  }, []);

  return {
    isCompleteProfile,
    setIsCompleteProfile,
    fetchingUserDataLoading: loading,
  };
};
