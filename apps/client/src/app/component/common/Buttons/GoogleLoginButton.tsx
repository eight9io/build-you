import { useTranslation } from 'react-i18next';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { FC, useEffect } from 'react';
import Button from './Button';
import IconGoogle from './asset/Google.svg';

interface IGoogleLoginButtonProps {
  title?: string;
}
const GoogleLoginButton: FC<IGoogleLoginButtonProps> = ({ title }) => {
  const { t } = useTranslation();
  // Use this to ensure closing the popup after finishing login process
  WebBrowser.maybeCompleteAuthSession();

  // Using access token to authenticate with backend
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   iosClientId: process.env.NX_IOS_CLIENT_ID,
  //   expoClientId: process.env.NX_EXPO_CLIENT_ID,
  //   selectAccount: true,
  //   scopes: ['profile', 'email'],
  // });

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     console.log(authentication?.accessToken);
  //   }
  // }, [response]);

  // const handleGoogleLogin = () => {
  //   promptAsync();
  // };

  // Use id token to authenticate with backend
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useIdTokenAuthRequest({
      iosClientId: process.env.NX_IOS_CLIENT_ID,
      androidClientId: process.env.NX_ANDROID_CLIENT_ID,
      expoClientId: process.env.NX_EXPO_CLIENT_ID, // Used to run on Expo Go, no needed in development build and production
      selectAccount: true,
      scopes: ['profile', 'email'],
      responseType: 'id_token',
    });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { params } = googleResponse;
      handleGoogleLoginSuccess(params.id_token);
    }
  }, [googleResponse]);

  const handleGoogleBtnClicked = async () => {
    googlePromptAsync();
  };

  const handleGoogleLoginSuccess = (token: string) => {
    console.log('google token: ', token);
  };
  return (
    <Button
      title={title}
      containerClassName="bg-sky-default  flex-row  items-center justify-center m-2"
      textClassName="text-white ml-2 text-base font-bold"
      Icon={<IconGoogle />}
      onPress={handleGoogleBtnClicked}
    />
  );
};

export default GoogleLoginButton;
