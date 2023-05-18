import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import BackButton from '../../common/BackButton';
import Button from '../../common/Buttons/Button';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useTranslation } from 'react-i18next';

import IconApple from './asset/Apple.svg';
import IconGoogle from './asset/Google.svg';
import IconLinkedIn from './asset/LinkedIn.svg';
import { useNavigation } from '@react-navigation/native';
interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
const index = ({ navigation, modalVisible, setModalVisible }: Props) => {
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
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.NX_IOS_CLIENT_ID,
    expoClientId: process.env.NX_EXPO_CLIENT_ID,
    selectAccount: true,
    scopes: ['profile', 'email'],
    responseType: 'id_token',
  });
  useEffect(() => {
    if (response?.type === 'success') {
      const { params } = response;
      console.log('idToken: ', params.id_token);
    }
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync();
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
      onPress: () => {
        console.log('linked');
      },
    },
    {
      title: t('modal_login.google'),
      containerClassName:
        'bg-sky-default  flex-row  items-center justify-center m-2',

      Icon: <IconGoogle />,
      onPress: () => {
        handleGoogleLogin();
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
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ flex: 1 }}>
            <BackButton onPress={() => setModalVisible(false)} />

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
        </View>
        {/* <LinkedInModal
          clientID="86bd2r3oeeeqwj"
          clientSecret="MfPE717c0ygsZN1v"
          redirectUri="http://localhost:8081"
          onSuccess={(token) => console.log(token)}
        /> */}
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
