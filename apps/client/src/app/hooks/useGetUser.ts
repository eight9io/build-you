import { useEffect, useState } from 'react';
import httpInstance from '../utils/http';
import { useUserProfileStore } from '../store/user-data';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGetUserData = (setLoading?: any) => {
  const { setUserProfile } = useUserProfileStore();

  const fetchingUserData = async () => {
    setLoading && setLoading(true);
    const accessToken = await AsyncStorage.getItem('@auth_token');
    if (accessToken !== null) {
      await httpInstance
        .get('/user/me')
        .then((res) => {
          setUserProfile(res.data);
        })
        .catch((err) => {
          console.error('err', err);
        });
    }
    setLoading && setLoading(false);
  };

  useEffect(() => {
    fetchingUserData();
  }, []);
};
