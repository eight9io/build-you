import httpInstance, { setAuthTokenToHttpHeader } from './http';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkUserCompleProfileAndCompany = async (
  setIsCompleteProfile: any,
  setIsMainAppLoading: any
) => {
  const localAuthToken = await AsyncStorage.getItem('@auth_token');
  setAuthTokenToHttpHeader(localAuthToken);

  const fetchingUserData = async () => {
    try {
      setIsMainAppLoading(true);

      await httpInstance.get('/user/me').then((res) => {
        //TODO: change companyAccount to true
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
      console.log(error);
    }
  };

  if (localAuthToken) {
    fetchingUserData();
  }
};
