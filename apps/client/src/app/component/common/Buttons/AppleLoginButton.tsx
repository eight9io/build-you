import * as AppleAuthentication from 'expo-apple-authentication';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import Button from '../../common/Buttons/Button';
import IconApple from './asset/Apple.svg';

interface IAppleLoginButtonProps {
  title?: string;
}
const AppleLoginButton: FC<IAppleLoginButtonProps> = ({ title }) => {
  const { t } = useTranslation();

  const handleAppleLogin = async () => {
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) throw new Error('Apple login is not available');
      
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('credential: ', credential.identityToken);
    } catch (error: any) {
      //  ignore case the user canceled the sign-in flow
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        console.log(error);
      }
    }
  };

  return (
    <Button
      title={title}
      containerClassName="bg-black-default flex-row  items-center justify-center m-2"
      textClassName="text-white ml-2 text-base font-bold"
      Icon={<IconApple />}
      onPress={handleAppleLogin}
    />
  );
};

export default AppleLoginButton;
