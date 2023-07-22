import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FC, useEffect } from 'react';
import Button from './Button';
import IconGoogle from './asset/Google.svg';
import { googleLogin } from '../../../service/auth';
import GlobalDialogController from '../Dialog/GlobalDialogController';
import { useAuthStore } from '../../../store/auth-store';
import { addAuthTokensLocalOnLogin } from '../../../utils/checkAuth';
import { useTranslation } from 'react-i18next';

interface IGoogleLoginButtonProps {
  title?: string;
}
const GoogleLoginButton: FC<IGoogleLoginButtonProps> = ({ title }) => {
  const { setAccessToken, setRefreshToken } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const handleGoogleBtnClicked = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        const res = await googleLogin(userInfo.idToken);
        if (res.status === 201 || res.status === 200) {
          setAccessToken(res?.data.authorization || null);
          setRefreshToken(res?.data.refresh || null);
          addAuthTokensLocalOnLogin(
            res?.data.authorization || null,
            res?.data.refresh || null
          );
        }
      }
    } catch (error) {
      GlobalDialogController.showModal({
        title: 'Error',
        message:
          t('errorMessage:500') ||
          'Something went wrong. Please try again later!',
        button: 'OK',
      });
      console.error(error);
    }
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
