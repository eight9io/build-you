import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import NavButton from '../../common/Buttons/NavButton';
import Button from '../../common/Buttons/Button';
import AppleLoginButton from '../../common/Buttons/AppleLoginButton';
import LinkedInLoginButton from '../../common/Buttons/LinkedInLoginButton';
import GoogleLoginButton from '../../common/Buttons/GoogleLoginButton';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
const RegisterModal = ({
  navigation,
  modalVisible,
  setModalVisible,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      presentationStyle="pageSheet"
      style={{ borderRadius: 10 }}
    >
      <View className=" bg-white " style={{ borderRadius: 10 }}>
        <View className="absolute z-10 my-6 ml-4 ">
          <NavButton
            onPress={() => setModalVisible(false)}
            text={t('button.back') as string}
            withBackIcon
          />
        </View>
        <SafeAreaView>
          <View className="h-full p-5">
            <View className="flex h-[65%] pt-4">
              <View className="h-[70%]">
                <Image
                  source={require('./asset/img-login.png')}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              </View>
              <View className="basis-1/3 justify-center px-4 pt-4">
                <Text className="text-h4 text-center font-medium leading-6 ">
                  {t('register_modal.title')}
                </Text>
                <Text className="text-gray-dark mt-3 text-center text-base opacity-90">
                  {t('register_modal.description')}
                </Text>
              </View>
            </View>
            <View className="h-[35%] flex-col items-center pt-5">
              {Platform.OS === 'ios' ? (
                <AppleLoginButton
                  title={t('register_modal.apple') || 'Register with Apple'}
                />
              ) : null}
              <LinkedInLoginButton
                title={t('register_modal.linked') || 'Register with Linkedin'}
              />
              <GoogleLoginButton
                title={t('register_modal.google') || 'Register with Google'}
              />
              <Button
                title={t('register_modal.register')}
                containerClassName="border-primary-default flex-row border-[1px] m-2"
                textClassName="text-primary-default ml-2 text-base font-bold"
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('RegisterScreen');
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default RegisterModal;
