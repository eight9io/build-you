import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FC, useEffect } from 'react';
import Button from './Button';
import IconGoogle from './asset/Google.svg';

interface IGoogleLoginButtonProps {
  title?: string;
}
const GoogleLoginButton: FC<IGoogleLoginButtonProps> = ({ title }) => {
  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const handleGoogleBtnClicked = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      alert(userInfo.idToken);
    } catch (error) {
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
