import httpInstance, { setAuthTokenToHttpHeader } from './http';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkUserCompleProfileAndCompany = async (
  setIsCompleteProfile: any,
  setIsMainAppLoading: any
) => {
  const fetchingUserData = async () => {
    try {
      setIsMainAppLoading(true);

      await httpInstance.get('/user/me').then((res) => {
        if (res.data?.companyAccount === true) {
          setIsCompleteProfile(true);
        } else {
          if (res.data?.birth) {
            setIsCompleteProfile(true);
          } else {
            setIsCompleteProfile(false);
          }
        }
      });
      setIsMainAppLoading(false);
    } catch (error) {
      setIsMainAppLoading(false);
      console.log(error);
    }
  };

  fetchingUserData();
};
