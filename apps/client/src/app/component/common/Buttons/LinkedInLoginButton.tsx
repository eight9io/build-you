import { useTranslation } from 'react-i18next';
import Button from './Button';
import IconLinkedIn from './asset/LinkedIn.svg';
import { FC, useState } from 'react';
import { getLinkedInAccessToken } from '../../../service/auth';
import LinkedInModal from '../../modal/LinkedInModal';

interface ILinkedInLoginButtonProps {
  title?: string;
}
const LinkedInLoginButton: FC<ILinkedInLoginButtonProps> = ({ title }) => {
  const { t } = useTranslation();
  const [linkedInModalVisible, setLinkedInModalVisible] = useState(false);
  const handleLinkedInBtnClicked = async () => {
    setLinkedInModalVisible(true);
  };

  const handleLinkedInLoginCancel = () => {
    setLinkedInModalVisible(false);
  };

  const handleLinkedInLoginSuccess = async (authrozationCode: string) => {
    setLinkedInModalVisible(false);
    const result = await getLinkedInAccessToken(authrozationCode);
    const token = result.data?.access_token;
    if (!token) throw new Error('Cannot get access token from linkedin');
    console.log('linkedin token: ', token);
  };
  return (
    <>
      <Button
        title={title}
        containerClassName="bg-sky-20 flex-row m-2"
        textClassName="text-white ml-2 text-base font-bold"
        Icon={<IconLinkedIn />}
        onPress={handleLinkedInBtnClicked}
      />
      <LinkedInModal
        isVisible={linkedInModalVisible}
        onLoginCancel={handleLinkedInLoginCancel}
        onLoginSuccess={handleLinkedInLoginSuccess}
      />
    </>
  );
};

export default LinkedInLoginButton;
