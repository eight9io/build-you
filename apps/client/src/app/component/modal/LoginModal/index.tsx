import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useRef } from 'react';
import LinkedInModal from '@gcou/react-native-linkedin';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useTranslation } from 'react-i18next';
import NavButton from '../../common/Buttons/NavButton';
import Button from '../../common/Buttons/Button';
import { useEffect } from 'react';

import IconApple from './asset/Apple.svg';
import IconGoogle from './asset/Google.svg';
import IconLinkedIn from './asset/LinkedIn.svg';

interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
const index = ({ navigation, modalVisible, setModalVisible }: Props) => {
  const { t } = useTranslation();
  const linkedInModalRef = useRef<LinkedInModal>(null);
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
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useIdTokenAuthRequest({
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

  const handleLinkedInBtnClicked = async () => {
    linkedInModalRef.current?.open();
  };

  const handleLinkedInModalClose = () => {
    linkedInModalRef.current?.close();
  };

  const handleLinkedInLoginSuccess = (token?: string) => {
    console.log('linkedin token: ', token);
  };

  const arrayButton = [
    {
      title: t('modal_login.apple'),
      containerClassName:
        'bg-black-default flex-row  items-center justify-center m-2',

      Icon: <IconApple />,
      onPress: () => {
        console.log('apple');
      },
    },
    {
      title: t('modal_login.linked'),
      containerClassName: 'bg-sky-20 flex-row  items-center justify-center m-2',

      Icon: <IconLinkedIn />,
      onPress: async () => {
        handleLinkedInBtnClicked();
      },
    },
    {
      title: t('modal_login.google'),
      containerClassName:
        'bg-sky-default  flex-row  items-center justify-center m-2',

      Icon: <IconGoogle />,
      onPress: () => {
        handleGoogleBtnClicked();
      },
    },

    {
      title: t('modal_login.register'),
      containerClassName: ' border-primary-default border-[1px] m-2',
      textClassName: 'text-primary-default ml-2 text-md ',
      onPress: () => {
        setModalVisible(false);
        navigation.navigate('RegisterScreen');
      },
    },
  ];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      presentationStyle="overFullScreen"
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ flex: 1 }}>
            <NavButton
              onPress={() => setModalVisible(false)}
              text={t('button.back') as string}
            />

            <Image
              source={require('./asset/img-login.png')}
              className=" h-full w-full "
              resizeMode="contain"
            />
          </View>
          <View className="mt-5 flex-1">
            <Text className="text-h4 text-center font-medium leading-6 ">
              {t('modal_login.title')}
            </Text>
            <Text className="text-h6 mt-3  text-center leading-6 ">
              {t('modal_login.description')}
            </Text>
            <FlatList
              className="mt-3"
              data={arrayButton}
              renderItem={({ item }) => (
                <Button
                  key={item.title}
                  title={item.title}
                  containerClassName={item.containerClassName}
                  textClassName={
                    item.textClassName || 'text-white ml-2 text-md '
                  }
                  Icon={item.Icon}
                  onPress={item.onPress}
                />
              )}
              keyExtractor={(item) => item.title}
            />
          </View>

          <LinkedInModal
            clientID={process.env.NX_LINKEDIN_CLIENT_ID || ''}
            clientSecret={process.env.NX_LINKEDIN_CLIENT_SECRET || ''}
            redirectUri={process.env.NX_LINKEDIN_REDIRECT_URI || ''}
            onSuccess={(token) =>
              handleLinkedInLoginSuccess(token.access_token)
            }
            permissions={['r_liteprofile', 'r_emailaddress']}
            shouldGetAccessToken={true}
            ref={linkedInModalRef}
            areaTouchText={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onError={(error) => console.log('Linkedin login error: ', error)}
            renderClose={() => (
              <View className="absolute left-0 top-0">
                <NavButton
                  text="Cancel"
                  textClassName="text-blue-700 text-xl"
                  onPress={handleLinkedInModalClose}
                />
              </View>
            )}
            renderButton={() => null} // Hide default button
            containerStyle={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
              flex: 0,
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
            wrapperStyle={{
              backgroundColor: 'blue',
              height: '90%',
              flex: 0,
              borderWidth: 1,
              borderColor: 'white',
            }}
            closeStyle={{
              top: '12%',
              left: 15,
              width: '100%',
              backgroundColor: 'transparent',
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default index;
